const rfb = require('rfb2');
const port = 8090;// Server Port
const express = require('express');
const http = require('http');
const Png = require('fast-png');
const cors = require('cors');
const app = express();

var hizBoleni = 2;// Screen image interval for bad connections.Default value is 2.
//iframe için uzak site cors linki.
/*
app.use(cors({
    origin: 'http://XXX.XXX.XXX.XXX:XXXX'// Cors website link.
}));*/

let clients = [];
let activeConnections = new Map();

function createRfbConnection(config, socket, userId) {
    var i = 0;
    var j = 0;
    try {
        console.log(`Attempting to create RFB connection for user ${userId}...`);
        const startTime = Date.now();

        const r = rfb.createConnection({
            host: config.host,
            port: config.port,
            password: config.password
        });

        let initInterval = null;
        let updateInterval = null;
        let firstFrameReceived = false;
        let initialLoadComplete = false;

        r.once('connect', () => {
            const endTime = Date.now();
            const connectionTimeInSeconds = Math.ceil((endTime - startTime) / 1000);
            hizBoleni = Math.max(2, connectionTimeInSeconds);
            console.log(`RFB connection established for user ${userId} in ${connectionTimeInSeconds} seconds. Setting hizBoleni to: ${hizBoleni}`);

            // Save user info and connection.
            activeConnections.set(userId, {
                rfb: r,
                socket: socket,
                lastActivity: Date.now()
            });

            socket.emit('init', {
                width: r.width,
                height: r.height,
                userId: userId
            });

            initInterval = setInterval(() => {
                try {
                    r.requestUpdate(true, r.width / hizBoleni * i,r.height / hizBoleni * j, r.width / hizBoleni, r.height / hizBoleni);
                    if (i < hizBoleni - 1) {
                        i++;
                    } else if (j < hizBoleni - 1) {
                        j++;
                        i = 0;
                    } else {
                        i = 0;
                        j = 0;
                        if (!initialLoadComplete) {
                            initialLoadComplete = true;
                            console.log(`Initial load complete for user ${userId}, switching to full screen updates`);
                            if (initInterval) {
                                clearInterval(initInterval);
                            }
                            updateInterval = setInterval(() => {
                                try {
                                    const connection = activeConnections.get(userId);
                                    if (connection && connection.rfb) {
                                        connection.rfb.requestUpdate(true, 0, 0, r.width, r.height);
                                    }
                                } catch (error) {
                                    console.error(`Error requesting full screen update for user ${userId}:`, error);
                                }
                            }, 200);
                        }
                    }
                } catch (error) {
                    console.error(`Error requesting initial update for user ${userId}:`, error);
                }
            }, 100);
        });

        r.on('error', function (error) {
            console.error(`RFB error for user ${userId}:`, error);
            const connection = activeConnections.get(userId);
            if (connection) {
                if (connection.socket) {
                    connection.socket.emit('error', {
                        message: 'RFB connection error',
                        error: error.message
                    });
                }
            }
        });

        socket.on('frameReceived', () => {
            if (!firstFrameReceived) {
                firstFrameReceived = true;
                console.log(`First frame received for user ${userId}`);
            }
            const connection = activeConnections.get(userId);
            if (connection) {
                connection.lastActivity = Date.now();
            }
        });

        r.on('rect', function (rect) {
            try {
                if (!rect.data) return;

                const rgb = Buffer.alloc(rect.width * rect.height * 4);
                let offset = 0;

                for (let i = 0; i < rect.data.length; i += 4) {
                    rgb[offset++] = rect.data[i + 2];
                    rgb[offset++] = rect.data[i + 1];
                    rgb[offset++] = rect.data[i];
                    rgb[offset++] = rect.data[i + 3];
                }

                let image = Png.encode({
                    width: rect.width,
                    height: rect.height,
                    data: rgb
                });

                const connection = activeConnections.get(userId);
                if (connection && connection.socket) {
                    connection.socket.emit('frame', {
                        x: rect.x,
                        y: rect.y,
                        width: rect.width,
                        height: rect.height,
                        image: Buffer.from(image).toString('base64')
                    });
                }
            } catch (error) {
                console.error(`Error handling frame for user ${userId}:`, error);
            }
        });

        socket.on('mouse', function (evnt) {
            try {
                const connection = activeConnections.get(userId);
                if (connection && connection.rfb) {
                    connection.lastActivity = Date.now();
                    connection.rfb.pointerEvent(evnt.x, evnt.y, evnt.button);
                }
            } catch (error) {
                console.error(`Error handling mouse event for user ${userId}:`, error);
            }
        });

        socket.on('keyboard', function (evnt) {
            try {
                const connection = activeConnections.get(userId);
                if (connection && connection.rfb) {
                    connection.lastActivity = Date.now();
                    connection.rfb.keyEvent(evnt.keyCode, evnt.isDown);
                }
            } catch (error) {
                console.error(`Error handling keyboard event for user ${userId}:`, error);
            }
        });

        socket.on('disconnect', function () {
            console.log(`User ${userId} disconnected`);
            if (initInterval) clearInterval(initInterval);
            if (updateInterval) clearInterval(updateInterval);

            // Clear user connection information after disconnect.
            const connection = activeConnections.get(userId);
            if (connection) {
                if (connection.rfb) {
                    try {
                        connection.rfb.end();
                    } catch (error) {
                        console.error(`Error ending RFB connection for user ${userId}:`, error);
                    }
                }
                activeConnections.delete(userId);
            }

            clients = clients.filter(client => client.socket !== socket);
            // Restart the server after disconnect last active client.
            if (clients.length === 0) {
                console.log('No active clients, scheduling restart...');
                setTimeout(() => {
                    if (clients.length === 0) {
                        console.log('Executing PM2 restart...');
                        require('child_process').exec('pm2 restart all');
                    }
                }, 10000);
            }
        });

        clients.push({
            socket: socket,
            rfb: r,
            userId: userId
        });

        // Process events for error handling.
        process.on('uncaughtException', function (err) {
            console.error('Uncaught Exception:', err);
            const connection = activeConnections.get(userId);
            if (connection) {
                if (connection.rfb) connection.rfb.end();
                if (connection.socket) connection.socket.disconnect();
                activeConnections.delete(userId);
            }
        });

        return r;
    } catch (error) {
        console.error(`Error creating RFB connection for user ${userId}:`, error);
        socket.emit('error', {
            message: 'Failed to create RFB connection',
            error: error.message
        });
    }
}

