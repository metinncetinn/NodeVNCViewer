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
        this._displayScale = 1; // Ekran ölçekleme faktörü
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

    // Yeni fonksiyon: Canvas'ı ekrana sığacak şekilde ölçeklendir
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
            
            // Tam ekranda ortalama
            canvas.style.position = 'fixed';
            canvas.style.top = '50%';
            canvas.style.left = '50%';
            canvas.style.transform = 'translate(-50%, -50%)';
            canvas.style.margin = '0';
        } else {
            // Normal modda - CSS'deki değerlerle uyumlu
            var headerHeight = 100; // Header yüksekliği
            var availableHeight = window.innerHeight - headerHeight - 100; // Alt boşluk için 100px
            var availableWidth = window.innerWidth - 80; // Yan boşluklar için 80px
            
            // CSS'de tanımlı maksimum boyutları kontrol et
            var maxCSSWidth = 1280;
            var maxCSSHeight = 720;
            
            // Mevcut CSS limitleriyle çalış
            var targetWidth = Math.min(availableWidth, maxCSSWidth);
            var targetHeight = Math.min(availableHeight, maxCSSHeight);
            
            // Oran hesapla
            var scaleX = targetWidth / this._actualWidth;
            var scaleY = targetHeight / this._actualHeight;
            this._displayScale = Math.min(scaleX, scaleY, 1); // 1'den büyük olmasın
            
            var displayWidth = Math.floor(this._actualWidth * this._displayScale);
            var displayHeight = Math.floor(this._actualHeight * this._displayScale);
            
            canvas.style.width = displayWidth + 'px';
            canvas.style.height = displayHeight + 'px';
            
            // CSS'deki stil ayarlarını koru
            canvas.style.position = 'static';
            canvas.style.transform = 'none';
            canvas.style.margin = '50px auto 0';
            canvas.style.display = 'block';
        }
        
        console.log(`Mode: ${isFullscreen ? 'Fullscreen' : 'Normal'}, Display scale: ${this._displayScale}, Size: ${canvas.style.width} x ${canvas.style.height}`);
        
        this.updateScale();
    };

    Screen.prototype.updateScale = function () {
        var rect = this._canvas.getBoundingClientRect();
        // Hem canvas'ın iç ölçeği hem de display ölçeği hesaplanır
        this._scale.x = this._actualWidth / rect.width;
        this._scale.y = this._actualHeight / rect.height;
        
        console.log(`Scale factors: x=${this._scale.x}, y=${this._scale.y}`);
    };

    Screen.prototype.getMousePosition = function (pageX, pageY) {
        var rect = this._canvas.getBoundingClientRect();
        return {
            x: Math.floor((pageX - rect.left) * this._scale.x),
            y: Math.floor((pageY - rect.top) * this._scale.y)
        };
    };

    Screen.prototype.addMouseHandler = function (cb) {
        console.log("addMouseHandler");
        var self = this;
        try {
            this._canvas.addEventListener('mousedown', function (e) {
                var pos = self.getMousePosition(e.pageX, e.pageY);
                cb.call(null, pos.x, pos.y, 1);
                e.preventDefault();
            }, false);
            this._canvas.addEventListener('mouseup', function (e) {
                var pos = self.getMousePosition(e.pageX, e.pageY);
                cb.call(null, pos.x, pos.y, 0);
                e.preventDefault();
            }, false);
            // Mouse hareketi için event listener
            this._canvas.addEventListener('mousemove', function (e) {
                if (e.buttons === 1) { // Sol mouse tuşu basılı ise
                    var pos = self.getMousePosition(e.pageX, e.pageY);
                    cb.call(null, pos.x, pos.y, 1);
                }
                e.preventDefault();
            }, false);
            // Pencere yeniden boyutlandırıldığında scale'i güncelle
            window.addEventListener('resize', function () {
                // Pencere boyutu değiştiğinde yeniden sığdır
                self.fitToScreen();
            });
            
            // Fullscreen modu değişikliklerini dinle
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        // Body'nin class'ı değiştiğinde (fullscreen toggle) yeniden ölçeklendir
                        setTimeout(function() {
                            self.fitToScreen();
                        }, 50); // CSS transition'ın tamamlanması için kısa bekleme
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
                console.log("Keydown event");
                cb.call(null, e.keyCode, e.shiftKey, 1);
                e.preventDefault();
            }, false);
            document.addEventListener('keyup', function (e) {
                console.log("Keyup event");
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
                self._socket.emit('mouse', { x: x, y: y, button: button });
            } catch (error) {
                console.error('Mouse event error:', error);
            }
        });
        this._screen.addKeyboardHandlers(function (code, shift, isDown) {
            try {
                var rfbKey = self._toRfbKeyCode(code, shift, isDown);
                if (rfbKey) self._socket.emit('keyboard', { keyCode: rfbKey, isDown: isDown });
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
                
                // Canvas'ın gerçek çözünürlüğünü ayarla
                canvas.width = config.width;
                canvas.height = config.height;
                
                // Gerçek boyutları sakla
                self._screen._actualWidth = config.width;
                self._screen._actualHeight = config.height;
                
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
