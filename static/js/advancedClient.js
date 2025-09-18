(function () {
    var Config = {
        URL: 'http://127.0.0.1:8090'//Your server ip or hostname
    },
        keyMap = [[8, 65288, 65288], [9, 65289, 65289], [13, 65293, 65293], [16, 65505, 65505], [16, 65506, 65506], [17, 65507, 65507], [17, 65508, 65508], [18, 65513, 65513], [18, 65514, 65514], [27, 65307, 65307], [32, 32, 32], [33, 65365, 65365], [34, 65366, 65366], [35, 65367, 65367], [36, 65360, 65360], [37, 65361, 65361], [38, 65362, 65362], [39, 65363, 65363], [40, 65364, 65364], [45, 65379, 65379], [46, 65535, 65535], [48, 48, 41], [49, 49, 33], [50, 50, 64], [51, 51, 35], [52, 52, 36], [53, 53, 37], [54, 54, 94], [55, 55, 38], [56, 56, 42], [57, 57, 40], [65, 97, 65], [66, 98, 66], [67, 99, 67], [68, 100, 68], [69, 101, 69], [70, 102, 70], [71, 103, 71], [72, 104, 72], [73, 105, 73], [74, 106, 74], [75, 107, 75], [76, 108, 76], [77, 109, 77], [78, 110, 78], [79, 111, 79], [80, 112, 80], [81, 113, 81], [82, 114, 82], [83, 115, 83], [84, 116, 84], [85, 117, 85], [86, 118, 86], [87, 119, 87], [88, 120, 88], [89, 121, 89], [90, 122, 90],[91, 65515, 65515], [92, 65516, 65516], [93, 65383, 65383], [97, 49, 49], [98, 50, 50], [99, 51, 51], [100, 52, 52], [101, 53, 53], [102, 54, 54], [103, 55, 55], [104, 56, 56], [105, 57, 57], [106, 42, 42], [107, 61, 61], [109, 45, 45], [110, 46, 46], [111, 47, 47], [112, 65470, 65470], [113, 65471, 65471], [114, 65472, 65472], [115, 65473, 65473], [116, 65474, 65474], [117, 65475, 65475], [118, 65476, 65476], [119, 65477, 65477], [120, 65478, 65478], [121, 65479, 65479], [122, 65480, 65480], [123, 65481, 65481], [186, 59, 58], [187, 61, 43], [188, 44, 60], [189, 45, 95], [190, 46, 62], [191, 47, 63], [192, 96, 126], [220, 92, 124], [221, 93, 125], [222, 39, 34], [219, 91, 123]];

    function Screen(canvas) {
        console.log("Screen Constructor");
        this._canvas = canvas;
        this._context = canvas.getContext('2d');
        this._scale = { x: 1, y: 1 };
        this._actualWidth = 0;
        this._actualHeight = 0;
        this._displayScale = 1;
        this._canvasRect = null;
        
        // Device pixel ratio
        this._devicePixelRatio = window.devicePixelRatio || 1;
        console.log("Device Pixel Ratio:", this._devicePixelRatio);
    }

    Screen.prototype.drawRect = function (rect) {
        var img = new Image(),
            self = this;
        img.width = rect.width;
        img.height = rect.height;
        img.src = 'data:image/png;base64,' + rect.image;
        img.onload = function () {
            console.log("Image loaded");
            self._context.drawImage(this, rect.x, rect.y, rect.width, rect.height);
        };
        img.onerror = function (error) {
            console.error('Image loading error:', error);
        };
    };

    Screen.prototype.fitToScreen = function() {
        var canvas = this._canvas;
        var isFullscreen = document.body.classList.contains('fullscreen-mode');
        
        if (isFullscreen) {
            // Tam ekran modunda
            var maxWidth = window.innerWidth;
            var maxHeight = window.innerHeight;
            
            // Oran hesapla (aspect ratio koruyarak)
            var scaleX = maxWidth / this._actualWidth;
            var scaleY = maxHeight / this._actualHeight;
            this._displayScale = Math.min(scaleX, scaleY);
            
            var displayWidth = Math.floor(this._actualWidth * this._displayScale);
            var displayHeight = Math.floor(this._actualHeight * this._displayScale);
            
            canvas.style.width = displayWidth + 'px';
            canvas.style.height = displayHeight + 'px';
            
            // Canvas'ın gerçek çözünürlüğünü ayarlama
            canvas.width = this._actualWidth;
            canvas.height = this._actualHeight;
            
            // Tam ekranda ortalama
            canvas.style.position = 'fixed';
            canvas.style.top = '50%';
            canvas.style.left = '50%';
            canvas.style.transform = 'translate(-50%, -50%)';
            canvas.style.margin = '0';
            canvas.style.imageRendering = 'pixelated'; // Crisp rendering
        } else {
            // Normal modda
            var headerHeight = 100;
            var availableHeight = window.innerHeight - headerHeight - 100;
            var availableWidth = window.innerWidth - 80;
            
            var maxCSSWidth = 1280;
            var maxCSSHeight = 720;
            
            var targetWidth = Math.min(availableWidth, maxCSSWidth);
            var targetHeight = Math.min(availableHeight, maxCSSHeight);
            
            var scaleX = targetWidth / this._actualWidth;
            var scaleY = targetHeight / this._actualHeight;
            this._displayScale = Math.min(scaleX, scaleY, 1);
            
            var displayWidth = Math.floor(this._actualWidth * this._displayScale);
            var displayHeight = Math.floor(this._actualHeight * this._displayScale);
            
            canvas.style.width = displayWidth + 'px';
            canvas.style.height = displayHeight + 'px';
            
            // Canvas'ın gerçek çözünürlüğü
            canvas.width = this._actualWidth;
            canvas.height = this._actualHeight;
            
            canvas.style.position = 'static';
            canvas.style.transform = 'none';
            canvas.style.margin = '50px auto 0';
            canvas.style.display = 'block';
            canvas.style.imageRendering = 'auto';
        }
        
        console.log(`Mode: ${isFullscreen ? 'Fullscreen' : 'Normal'}, Display scale: ${this._displayScale}, Canvas size: ${canvas.width}x${canvas.height}, Display size: ${canvas.style.width} x ${canvas.style.height}`);
        
        // Scale hesaplamalarını güncelle
        this.updateScale();
    };

    Screen.prototype.updateScale = function () {
        // Canvas'ın ekrandaki gerçek boyutları
        this._canvasRect = this._canvas.getBoundingClientRect();
        
        // Scale faktörlerini hesaplama
        this._scale.x = this._actualWidth / this._canvasRect.width;
        this._scale.y = this._actualHeight / this._canvasRect.height;
        
        console.log(`Canvas rect: ${this._canvasRect.width}x${this._canvasRect.height}, Scale factors: x=${this._scale.x.toFixed(3)}, y=${this._scale.y.toFixed(3)}`);
    };

    Screen.prototype.getMousePosition = function (clientX, clientY) {
        // Canvas'ın güncel konumu
        var rect = this._canvas.getBoundingClientRect();
        
        // Mouse pozisyonunu canvas koordinatlarına çevir
        var canvasX = clientX - rect.left;
        var canvasY = clientY - rect.top;
        
        // VNC koordinatlarına çevirme
        var vncX = Math.floor(canvasX * this._scale.x);
        var vncY = Math.floor(canvasY * this._scale.y);
        
        // Sınırları kontrol etme
        vncX = Math.max(0, Math.min(vncX, this._actualWidth - 1));
        vncY = Math.max(0, Math.min(vncY, this._actualHeight - 1));
        
        console.log(`Mouse: client(${clientX}, ${clientY}) -> canvas(${canvasX.toFixed(1)}, ${canvasY.toFixed(1)}) -> vnc(${vncX}, ${vncY})`);
        
        return {
            x: vncX,
            y: vncY
        };
    };

    Screen.prototype.addMouseHandler = function (cb) {
        console.log("addMouseHandler");
        var self = this;
        var isDragging = false;
        
        try {
            // Mouse down event
            this._canvas.addEventListener('mousedown', function (e) {
                isDragging = true;
                var pos = self.getMousePosition(e.clientX, e.clientY);
                cb.call(null, pos.x, pos.y, 1);
                e.preventDefault();
            }, false);
            
            // Mouse up event
            this._canvas.addEventListener('mouseup', function (e) {
                if (isDragging) {
                    isDragging = false;
                    var pos = self.getMousePosition(e.clientX, e.clientY);
                    cb.call(null, pos.x, pos.y, 0);
                }
                e.preventDefault();
            }, false);
            
            // Mouse move event
            this._canvas.addEventListener('mousemove', function (e) {
                if (isDragging) {
                    var pos = self.getMousePosition(e.clientX, e.clientY);
                    cb.call(null, pos.x, pos.y, 1);
                }
                e.preventDefault();
            }, false);
            
            // Mouse leave event
            this._canvas.addEventListener('mouseleave', function (e) {
                if (isDragging) {
                    isDragging = false;
                    var pos = self.getMousePosition(e.clientX, e.clientY);
                    cb.call(null, pos.x, pos.y, 0);
                }
            }, false);
            
            // Context menu'yu engelle
            this._canvas.addEventListener('contextmenu', function (e) {
                e.preventDefault();
            }, false);
            
            // Window resize event
            var resizeTimeout;
            window.addEventListener('resize', function () {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(function() {
                    console.log("Window resized, updating scale");
                    self.fitToScreen();
                }, 100);
            });
            
            // Fullscreen mode değişikliklerini dinleme
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        setTimeout(function() {
                            console.log("Fullscreen mode changed");
                            self.fitToScreen();
                        }, 100);
                    }
                });
            });
            observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
            
        } catch (error) {
            console.error('Mouse handler error:', error);
        }
    };

    Screen.prototype.addKeyboardHandlers = function (cb) {
        console.log("addKeyboardHandlers");
        try {
            document.addEventListener('keydown', function (e) {
                console.log("Keydown event:", e.keyCode);
                cb.call(null, e.keyCode, e.shiftKey, 1);
                e.preventDefault();
            }, false);
            document.addEventListener('keyup', function (e) {
                console.log("Keyup event:", e.keyCode);
                cb.call(null, e.keyCode, e.shiftKey, 0);
                e.preventDefault();
            }, false);
        } catch (error) {
            console.error('Keyboard handler error:', error);
        }
    };

    Screen.prototype.getCanvas = function () {
        console.log("getCanvas");
        return this._canvas;
    };

    function Client(screen) {
        console.log("Client Constructor");
        this._screen = screen;
    }

    Client.prototype._initEventListeners = function () {
        var self = this;
        console.log("_initEventListeners");
        this._screen.addMouseHandler(function (x, y, button) {
            try {
                console.log(`Sending mouse event: x=${x}, y=${y}, button=${button}`);
                self._socket.emit('mouse', { x: x, y: y, button: button });
            } catch (error) {
                console.error('Mouse event error:', error);
            }
        });
        this._screen.addKeyboardHandlers(function (code, shift, isDown) {
            try {
                var rfbKey = self._toRfbKeyCode(code, shift, isDown);
                if (rfbKey) {
                    console.log(`Sending keyboard event: code=${code}, rfbKey=${rfbKey}, isDown=${isDown}`);
                    self._socket.emit('keyboard', { keyCode: rfbKey, isDown: isDown });
                }
            } catch (error) {
                console.error('Keyboard event error:', error);
            }
        });
    };

    Client.prototype.connect = function (config) {
        console.log("connect");
        try {
            this._socket = io();
            this._socket.on('connect', function () {
                console.log("Socket connected");
            });
            this._socket.emit('init', { host: config.host, port: config.port, password: config.password });
            this._addHandlers(config.callback);
            this._initEventListeners();
        } catch (error) {
            console.error('Connection error:', error);
        }
    };

    Client.prototype._addHandlers = function (callback) {
        var self = this;
        console.log("_addHandlers");
        try {
            this._socket.on('init', function (config) {
                console.log("Init received", config);
                var canvas = self._screen.getCanvas();
                
                // Gerçek boyutları sakla
                self._screen._actualWidth = config.width;
                self._screen._actualHeight = config.height;
                
                console.log(`VNC Resolution: ${config.width}x${config.height}`);
                
                // Canvas'ı ekrana sığacak şekilde ölçeklendir
                self._screen.fitToScreen();
                
                if (typeof callback === 'function') callback();
            });

            this._socket.on('frame', function (frame) {
                console.log("Frame received", frame);
                self._screen.drawRect(frame);
                self._socket.emit('frameReceived');
            });
        } catch (error) {
            console.error('Socket handlers error:', error);
        }
    };

    Client.prototype._toRfbKeyCode = function (code, shift) {
        console.log("_toRfbKeyCode");
        try {
            for (var i = 0, m = keyMap.length; i < m; i++) {
                if (code == keyMap[i][0]) return keyMap[i][shift ? 2 : 1];
            }
            return null;
        } catch (error) {
            console.error('Key code conversion error:', error);
            return null;
        }
    };

    document.getElementById('loginBtn').addEventListener('click', function () {
        console.log("loginBtn click");
        try {
            document.getElementById('screen').style.display='inline';
            var canvas = document.getElementById('screen'),
                screen = new Screen(canvas),
                client = new Client(screen);
            client.connect({
                host: document.getElementById('host').value,
                port: parseInt(document.getElementById('port').value, 10),
                password: document.getElementById('password').value,
                callback: function () {
                    console.log("Client connected");
                    var form = document.getElementById('form-wrapper');
                    form.classList.add('form-wrapper-hidden');
                    canvas.style.opacity = 1;
                    form.addEventListener('transitionend', function () {
                        form.style.display = 'none';
                    });
                }
            });
        } catch (error) {
            console.error('Login button click error:', error);
        }
    }, false);
})();