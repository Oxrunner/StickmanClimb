var game;
//Polyfill by Paul Irish
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            game = setTimeout(callback, 16);
          };
})();

var loopMenu;

var gameOver = false, moved = [0,0], elem,Map = [], fireBalls = [], timeDelay = 0, keyboardMove = [0,0], jump = false, stillJump = false, v = document.createElement("video"), buttons = [], result = document.getElementById("result"),
   controllerJump = 0,controllerMove = [0,0], startgame = 0, fireballImage = new Image(), mapPos = 600, lastMapPos = 0, fireBallCreated = 0;

function myDetectCanvas(){
  elem = document.getElementById('myCanvas');
  if (elem && elem.getContext) {
    ctx = elem.getContext("2d");
    if (ctx) {
      Menu();
    }
  }
}

function Menu(){
  loopMenu = setTimeout(Menu, 0);
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  if (gameOver){
    var start = new Rectangle(240, 418);
    start.width = 115;
    start.height = 42;
    start.colour = '#ffffff';
    buttons.push(start);
    buttons[0].draw();
    menuText('Game Over', "80px Arial", 90, 250);
    menuText('Retry', "40px Arial", 250, 450);
    menuText('Score: '+ timeDelay, "50px Arial", 180, 350);
  } else {
    var start = new Rectangle(210, 245);
    start.width = 175;
    start.height = 38;
    start.colour = '#ffffff';
    buttons.push(start);
    buttons[0].draw();
    menuText('Welcome to Stickman Climb', "45px Arial",18, 200);
    menuText('Start Game', "35px Arial", 210, 275);
    menuText('Allow the webcam to see yourself on the head of the stickman', "20px Arial", 30, 300);
    menuText('(Make sure your webcam is facing you)', "20px Arial", 130, 325);
  }

  var backgroundToggle = new Rectangle(380, 565);
  backgroundToggle.width = 185;
  backgroundToggle.height = 38;
  backgroundToggle.colour = '#ffffff';
  buttons.push(backgroundToggle);
  buttons[1].draw();

  menuText('Remove Background', "20px Arial", 380, 590);
  menuText('(Refresh the page if you want the background back)', "12px Arial", 320, 605);







  myCanvas.addEventListener("mousedown", canvasMouseDown, false);
  if (startgame == 1){
    window.clearInterval(loopMenu);
    startgame = 0;
    resetGame()
  }
}

function buttonHitTest(obj, x, y){
  if(x >= obj.x && x <= obj.x+obj.width &&
    y >= obj.y && y <= obj.y+obj.height){
    return true;
  }else{
    return false;
  }
}

function canvasMouseDown(e){
  movingElement = false;
  for(var i = 0; i < buttons.length; i++){
    var obj = buttons[i];
    if(buttonHitTest(obj, e.offsetX, e.offsetY)){
      if (i == 0){
        myCanvas.removeEventListener("mousedown", canvasMouseDown);
        window.clearInterval(loopMenu);
        resetGame();
      } else if(i == 1){
        document.getElementById("myCanvas").style.background = "url('') no-repeat center";
      }

    }
  }
}

function menuText(text, font, x, y){
  var c = document.getElementById("myCanvas");
  var ctx= c.getContext("2d");
  ctx.font = font;
  ctx.fillStyle = 'red';
  ctx.fillText(text, x, y);
}

function resetGame(){
  buttons.length = 0;
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  gameOver = false;
  Map.length = 0;
  fireBalls.length = 0;
  controllerJump = 0;
  controllerMove = [0,0];
  keyboardMove = [0,0];
  jump = false;
  stillJump = false;
  timeDelay = 0;
  mapPos = 600;
  lastMapPos = 0;
  fireBallCreated = 0;
  setUpGame();
}

function setUpGame(){
	ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
	var squareMan = new Player(270,540);
	Map.push(squareMan);
	buildMap(14);
  drawAllItems();
  loop();
}

function drawAllItems(){
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  for(var i = 0; i < Map.length; i++){
    Map[i].draw();
  }
  for(var i = 0; i < fireBalls.length; i++){
    fireBalls[i].draw();
  }
  menuText(timeDelay, "50px Arial", 450, 50);
}

function buildMap(run){
  if (mapPos != 600){
    spliceArray();
  } else {
    var platform = new Rectangle(0, mapPos);
    platform.width = 600;
    Map.push(platform);
  }
  for (var i = 0; i < run; i++){
    mapPos -= 100;
    var ran = Math.floor(Math.random()*6);
    while (ran == lastMapPos){
      ran = Math.floor(Math.random()*6);
    }
    var leftPlat = ran * 100;
    var rightPlat = (5-ran)*100;
    if (leftPlat != 0){
      var platform = new Rectangle(0, mapPos);
      platform.width = leftPlat;
      Map.push(platform);
    }
    if (rightPlat != 0){
      var x = 600 - rightPlat;
      var platform = new Rectangle(x, mapPos);
      platform.width = rightPlat;
      Map.push(platform);
    }
    lastMapPos = ran;
    createFireBalls();
  }
}

