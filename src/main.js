enchant();

/*---- 定数 ----*/
const threshold_x = 200;
const threshold_y = 200;
const none = "none";

/*---- game用変数 ----*/
var game = null;

var button_width  = 100;
var button_height = 100;

var button_scale  = 5;

var up_image    = null;
var down_image  = null;
var right_image = null;
var left_image  = null;

var curr_image  = null;

var up_image    = 'img/up.png';
var down_image  = 'img/down.png';
var right_image = 'img/right.png';
var left_image  = 'img/left.png';

var touch_label = null;

var start_x = 0;
var start_y = 0;
var end_x = 0;
var end_y = 0;

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
    char.scaleX = 4;
    char.scaleY = 4;
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
    if (str != "none")
        label.text = str;
}

function moveImage(direction) {
    if (curr_image != null)
        curr_image.moveTo(-200, -200);
    
    switch(direction) {
        case "up":
            curr_image = up_image;
            break;
        case "down":
            curr_image = down_image;
            break;
        case "right":
            curr_image = right_image;
            break;
        case "left":
            curr_image = left_image;
            break;
    }
    
    curr_image.moveTo((game.width/2)-(button_width/2), 100);
}


function setDirection(x1, y1, x2, y2) {
    var x = x2 - x1;
    var y = y2 - y1;
    var ans = none;

    if (Math.abs(x) > threshold_x) {
        if (x < 0)
            ans = "left";
        else
            ans = "right";
    }
    if (Math.abs(y) > threshold_y) {
        if (y < 0)
            ans = "up";
        else
            ans = "down";
    }

    if (ans != none) {
        moveImage(ans);
    }
    
    return ans;
}

function emitData(direction, index) {
    if (index) {
        socket.emit(direction, index);
        index = null;
        updataLabel(touch_label, "表示端末を選択してください");
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

        // イメージを配置する処理
        up_image    = addSprite(game, up_image, -200, -200, button_width, button_height);
        down_image  = addSprite(game, down_image, -200, -200, button_width, button_height);
        right_image = addSprite(game, right_image, -200, -200, button_width, button_height);
        left_image  = addSprite(game, left_image, -200, -200, button_width, button_height);

        console.log(up_image.width);
        console.log(up_image.height);

        // ラベルを配置する処理
        touch_label = addLabel(game, '表示端末を選択してください', 50, 50, 'black', 'italic 2em Times');

        game.rootScene.addEventListener(enchant.Event.TOUCH_START, function(e) {
            start_x = e.x;
            start_y = e.y;
        });

        game.rootScene.addEventListener(enchant.Event.TOUCH_END, function(e) {
            end_x = e.x;
            end_y = e.y;
            var direction = setDirection(start_x, start_y, end_x, end_y);
            updataLabel(touch_label, direction);
        });

    }

    game.start();
}
