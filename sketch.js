var backgroundImg;
var PLAY = 1;
var END = 0;
var START = 2;
var gameState = START;
var runner, runner_running,runner_collidedImg,runner_collided; 
var distance;
var starting,startingImg;
var gameOverImg,restartImg
var jumpSound,checkPointSound, dieSound;
var ground, groundImage, invisibleGround;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;

function preload(){
  runner_running = loadAnimation("runner 1.png","runner 2.png","runner 3.png","runner 4.png");
   runner_collidedImg = loadAnimation("runner collided.png");
  
  groundImage = loadImage("ground2.png");
  
 backgroundImg = loadImage("backgroundImg.png")
  
  obstacle1 = loadImage("car1.png");
  obstacle2 = loadImage("car2.png");
  obstacle3 = loadImage("motorcycle.png");
  obstacle4 = loadImage("scooty.png");

  startingImg = loadImage("start.png");
   restartImg = loadImage("restart1.jpg")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(1200, 600);
  

 

  runner = createSprite(100,360,20,50);
  runner.addAnimation("running", runner_running);
 // runner.addAnimation("collided" ,trex_collided);
  runner.scale = 0.2;


  runner_collided = createSprite(100,460,20,50);
  runner_collided.addAnimation("runnercollided", runner_collidedImg);
  runner_collided.scale = 0.2;
  runner_collided.visible = false;

  ground = createSprite(600,550,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;

  starting = createSprite(600,300);
  starting.addImage(startingImg);
  starting.visible = false;

   gameOver = createSprite(600,200);
  gameOver.addImage(gameOverImg);
  gameOver.visible = false;

  restart = createSprite(600,260);
 restart.addImage(restartImg);
  restart.visible = false;

  gameOver.scale = 0.5;
  restart.scale = 0.1;
  starting.scale = 0.1;
  invisibleGround = createSprite(600,530,1200,80);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
 
  

  runner.visible = false;
  runner.setCollider("rectangle",0,0,300,1000);
  runner.debug = true
  
  distance = 0;
  
}

function draw() {
  
  background(backgroundImg);
  //displaying score
  text("Distance: "+ distance, 1100,100);
  
 
  if(gameState === START){
    starting.visible = true;
   
    textSize(50);
    fill(255);
    text("Best Of Luck👍👍", 400,200);
   
    if(mousePressedOver(starting)){
      gameState = PLAY;
      
    }
  }
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    starting.visible = false
    //move the ground
    ground.velocityX = -4;
runner.visible = true;
    edges= createEdgeSprites();
   runner .collide(edges);

    //scoring
    distance = distance + Math.round(frameCount/60);


    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& runner.y >= 50) {
        runner.velocityY = -20;
        jumpSound.play();
    }
    
    //add gravity
    runner.velocityY = runner.velocityY + 0.8
  
   
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(runner)){
    //  trex.velocityY = -12;
    //  jumpSound.play()
        gameState = END;
        dieSound.play()
       runner_collided.visible = true;
       runner.visible = false;
    }
  }
   else if (gameState === END) {
     
      gameOver.visible = true;
      restart.visible = true;
      starting.visible = false
      ground.velocityX = -(4+3*distance/100);
  
      
      ground.velocityX = 0;
      runner.velocityY = 0
     
      //change the trex animation
     // runner.changeAnimation("collided", runner_collided);
     
      //set lifetime of the game objects so that they are never destroyed
      obstaclesGroup.setLifetimeEach(-1);
      obstaclesGroup.destroyEach();
     
      obstaclesGroup.setVelocityXEach(0);
     
   if(mousePressedOver(restart)){
    reset();
   }
   }
 
  //stop trex from falling down
  runner.collide(invisibleGround);
  obstaclesGroup.collide(invisibleGround);
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 100 === 0){
   var obstacle = createSprite(1000,460,10,40);
   obstacle.velocityX = -(6+distance/100);
   obstacle.scale = 0.2;
   obstacle.setCollider("rectangle",100,0,1500,700);
  obstacle.debug = true
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}


function reset(){
 
  
    gameState = PLAY; 
    runner.changeAnimation("trex_running"); 
 
 
  distance = 0;
  
  obstaclesGroup.destroyEach();
 runner_collided.visible = false;

}