const server = http.createServer(app);
app.use(express.static(__dirname + '/static/'));

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
    console.log(`Server started at: ${new Date().toISOString()}`);
});

const socketio = require('socket.io')(server);

socketio.sockets.on('connection', function (socket) {
    try {
        socket.on('init', function (config) {
            const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            console.log(`New connection request from user ${userId}`);
            console.log('Config:', config);
            createRfbConnection(config, socket, userId);
        });
    } catch (error) {
        console.error('Error during socket connection:', error);
        socket.emit('error', {
            message: 'Connection error',
            error: error.message
        });
    }
});
// Check active connections every minute.
setInterval(() => {
    const now = Date.now();
    for (const [userId, connection] of activeConnections.entries()) {
        if (now - connection.lastActivity > 5 * 60 * 1000) {
            console.log(`Closing inactive connection for user ${userId}`);
            if (connection.rfb) {
                try {
                    connection.rfb.end();
                } catch (error) {
                    console.error(`Error ending RFB connection for inactive user ${userId}:`, error);
                }
            }
            if (connection.socket) {
                try {
                    connection.socket.disconnect();
                } catch (error) {
                    console.error(`Error disconnecting socket for inactive user ${userId}:`, error);
                }
            }
            activeConnections.delete(userId);
        }
    }
}, 60000);

// Graceful shutdown.
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Closing all connections...');
    for (const [userId, connection] of activeConnections.entries()) {
        if (connection.rfb) connection.rfb.end();
        if (connection.socket) connection.socket.disconnect();
    }
    activeConnections.clear();
    server.close(() => {
        console.log('Server shut down complete');
        process.exit(0);
    });
});
