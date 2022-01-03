
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var jungle, invisiblejungle;

var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart;

function preload(){
  zombie_running =   loadAnimation("zombie1.png","zombie2.png");
  zombie_collided = loadAnimation("zombie1.png");
  jungleImage = loadImage("bg.png");
  food1 = loadImage("chicken.png");
  food2 = loadImage("mouse.png");
  food3 = loadImage("rabbit.png");
  obstacle1 = loadImage("stone.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(800, 400);

  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=0.3
  jungle.x = width /2;

  zombie = createSprite(100,200,20,50);
  zombie.addAnimation("running", zombie_running);
  zombie.addAnimation("collided", zombie_collided);
  zombie.scale = 0.1;
  zombie.setCollider("circle",0,0,300)
    
  invisibleGround = createSprite(400,350,1600,10);
  invisibleGround.visible = false;

  gameOver = createSprite(400,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(550,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
  
  foodsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

}

function draw() {
  background(255);
  
  zombie.x=camera.position.x-270;
   
  if (gameState===PLAY){

    jungle.velocityX=-3

    if(jungle.x<100)
    {
       jungle.x=400
    }
   console.log(zombie.y)
    if(keyDown("space")&& zombie.y>270) {
      zombie.velocityY = -16;
    }
  
    zombie.velocityY = zombie.velocityY + 0.8
    spawnFood();
    spawnObstacles();

    zombie.collide(invisibleGround);
    
    if(obstaclesGroup.isTouching(zombie)){
      gameState = END;
    }
    if(foodsGroup.isTouching(zombie)){
      score = score + 1;
      foodsGroup.destroyEach();
    }
  }
  else if (gameState === END) {
    gameOver.x=camera.position.x;
    restart.x=camera.position.x;
    gameOver.visible = true;
    restart.visible = true;
    zombie.velocityY = 0;
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    foodsGroup.setVelocityXEach(0);

    zombie.changeAnimation("collided",zombie_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    foodsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
        reset();
    }
  }

  else if (gameState === WIN) {
    jungle.velocityX = 0;
    zombie.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    foodsGroup.setVelocityXEach(0);

    zombie.changeAnimation("collided",zombie_collided);

    obstaclesGroup.setLifetimeEach(-1);
    foodGroup.setLifetimeEach(-1);
  }
  
  
  drawSprites();

  textSize(20);
  stroke(3);
  fill("black")
  text("Score: "+ score, camera.position.x,50);
  
  if(score >= 20){
    zombie.visible = false;
    textSize(30);
    stroke(3);
    fill("black");
    text("Congragulations!! You win the game!! ", 70,200);
    gameState = WIN;
  }
}

function spawnFood() {
 
  if (frameCount % 150 === 0) {

    var food = createSprite(camera.position.x+500,330,40,10);

    food.velocityX = -(6 + 3*score/100)
    food.scale = 0.15;

    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: food.addImage(food1);
              break;
      case 2: food.addImage(food2);
              break;
      case 3: food.addImage(food3);
              break;
      default: break;
    }
       
    food.scale = 0.15;
    food.lifetime = 400;
    
    food.setCollider("rectangle",0,0,food.width/2,food.height/2)
    foodsGroup.add(food);
    
  }
  
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {

    var obstacle = createSprite(camera.position.x+400,330,40,40);
    obstacle.setCollider("rectangle",0,0,200,200)
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(6 + 3*score/100)
    obstacle.scale = 0.1 ;      

    obstacle.lifetime = 400;
    obstaclesGroup.add(obstacle);
    
  }
}


function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  zombie.visible = true;
  zombie.changeAnimation("running",
  zombie_running);
  obstaclesGroup.destroyEach();
  foodsGroup.destroyEach();

}
