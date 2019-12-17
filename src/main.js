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

var touch_label = null;

/*---- socket用変数 ----*/
var socket  = null;
var ip_addr = '192.168.2.6';
var port    = '8081';
var index = null; // socket.data保持用

// スプライトを追加する関数
function addSprite(game, img_name, x, y, width, height) {
    var char = new Sprite(width, height);
    char.image = game.assets[img_name];
    char.x = x;
    char.y = y;
    game.rootScene.addChild(char);
    return char;
}

// ラベルを追加する関数
function addLabel(game, label_str, x, y, color, font) {
    var label = new Label(label_str);
    label.color = color;
    label.font = font;
    label.x = x;
    label.y = y;
    label.width = 500;
    game.rootScene.addChild(label);
    return label;
}

function updataLabel(label, str) {
    label.text = str;
}

function emitData(direction, index) {
    if (index) {
        socket.emit(direction, index);
        index = null;
    } else {
        alert("表示端末を選択してください");
    }
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

        // 操作端末であることを知らせる
        socket.on("entry", function(data){ socket.emit("admin"); });

        // サーバからのACK
        socket.on("adminto", function(data){ console.log("recieve adminto"); });

        // 表示画面がタッチされたらそのIDを保持
        socket.on("touch", function(data){
            index = data.index;
            updataLabel(touch_label, index+"番が選択されています。");
        });

        // ボタンを配置する処理
        up_button    = addSprite(game, up_image, 200, 100, button_width, button_height);
        down_button  = addSprite(game, down_image, 200, 300, button_width, button_height);
        right_button = addSprite(game, right_image, 300, 200, button_width, button_height);
        left_button  = addSprite(game, left_image, 100, 200, button_width, button_height);

        // ラベルを配置する処理
        touch_label = addLabel(game, '表示端末を選択してください', 50, 50, 'black', 'italic 2em Times');

        // 各ボタンがタッチされた時の処理
        up_button.addEventListener(enchant.Event.TOUCH_START, function(){ emitData("up", index); }); 
        down_button.addEventListener(enchant.Event.TOUCH_START, function(){ emitData("down", index); }); 
        left_button.addEventListener(enchant.Event.TOUCH_START, function(){ emitData("right", index); }); 
        right_button.addEventListener(enchant.Event.TOUCH_START, function(){ emitData("left", index); }); 
    }

    game.start();
}
