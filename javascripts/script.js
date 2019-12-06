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
    drawTexture(){
        context.fillStyle = context.createPattern(texture, "repeat");
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

class ExitBox extends Box {
    constructor (width, height, x, y, color){
        super (width, height, x, y, color)
    }

    collisionDetection(obj){
        if (this.top > obj.bottom || this.right < obj.left || this.bottom < obj.top || this.left > obj.right) {
            return false;
        }
        return true;
    }

    endGame() {
        if (vadid.carrying === true)
       {
            window.open("../gameover.html", "_self");
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
            this.color = "#920b99";
            this.jump = 15;
        }else {
            this.color = "#910d0d";
            this.jump = 20;
        }
    }   
}

var worldFunctions = {
    moveBlimsy(obj, player){

        var target = player.x + (player.width / 4);
    
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
    },
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
            obj.y_velocity = 0;
            obj.x = 80;
            obj.y = 720 - 24 - 48;
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

var vadid = new Character (24, 36, 80, 720 - 24 - 48, "#910d0d", true, 0, 0, 0.5, 0.8, 20, false);
var blimsy = new Character (16, 20, vadid.x, vadid.y, "#201296", true, 0, 0, 0.2, 0.5, 20, false);

var long0 = new ColBox(480, 48, 0, 720 - 24,"#306b35");
var long1 = new ColBox(480, 24, 660, 600,"#306b35");
var long2 = new ColBox(480, 24, 80, 540,"#306b35");

var thin0 = new ColBox(100, 24, 550, 208, "#306b35");
var thin1 = new ColBox(100, 24, 626, 256, "#306b35");
var thin2 = new ColBox(100, 24, 726, 256, "#306b35");

var medium0 = new ColBox(320, 24, 140, 540 - 24 - 20,"#306b35");
var medium1 = new ColBox(320, 24, 140, 160,"#306b35");
var medium2 = new ColBox(240, 24, 610, 160,"#306b35");
var medium3 = new ColBox(240, 24, 570, 304,"#306b35");
var medium4 = new ColBox(240, 24, 720, 354,"#306b35");

var block0 = new ColBox(36, 48, 180, 720 - 24 - 48, "#306b35");
var block1 = new ColBox(36, 48, 320, 720 - 48 - 24 - 20, "#306b35");
var block2 = new ColBox(36, 36, 560, 650, "#306b35");
var block3 = new ColBox(36, 48, 720, 600 - 48 - 20, "#306b35");
var block4 = new ColBox(36, 36, 840, 600 -36, "#306b35");
var block5 = new ColBox(36, 36, 650, 480, "#306b35");
var block6 = new ColBox(36, 48, 460, 540 - 48 - 20, "#306b35");
var blockLong0 = new ColBox(36, 144, 160 - 36, 540 - 144 - 20, "#306b35");
var block7 = new ColBox(36, 36, 300, 420, "#306b35");
var block8 = new ColBox(36, 36, 380, 360, "#306b35");
var block9 = new ColBox(36, 36, 300, 280, "#306b35");
var block10 = new ColBox(36, 36, 0, 486, "#306b35");
var block11 = new ColBox(36, 36, 124 -36, 430, "#306b35");
var block12 = new ColBox(36, 36, 0, 380, "#306b35");
var block13 = new ColBox(36, 36, 124 -36, 330, "#306b35");
var block14 = new ColBox(36, 36, 0, 280, "#306b35");
var block15 = new ColBox(36, 36, 124 -36, 230, "#306b35");
var block16 = new ColBox(36, 48, 550, 160, "#306b35");
var block17 = new ColBox(36, 48, 670, 160 + 24, "#306b35");
var block18 = new ColBox(36, 48, 570, 256, "#306b35");
var block19 = new ColBox(36, 48, 826 - 36, 256 - 48, "#306b35");
var block20 = new ColBox(36, 68, 850 - 36, 160 - 68, "#306b35");
var block21 = new ColBox(36, 68, 960 - 36, 354 - 68, "#306b35");
var block22 = new ColBox(36, 48, 70, 720 - 24 - 48, "#fef5e6");
var block23 = new ExitBox(36, 48, 924 - 36, 354 - 48, "##fef5e6");
var block24 = new ColBox(36, 720, -36, 0, "#fef5e6");
var block25 = new ColBox(36, 720, 960, 0, "#fef5e6");

var collisionArray = [long0, long1, long2, thin0, thin1, thin2, medium0, medium1, medium2, medium3, medium4, 
    block0, block1, block2, block3, block4, block5, block6, blockLong0, block7, block8, block9, block10, block11,
    block12, block13, block14, block15, block16, block17, block18, block19, block20, block21, block24, block25];
    
var texture = new Image();
texture.src = "../assets/texture2.PNG";

var img = new Image();
img.src = "../assets/bg.jpg";


function loop(){
// Movement controls for Vadid and Blimsy
    controller.controls(vadid);
    worldFunctions.moveBlimsy(blimsy, vadid);
//Rendering Background
    context.drawImage(img, -750, -100);

    for(let i = 0; i < collisionArray.length; i++){
        collisionArray[i].drawTexture();
    }

    block22.draw();
    block23.draw();

    vadid.draw();
    vadid.carry();
    blimsy.draw();
    

// Blimsy detecion 
    if (vadid.collisionTest(blimsy)){
        blimsy.color= "#d6c01a";
    } else {
        blimsy.color= "#201296";
    }
    
// world collision detection    
    if (block0.collisionDetection(vadid)){
        block0.collisionRessolve(vadid);
    }
    if (block0.collisionDetection(blimsy)){
        block0.collisionRessolve(blimsy);
    }
    if (block1.collisionDetection(vadid)){
        block1.collisionRessolve(vadid);
    }
    if (block1.collisionDetection(blimsy)){
        block1.collisionRessolve(blimsy);
    }
    if (block2.collisionDetection(vadid)){
        block2.collisionRessolve(vadid);
    }
    if (block2.collisionDetection(vadid)){
        block2.collisionRessolve(vadid);
    }
    if (block3.collisionDetection(vadid)){
        block3.collisionRessolve(vadid);
    }
    if (block3.collisionDetection(blimsy)){
        block3.collisionRessolve(blimsy);
    }
    if (block4.collisionDetection(vadid)){
        block4.collisionRessolve(vadid);
    }
    if (block4.collisionDetection(blimsy)){
        block4.collisionRessolve(blimsy);
    }
    if (block5.collisionDetection(vadid)){
        block5.collisionRessolve(vadid);
    }
    if (block5.collisionDetection(blimsy)){
        block5.collisionRessolve(blimsy);
    }
    if (block6.collisionDetection(vadid)){
        block6.collisionRessolve(vadid);
    }
    if (block6.collisionDetection(blimsy)){
        block6.collisionRessolve(blimsy);
    }
    if (blockLong0.collisionDetection(vadid)){
        blockLong0.collisionRessolve(vadid);
    }
    if (blockLong0.collisionDetection(blimsy)){
        blockLong0.collisionRessolve(blimsy);
    }
    if (block7.collisionDetection(vadid)){
        block7.collisionRessolve(vadid);
    }
    if (block8.collisionDetection(vadid)){
        block8.collisionRessolve(vadid);
    }
    if (block9.collisionDetection(vadid)){
        block9.collisionRessolve(vadid);
    }
    if (block10.collisionDetection(vadid)){
        block10.collisionRessolve(vadid);
    }
    if (block10.collisionDetection(blimsy)){
        block10.collisionRessolve(blimsy);
    }
    if (block11.collisionDetection(vadid)){
        block11.collisionRessolve(vadid);
    }
    if (block11.collisionDetection(blimsy)){
        block11.collisionRessolve(blimsy);
    }
    if (block12.collisionDetection(vadid)){
        block12.collisionRessolve(vadid);
    }
    if (block12.collisionDetection(blimsy)){
        block12.collisionRessolve(blimsy);
    }
    if (block13.collisionDetection(vadid)){
        block13.collisionRessolve(vadid);
    }
    if (block13.collisionDetection(blimsy)){
        block13.collisionRessolve(blimsy);
    }
    if (block14.collisionDetection(vadid)){
        block14.collisionRessolve(vadid);
    }
    if (block14.collisionDetection(blimsy)){
        block14.collisionRessolve(blimsy);
    }
    if (block15.collisionDetection(vadid)){
        block15.collisionRessolve(vadid);
    }
    if (block15.collisionDetection(blimsy)){
        block15.collisionRessolve(blimsy);
    }
    if (block16.collisionDetection(vadid)){
        block16.collisionRessolve(vadid);
    }
    if (block16.collisionDetection(blimsy)){
        block16.collisionRessolve(blimsy);
    }
    if (block17.collisionDetection(vadid)){
        block17.collisionRessolve(vadid);
    }
    if (block17.collisionDetection(blimsy)){
        block17.collisionRessolve(blimsy);
    }
    if (block18.collisionDetection(vadid)){
        block18.collisionRessolve(vadid);
    }
    if (block18.collisionDetection(blimsy)){
        block18.collisionRessolve(blimsy);
    }
    if (block19.collisionDetection(vadid)){
        block19.collisionRessolve(vadid);
    }
    if (block19.collisionDetection(blimsy)){
        block19.collisionRessolve(blimsy);
    }
    if (block20.collisionDetection(vadid)){
        block20.collisionRessolve(vadid);
    }
    if (block20.collisionDetection(blimsy)){
        block20.collisionRessolve(blimsy);
    }
    if (block21.collisionDetection(vadid)){
        block21.collisionRessolve(vadid);
    }
    if (block21.collisionDetection(blimsy)){
        block21.collisionRessolve(blimsy);
    }
    if (block24.collisionDetection(vadid)){
        block24.collisionRessolve(vadid);
    }
    if (block24.collisionDetection(blimsy)){
        block24.collisionRessolve(blimsy);
    }
    if (block25.collisionDetection(vadid)){
        block25.collisionRessolve(vadid);
    }
    if (block25.collisionDetection(blimsy)){
        block25.collisionRessolve(blimsy);
    }
    if (block23.collisionDetection(vadid)){
        block23.endGame(vadid);
    }
    if (long0.collisionDetection(vadid)){
        long0.collisionRessolve(vadid);
    }
    if (long0.collisionDetection(blimsy)){
        long0.collisionRessolve(blimsy);
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
    if (medium0.collisionDetection(vadid)){
        medium0.collisionRessolve(vadid);
    }
    if (medium0.collisionDetection(blimsy)){
        medium0.collisionRessolve(blimsy);
    }
    if (medium1.collisionDetection(vadid)){
        medium1.collisionRessolve(vadid);
    }
    if (medium1.collisionDetection(blimsy)){
        medium1.collisionRessolve(blimsy);
    }
    if (medium2.collisionDetection(vadid)){
        medium2.collisionRessolve(vadid);
    }
    if (medium2.collisionDetection(blimsy)){
        medium2.collisionRessolve(blimsy);
    }
    if (medium3.collisionDetection(vadid)){
        medium3.collisionRessolve(vadid);
    }
    if (medium3.collisionDetection(blimsy)){
        medium3.collisionRessolve(blimsy);
    }
    if (medium4.collisionDetection(vadid)){
        medium4.collisionRessolve(vadid);
    }
    if (medium4.collisionDetection(blimsy)){
        medium4.collisionRessolve(blimsy);
    }
    if (thin0.collisionDetection(vadid)){
        thin0.collisionRessolve(vadid);
    }
    if (thin0.collisionDetection(blimsy)){
        thin0.collisionRessolve(blimsy);
    }
    if (thin1.collisionDetection(vadid)){
        thin1.collisionRessolve(vadid);
    }
    if (thin1.collisionDetection(blimsy)){
        thin1.collisionRessolve(blimsy);
    }
    if (thin2.collisionDetection(vadid)){
        thin2.collisionRessolve(vadid);
    }
    if (thin2.collisionDetection(blimsy)){
        thin2.collisionRessolve(blimsy);
    }
    worldFunctions.checkBounds(vadid);
    worldFunctions.checkBounds(blimsy);
    window.requestAnimationFrame(loop);
}

window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);