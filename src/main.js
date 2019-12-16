enchant();

/*---- game用変数 ----*/
var game = null;

var button_width = 100;
var button_height= 100;

var up_button    = null;
var down_button  = null;
var right_button = null;
var left_button  = null;

var up_image    = 'img/up.png';
var down_image  = 'img/down.png';
var right_image = 'img/right.png';
var left_image  = 'img/left.png';

/*---- socket用変数 ----*/
var socket  = null;
var ip_addr = '192.168.2.6';
var port    = '8081';
var curr_data = null; // socket.data保持用

function addSprite(game, img_name, x, y, width, height) {
    var char = new Sprite(width, height);
    char.image = game.assets[img_name];
    char.x = x;
    char.y = y;
    game.rootScene.addChild(char);
    return char;
}

window.onload = function() {

    game = new Game(window.innerWidth, window.innerHeight);

    game.preload(up_image);
    game.preload(down_image);
    game.preload(right_image);
    game.preload(left_image);
    
    game.onload = function() {
     
        // 接続要求
        socket = io.connect("http://" + ip_addr + ":" + port);

        socket.on("entry", function(data) {
            socket.emit("admin");
            console.log('admin done!');
        });

        socket.on("adminto", function(data) {
            console.log("recieve adminto");
        });

        up_button    = addSprite(game, up_image, 200, 100, button_width, button_height);
        down_button  = addSprite(game, down_image, 200, 300, button_width, button_height);
        right_button = addSprite(game, right_image, 300, 200, button_width, button_height);
        left_button  = addSprite(game, left_image, 100, 200, button_width, button_height);

        up_button.addEventListener(enchant.Event.TOUCH_START, function(event) {
            alert('up');
        });

        down_button.addEventListener(enchant.Event.TOUCH_START, function(event) {
            alert('down');
        });

        right_button.addEventListener(enchant.Event.TOUCH_START, function(event) {
            alert('right');
        });

        left_button.addEventListener(enchant.Event.TOUCH_START, function(event) {
            alert('left');
        });
    }

    game.start();
}