function createFireBalls(){
  if (fireBallCreated == 0){
    if (mapPos != 500){
      ran = Math.floor(Math.random()*2);
      if (ran == 0){
        ran = Math.floor(Math.random()*2);
        if (ran == 0){
          ran = Math.floor(Math.random()*1000);
          var FireX = -56-ran;
          fireBallCreated = 1;
          buildFireBalls(FireX,mapPos+48, "R");
        }
      } else {
        ran = Math.floor(Math.random()*2);
        if (ran == 0){
          ran = Math.floor(Math.random()*1000);
          var FireX = 616+ran;
          fireBallCreated = 1;
          buildFireBalls(FireX,mapPos+48, "L");
        }
      }
    }
  } else {
    fireBallCreated = 0;
  }
}


function buildFireBalls(x,y,w){
  var fireballBuild = new fireball(x, y);
  fireballBuild.way = w;
  fireBalls.push(fireballBuild);
}

function spliceArray(){
  var spliceBy = 0;
  for (var i = 1; i < Map.length; i++){
    if (Map[i].y > 680){
      spliceBy++;
    }
  }
  Map.splice(1,spliceBy);
  spliceBy = 0;
  for (var i = 0; i < fireBalls.length; i++){
    if (fireBalls[i].y > 680){
      spliceBy++;
    }
  }
  fireBalls.splice(0,spliceBy);
}

function Drawable(initialX, initialY){
  this.x = initialX || 0;
  this.y = initialY || 0;
  this.colour = 'black';
  this.draw = function(){

  };
}
var deg = 180;
function fireball(){
  Drawable.apply(this, arguments);
  this.r = 15;
  this.colour = 'red';
  this.way = "R";
  this.width = 50;
  this.height = 30;
  var cache = this;

  this.draw = function(){

    if (this.way == "L"){
      ctx.save();
      ctx.translate(this.x+40, this.y+30);
      ctx.rotate(deg * 0.0174532925199432957);
      ctx.drawImage(fireballImage, 0, 0, this.width,this.height);
      ctx.rotate(Math.PI / 180);
      ctx.restore();
    } else {
      ctx.drawImage(fireballImage, this.x, this.y, this.width,this.height);
    }
  };


    this.move = function(dX, dY){
    this.x += dX;
    this.y += dY;
  };
}

function Player(){
  Drawable.apply(this, arguments);
  this.r = 12;
  this.jumpy = this.y;
  this.colour = 'black';
  this.height = 50;
  this.width = 12;
  this.legstart = this.y+35;

  this.draw = function(){
    ctx.beginPath();
    if(!v.paused){
      ctx.drawImage(v, this.x-this.r, this.y-this.r, 24, 24);
    } else {
      ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
      ctx.fillStyle = this.colour;
      ctx.fill();
    }
    ctx.moveTo(this.x,this.y+this.r);
    ctx.lineTo(this.x,this.y+35);

    ctx.moveTo(this.x,this.y+this.r+10.5);
    ctx.lineTo(this.x+this.r,this.y+this.r+8);

    ctx.moveTo(this.x,this.y+this.r+10.5);
    ctx.lineTo(this.x-this.r,this.y+this.r+8);

    ctx.moveTo(this.x,this.y+35);
    ctx.lineTo(this.x+this.r,this.y+50);

    ctx.moveTo(this.x,this.y+35);
    ctx.lineTo(this.x-this.r,this.y+50);
    ctx.stroke();
  };

  this.move = function(dX, dY){
    this.x += dX;
    this.y += dY;
    moved[0] = dX;
    moved[1] = dY;
    if(!v.paused){
      ctx.drawImage(v, this.x, this.y, 24, 24);
    }

    if (this.y <= 12){
  		this.y = 12;
  	}
  	if (this.x <= 12){
  		this.x = 12;
  	}
    if (this.x >= myCanvas.width-12){
  		this.x = myCanvas.width-12;
  	}
  	if (this.y >= myCanvas.height-50){
  		gameOver = true;
  	}
    if (jump == false){
      this.jumpy = this.y;
    }
  };

}

function Rectangle(){
	Drawable.apply(this, arguments);
	this.width = 100;
	this.height = 30;
this.draw = function(){
	ctx.fillStyle = this.colour;
    ctx.fillRect(this.x,this.y, this.width, this.height);
  };

  this.move = function(dX, dY){
    this.x += dX;
    this.y += dY;
  };
}

function collisionTest(a, b) {
	return !(
		((a.y + a.height) <= (b.y)) ||
		(a.y >= (b.y + b.height)) ||
		((a.x + a.width) < b.x) ||
		(a.x > (b.x + b.width))
	);
}

