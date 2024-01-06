
var world,engine;
var socket;
var blueT,redT,greenT,purpleT;
let bg;
let sh=[];
let thanos;
let cFPS=0;
function preload(){
    //createCanvas(innerWidth,innerHeight);
    thanos=loadImage('assets/thanosball.png');
}

function setup(){
    socket=io();
    socket.emit('message', 'Hi, I am connected.');
    socket.on('messageFromServer',function(data){
        console.log(data);
    })
    //write code
    frameRate(30);
    engine=Matter.Engine.create();
    world=engine.world;
    engine.gravity.y=0;

    createCanvas(windowWidth, windowHeight);
    background("#dedede");
    //bg=loadImage('assets/400x400grid.png');
    box=new Box(windowWidth/2,windowHeight/2+50,60,60);
    player=new Circle(windowWidth/2,windowHeight/2,50,50);
    bos=new Box(0,0,50,50);
    bos.body.isStatic=false;
    box.body.isStatic=false;
    player.body.restitution=1.5;
    player.body.density=400;
    cFPS=0;
    for(let a=0;a<50;a++){
      for(let i=0;i<50;i++){
        sh.push(new Box(i*60,a*60,50,50));
        sh[i].body.restitution=4;
      }
    }
    
    blueT="#00ACDA";
    //box=new Box(windowWidth/2,windowHeight/2,50,75);
}


let LEFT, RIGHT, DOWN, UP;
function keyReleased(){
    if(key==='ArrowDown'||key==='s'){
      DOWN=false;
    }
    if(key==='ArrowUp'||key==='w'){
      UP=false;
    }
    if(key==='ArrowLeft'||key==='a'){
      LEFT=false;
    }
    if(key==='ArrowRight'||key==='d'){
      RIGHT=false;
    }
    //return false;
}

function keyPressed(){
  if(key==='ArrowDown'||key==='s'){
    DOWN=true;
  }
  if(key==='ArrowUp'||key==='w'){
    UP=true;
  }
  if(key==='ArrowLeft'||key==='a'){
    LEFT=true;
  }
  if(key==='ArrowRight'||key==='d'){
    RIGHT=true;
  }
  //return false;
}//*/

var x=0;
var y=0;
//called every frame
var box;
function move(b){
    if(LEFT){
      b.acc.x=-b.acceleration;
    }
    if(RIGHT){
      b.acc.x=b.acceleration;
    }
    if(UP){
      b.acc.y=-b.acceleration;
  }
  if(DOWN){
    b.acc.y=b.acceleration;
  }
  if(!UP && !DOWN){
    b.acc.y = 0;
  }
  if(!RIGHT && !LEFT){
    b.acc.x = 0;
  }
  if(Matter.Vector.magnitude(b.acc)!==0){
    Matter.Body.setVelocity(b.body,Matter.Vector.add(b.body.velocity, Matter.Vector.mult(Matter.Vector.create(b.acc.x/Matter.Vector.magnitude(b.acc),b.acc.y/Matter.Vector.magnitude(b.acc)),b.acceleration)));//+=b.acc_x;
  }//*/
  else{
    //Matter.Body.setVelocity(b.body,Matter.Vector.create(0,0));
  }
}
let player,bos;
let isClicked=false;
let currentFrameMod=0;
let bullet;
let bullets=[];
function draw(){
    clear();
    Matter.Engine.update(engine);
    //background(bg);
    background("dedede");
    cFPS=getTargetFrameRate();
    translate(width/2-player.body.position.x-player.body.velocity.x,height/2-player.body.position.y-player.body.velocity.y);
    rect(x,y,55,55);
    sh.forEach(element=>{
      element.show();
    });

    player.show();
    if(mouseIsPressed){
      if(!isClicked){
        currentFrameMod=frameCount%cFPS;
        isClicked=true;
      }
      if(frameCount%cFPS===currentFrameMod){
        socket.emit('message','one second has passed');
        let angle=player.body.angle;
        let pPos=Matter.Vector.create(windowWidth/2,windowHeight/2);
        let mPos=Matter.Vector.create(mouseX,mouseY);
        let v=Matter.Vector.sub(mPos,pPos);
        if(Matter.Vector.magnitude(v)===0){
          v.x+=1;
        }
        let ve=Matter.Vector.mult(Matter.Vector.div(v ,Matter.Vector.magnitude(v)),100);
        //v=Matter.Vector.add(v,player.body.position);
        bullet=new Circle(player.body.position.x+ve.x,player.body.position.y+ve.y,20);
        bullet.body.frictionAir=0.01;
        Matter.Body.setVelocity(bullet.body,Matter.Vector.mult(Matter.Vector.div(v ,Matter.Vector.magnitude(v)),50));
        bullets.push(bullet);
      }
    }else{
      if(frameCount%cFPS===currentFrameMod){
        isClicked=false;
      }
    }
    if(bullet!=null){
      //bullet.show();
    }
    bullets.forEach(element=>{
      element.show();
    });
    push();
    rectMode(CENTER);
    translate(player.body.position.x,player.body.position.y);
    rotate(player.body.angle);
    rect(0,-75,35,75);
    pop();
    player.show();
    box.show();
    bos.show();
    move(player);
    //socket.emit('message',box.body.velocity.x);
}//*/

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Box{
  constructor(x,y,w,h){
      this.body=Matter.Bodies.rectangle(x,y,w,h,{
        frictionAir:0.05,
      });
      Matter.World.add(world,this.body);
      this.w=w;
      this.h=h;
  }
  show(){
      const angle=this.body.angle;
      const pos=this.body.position;
      push();
      translate(pos.x,pos.y);
      rotate(angle);
      fill("#dddd33");
      rectMode(CENTER);
      rect(0,0,this.w,this.h);
      pop();
  }
}
class Circle{
  constructor(x,y,r){
      this.body=Matter.Bodies.circle(x,y,r,{frictionAir:0.05});
      Matter.World.add(world,this.body);
      this.r=r;
      this.acc=Matter.Vector.create(0,0);
      this.acceleration=4;
  }
  show(){
      let angle=this.body.angle;
      const pos=this.body.position;
      let targetAngle=Math.atan2((mouseX-windowWidth/2),-(mouseY-windowHeight/2));
      push();
      translate(pos.x,pos.y);
      //this.body.angle=lerpAngle(this.body.angle,targetAngle,1);
      this.body.angle=targetAngle;

      rotate(angle);
      strokeWeight(5);
      stroke("#505050");
      fill(blueT);
      imageMode(CENTER);
      //image(thanos,0,0,this.r*2,this.r*2);
      image(thanos,0,0,this.r*2-5,this.r*2-5);
      //circle(0,0,this.r*2-5);
      pop();
      /*
      push();
      fill('#000000');
      text(angle*180/Math.PI,pos.x+100,pos.y+100);
      text(mouseX+"pos x"+windowWidth/2,pos.x+100,pos.y+75);
      text(mouseY+"pos y"+windowHeight/2,pos.x+100,pos.y+50);
      pop();*/
  }
}

function lerpAngle(a, b, step) {
	// Prefer shortest distance,
	const delta = b - a;
	if (delta == 0.0) {
		return a;
	} else if (delta < -PI) {
		b += TWO_PI;
	} else if (delta > PI) {
		a += TWO_PI;
	}
	return (1.0 - step) * a + step * b;
}