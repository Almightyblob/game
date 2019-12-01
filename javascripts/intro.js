var context = document.getElementById("display").getContext("2d");

context.canvas.width = 320;
context.canvas.height = 180;

class Box {
    constructor (width, height, x, y, color){
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = color;
    }
    draw() {
        context.fillStyle = this.color;
        context.beginPath();
        context.fillRect(this.x, this.y, this.width, this.height);       
    }
    get bottom(){
        return this.y + this.height;
    }
    get top(){
        return this.y;
    }
    get left(){
        return this.x;
    }
    get right(){
        return this.x + this.width;
    }
    
}

class Character extends Box {
    constructor(width, height, x, y, color, jumping, x_velocity, y_velocity, speed, run, jump ){
        super (width, height, x, y, color);
        this.jumping = jumping;
        this.x_velocity = x_velocity;
        this.y_velocity = y_velocity;
        this.speed = speed;
        this.run = run;
        this.jump = jump;
     }
     collisionTest(colBox) {
        if (this.top > colBox.bottom || this.right < colBox.left || this.bottom < colBox.top || this.left > colBox.right) {
            return false;
        } else {
            return true;
        }
    }
}

var vadid = new Character (36, 36, 144, 0, "#ff0000", true, 0, 0, 0.5, 0.8, 20);
var blimsy = new Character (20, 20, 30, 0, "#00ff00", true, 0, 0, 0.3, 0.5, 20);
var block = new Box(36, 36, 280, 180 - 36, "#606060");


var worldFunctions = {
    moveBlimsy(obj, player){

        var target = player.x + (player.width /4);
    
        if (target > obj.x && (target - obj.x) > 3){
            obj.x_velocity += obj.speed;
        }
        if (target < obj.x && (target - obj.x) < 3){
            obj.x_velocity -= obj.speed;
        }
    
        obj.y_velocity += 1.5;
        obj.x += obj.x_velocity;
        obj.y += obj.y_velocity;
        obj.x_velocity *= 0.9;
        obj.y_velocity *= 0.9;
    
        if (obj.y > 180 - obj.height){
            obj.jumping = false;
            obj.y = 180 - obj.height;
            obj.y_velocity = 0;
        }
    },
    checkBounds(obj) {
        if (obj.x > 320){
            obj.x = -obj.width;
        }
        if (obj.x < -obj.width){
            obj.x = 320;
        }
        if (obj.x_velocity > -0.05 && obj.x_velocity < 0.05){
            obj.x_velocity = 0;
        }
    }
};

var controller = {
    left: false,
    right: false,
    up: false,
    shift: false,
    keyListener:function(event) {
        
        var keyState = (event.type == "keydown")? true:false;

        switch(event.code) {
            case "KeyA":
                controller.left = keyState;
            break;
            case "Space":
                controller.up = keyState;
            break;
            case "KeyD":
                controller.right = keyState;
            break;
            case "ShiftLeft":
                controller.shift = keyState;
            break;
        }
    },
    controls(obj){
        if (controller.up && obj.jumping == false) {
            obj.jumping = true;
            obj.y_velocity -= obj.jump;
        }
    
        if (controller.left){
            obj.x_velocity -= obj.speed;
        }
    
        if (controller.right){
            obj.x_velocity += obj.speed;
        }
        if (controller.left && controller.shift){
            obj.x_velocity -= obj.run;
        }
    
        if (controller.right && controller.shift){
            obj.x_velocity += obj.run;
        }
    
        obj.y_velocity += 1.5;
        obj.x += obj.x_velocity;
        obj.y += obj.y_velocity;
        obj.x_velocity *= 0.9;
        obj.y_velocity *= 0.9;
    
        if (obj.y > 180 - obj.height){
            obj.jumping = false;
            obj.y = 180 - obj.height;
            obj.y_velocity = 0;
        }
        if (obj.x_velocity > -0.05 && obj.x_velocity < 0.05){
            obj.x_velocity = 0;
        }
    }
};



function loop(){
    console.log(vadid.collisionTest(blimsy));
    controller.controls(vadid);
    worldFunctions.moveBlimsy(blimsy, vadid);
    //background
    context.fillStyle = "#202020";
    context.fillRect(0,0,320,180);

    if (vadid.collisionTest(blimsy)){
        blimsy.color= "#ffff00aa";
    } else {
        blimsy.color= "#00ff00";
    }

    if (vadid.collisionTest(block)){
        vadid.x_velocity = 0;
    }

    block.draw();
    vadid.draw();
    blimsy.draw();
    worldFunctions.checkBounds(vadid);
    worldFunctions.checkBounds(blimsy);
    window.requestAnimationFrame(loop);
}

window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);