function checkCollision(balls){
  var obj = Map[0];
  for (var l = 0; l < balls.length; l++){
    var testObj = balls[l];
    if(collisionTest(testObj, obj)){
      gameOver = true;
    }
  }
}

function moveCanvas(){
  var moveBy = 1.25;
  for (var i = 0; i < Map.length; i++){
    Map[i].move(0, moveBy);
  }
  for (var i = 0; i < fireBalls.length; i++){
    fireBalls[i].move(0, moveBy);
  }

  mapPos += moveBy;
}

window.addEventListener('keydown',function(event){
  switch(event.keyCode){
    case 32 : if(jump == false){Map[0].jumpy -= 150;jump = true;stillJump = true;}; break;
    case 37: keyboardMove[0] -= 10; break;
    case 39: keyboardMove[1] += 10; break;
    default: return false;
  }
  event.preventDefault();
  return true;
});

function movePlayer(){
  if (keyboardMove[0] != 0){
    Map[0].move(keyboardMove[0], 0);
    keyboardMove[0] = 0;
  }
  if (keyboardMove[1] != 0){
    Map[0].move(keyboardMove[1], 0);
    keyboardMove[1] = 0;
  }
  var obj = Map[0];
  for (var i = 1; i < Map.length; i++){
  var testObj = Map[i];
    if(collisionTest(testObj, obj)){
      obj.x -= moved[0];
      moved[0] = 0;
    }
  }
}

function jumpPlayer(){
  if (stillJump == true){
    Map[0].move(0, -5);
    if(Map[0].jumpy >= Map[0].y){
      stillJump = false;
      Map[0].jumpy = Map[0].y;
    } else {
      var obj = Map[0];
      for (var i = 1; i < Map.length; i++){
        var testObj = Map[i];
        if(collisionTest(testObj, obj)){
          obj.y -= moved[1];
          moved[1] = 0;
          obj.jumpy = obj.y;
          stillJump = false;
        }
      }
    }
  }
}

function gravity(){
  if (stillJump == false){
    Map[0].move(0, 5);
    var obj = Map[0];
    for (var i = 1; i < Map.length; i++){
    var testObj = Map[i];
      if(collisionTest(testObj, obj)){
        obj.x -= moved[0];
        obj.y -= moved[1];
        moved[0] = 0;
        moved[1] = 0;
        jump = false;
      }
    }
  }
}

function checkForController(){
  if (jump == false){
    if (controllerJump == 1){
      Map[0].jumpy -= 120;
      jump = true;
      stillJump = true;
      controllerJump = 0;
    }
  } else {
    controllerJump = 0;
  }
  if (controllerMove[1] == 1){
    keyboardMove[1] +=3;
  }
  if (controllerMove[0] == 1){
    keyboardMove[0] -=3;
  }
}

function moveFireBalls(){
  for (var i = 0; i < fireBalls.length; i++){
    if (fireBalls[i].way == "R"){
      fireBalls[i].move(4,0);
      if (fireBalls[i].x > myCanvas.width + 20){
        fireBalls[i].x = -16;
        fireBalls[i].x = -28;
      }
    } else {
      fireBalls[i].move(-4,0);
      if (fireBalls[i].x < -20){
        fireBalls[i].x = 616;
        fireBalls[i].x = 604;
      }
    }
  }
}

function loop(){
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  timeDelay = timeDelay + 16;
  moveFireBalls();
  checkForController();
  jumpPlayer();
  movePlayer();
  checkCollision(fireBalls);
  if (mapPos > -100){
    buildMap(7);
  }
  if (timeDelay > 3500){
    moveCanvas();
  }
  if (gameOver){
    window.clearInterval(game);
    Menu();
  } else {
    gravity();
    drawAllItems();
    requestAnimFrame(loop);
  }
}

function controller(){
  if('webkitGetGamepads' in navigator && navigator.webkitGetGamepads()[0]){
    var gamePad = navigator.webkitGetGamepads()[0];

    controllerMove[1] = gamePad.buttons[15];
    controllerMove[0] = gamePad.buttons[14];
    controllerJump = gamePad.buttons[0];
    startgame = gamePad.buttons[9];
  }
  setTimeout(controller, 0);
}

navigator.getUserMedia =
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia ||
          navigator.msGetUserMedia;

function gUMError(e){
  console.log("Error with gUM", e);
}

function gUMSuccess(stream){
  v.src = window.URL.createObjectURL(stream);
  v.play();
}

if(navigator.getUserMedia !== false){
  navigator.getUserMedia({video:true}, gUMSuccess, gUMError);
}
fireballImage.onload = myDetectCanvas;
fireballImage.src = "images/Fireball.jpg"; // Sourced from: http://www.clker.com/clipart-2578.html
controller();
