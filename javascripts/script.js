var context = document.getElementById("display").getContext("2d");

context.canvas.width = 960;
context.canvas.height = 720;

class Box {
    constructor (width, height, x, y, color){
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = color;
        this.exists = true;
    }
    draw() {
        if (this.exists === true){
        context.fillStyle = this.color;
        context.beginPath();
        context.fillRect(this.x, this.y, this.width, this.height);
    } else {
        return;
    }       
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
    get x_center(){
         return this.x + this.width * 0.5; 
    }
    get y_center(){
         return this.y + this.height * 0.5; 
    }
    
}

class ColBox extends Box {
    constructor (width, height, x, y, color){
        super (width, height, x, y, color)
    }

    collisionDetection(obj){
        if (this.top > obj.bottom || this.right < obj.left || this.bottom < obj.top || this.left > obj.right) {
            return false;
        }
        return true;
    }

    collisionRessolve(obj) {
        var difference_x, difference_y;
        // get the distance between center points
        difference_x = this.x_center - obj.x_center;
        difference_y = this.y_center - obj.y_center;
        console.log(difference_x, difference_y);
        // is the y vector longer than the x vector?
        if (Math.abs(difference_y / this.height) > Math.abs(difference_x / this.width)) {// square to remove negatives
    
          // is the y vector pointing down?
          if (difference_y > 0) {
    
            obj.y = this.y - obj.height;
            obj.y_velocity = 0;
            obj.jumping = false;
          } else { // the y vector is pointing up
    
            obj.y = this.y + this.height;
            obj.y_velocity = 0;
          }
    
        } else { // the x vector is longer than the y vector
          // is the x vector pointing right?
          if (difference_x > 0) {
            obj.x = this.x - obj.width;
            obj.x_velocity = 0;
          } else { // the x vector is pointing left
            obj.x = this.x + this.width;    
            obj.x_velocity = 0;
          }
    
        }
    }
}

class Character extends Box {
    constructor(width, height, x, y, color, jumping, x_velocity, y_velocity, speed, run, jump, carrying ){
        super (width, height, x, y, color);
        this.jumping = jumping;
        this.x_velocity = x_velocity;
        this.y_velocity = y_velocity;
        this.speed = speed;
        this.run = run;
        this.jump = jump;
        this.carrying = carrying;
     }
     collisionTest(colBox) {
        if (this.top > colBox.bottom || this.right < colBox.left || this.bottom < colBox.top || this.left > colBox.right) {
            return false;
        } else {
            return true;
        }
    }
    carry(){
        if (this.carrying){
            this.color = "#ff00ff";
            this.jump = 15;
        }else {
            this.color = "#ff0000";
            this.jump = 20;
        }
    }   
}

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
    
    },
    checkBounds(obj) {
        if (obj.x_velocity > -0.05 && obj.x_velocity < 0.05){
            obj.x_velocity = 0;
        }
    }
};

var controller = {
    left: false,
    right: false,
    jump: false,
    shift: false,
    up: false,
    down: false,
    reset: false,
    enabled: true,
    counter: 0,
    keyListener:function(event) {
        
        var keyState = (event.type == "keydown")? true:false;
    
        switch(event.code) {
            case "KeyW":
                controller.up = keyState;
            break;
            case "KeyA":
                controller.left = keyState;
            break;
            case "KeyS":
                controller.down = keyState;
            break;
            case "KeyD":
                controller.right = keyState;
            break;
            case "Space":
                controller.jump = keyState;
            break;
            case "ShiftLeft":
                controller.shift = keyState;
            break;
            case "KeyP":
                controller.reset = keyState;
            break;
        }
    },
    jumpDelay(){

        
    },
    controls(obj){
        if (controller.jump && obj.jumping == false) {
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
        if (vadid.collisionTest(blimsy) && controller.up){
            obj.carrying = true;
            blimsy.exists = false;      
        } 
        if (blimsy.exists === false && controller.down){
            obj.carrying = false;
            blimsy.x = obj.x;
            blimsy.y = obj.y;
            blimsy.y_velocity = 0;
            blimsy.exists = true;   
        }
        if (controller.reset){
            obj.x = 80;
            obj.y = 600;
            blimsy.x = obj.x;
            blimsy.y = obj.y;
        }
        obj.y_velocity += 1.0;
        obj.x += obj.x_velocity;
        obj.y += obj.y_velocity;
        obj.x_velocity *= 0.9;
        obj.y_velocity *= 0.9;
    
        if (obj.x_velocity > -0.05 && obj.x_velocity < 0.05){
            obj.x_velocity = 0;
        }
    }
};

var vadid = new Character (24, 36, 80, 600, "#ff0000", true, 0, 0, 0.5, 0.8, 20, false);
var blimsy = new Character (16, 20, vadid.x, vadid.y, "#00ff00", true, 0, 0, 0.3, 0.5, 20, false);
var long1 = new ColBox(480, 20, 0, 700,"#606060");
var block1 = new ColBox(36, 52, 320, 700 - 52 - 20, "#606060");
var rectangle1 = new ColBox(36, 70, 180, 650, "#606060");
var block2 = new ColBox(36, 36, 560, 650, "#606060");
var long2 = new ColBox(360, 20, 660, 600,"#606060");


function loop(){
// Movement controls for Vadid and Blimsy
    controller.controls(vadid);
    worldFunctions.moveBlimsy(blimsy, vadid);
//Rendering Background
    context.fillStyle = "#202020";
    context.fillRect(0,0,960,720);

    long1.draw();
    block1.draw();
    block2.draw();
    rectangle1.draw();
    long2.draw();


    vadid.draw();
    vadid.carry();
    blimsy.draw();
    

// Blimsy detecion 
    if (vadid.collisionTest(blimsy)){
        blimsy.color= "#ffff00aa";
    } else {
        blimsy.color= "#00ff00";
    }

// world collision detection    
    if (block1.collisionDetection(vadid)){
        block1.collisionRessolve(vadid);
    }
    if (block1.collisionDetection(blimsy)){
        block1.collisionRessolve(blimsy);
    }
    if (rectangle1.collisionDetection(vadid)){
        rectangle1.collisionRessolve(vadid);
    }
    if (block2.collisionDetection(vadid)){
        block2.collisionRessolve(vadid);
    }
    if (block2.collisionDetection(blimsy)){
        block2.collisionRessolve(blimsy);
    }
    if (rectangle1.collisionDetection(blimsy)){
        rectangle1.collisionRessolve(blimsy);
    }
    if (long1.collisionDetection(vadid)){
        long1.collisionRessolve(vadid);
    }
    if (long1.collisionDetection(blimsy)){
        long1.collisionRessolve(blimsy);
    }
    if (long2.collisionDetection(vadid)){
        long2.collisionRessolve(vadid);
    }
    if (long2.collisionDetection(blimsy)){
        long2.collisionRessolve(blimsy);
    }
    worldFunctions.checkBounds(vadid);
    worldFunctions.checkBounds(blimsy);
    window.requestAnimationFrame(loop);
}

window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);