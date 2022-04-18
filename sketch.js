let my,shared,pacmanFont;
let marginVert,marginHori,col,row;
let obstacles, borders, ballCol,pacmanCol;
let path = [];
let scene = 0;
let size = 100;
let pacSize = 50;
let spacing = 2;
let vel = 1;
let speed,invert;
//let pacman,pacmanChompLeft;
let x = 10;
let y = 300;
let direction = "";
let px,py, red_px,red_py,blue_px,blue_py,green_px,green_py,purple_px,purple_py, 
vx,vy,red_vx, red_vy, blue_vx, blue_vy, green_vx, green_vy, purple_vx, purple_vy;//x & y velocity
let green_pathCount, purple_pathCount;


function preload(){
    partyConnect(
        "wss://deepstream-server-1.herokuapp.com",
        "Pacman_basic",
        "main1"
      );
      shared = partyLoadShared("globals");
      my = partyLoadMyShared();
      participants = partyLoadParticipantShareds();

      //sounds


     //sprites
     //pacman = loadImage("assets/Pacman.png");
    //pacman = loadImage("https://brittlizprice.com/wp-content/uploads/2022/04/Pacman.gif");
    //pacmanChompLeft = loadImage("assets/Pacman.gif");
     //Font
     pacmanFont = loadFont("assets/crackman.TTF");
}

function setup(){
    let mainCanvas = createCanvas(1400,1000);
    mainCanvas.parent("canvasdiv");
    background(1);
    let frameCount = frameRate(100);
    textFont(pacmanFont);
    col = width / size;
    row = height / size;
    marginVert = (width - col * size) / 2;
    marginHori = (height - row * size) / 2;
    //change colors - or make them random
    obstacles = color(50,0,200);
    borders = color(80,60,200);
    ballCol = color(255);
    pacmanCol = color(254,213,0);

    speed = false;
    invert = false;

    //initialize pacman
    px = centerX(9);
    py = centerY(5);
    vx = 0;
    vy = 0;

    //red ghost
    red_px = centerX(9);
    red_py = centerY(1);
    red_vx = 0;
    red_vy = 0;

    //blue ghost
    blue_px = centerX(7);
    blue_py = centerY(5);
    blue_vx = 0;
    blue_vy = 0;

    //green ghost
    green_px = centerX(3);
    green_py = centerY(4);
    green_vx = 0;
    green_vy = 0;
    green_pathCount = 0;

    //purple ghost
    purple_px = centerX(col);
    purple_py = centerY(7);
    purple_vx = 0;
    purple_vy = 0;
    purple_pathCount = 0;

    for(let i = 0; i < col; i++){
        path[i] = [];
       for(let j = 0; j < row; j++){
          path[i][j] = [[col + 2][row + 2]];
       }
    }
   

        //toggle server info
    partyToggleInfo(false);
    toggle = document.getElementById('toggle');

    if(partyIsHost()){
        partySetShared(shared,{
            player: 1,
            hostStart: false,
            hostRestart: false,
            role: "Observer"
        });
    }

    // Make a select menu
    teamDropDownMenu = createSelect();
    teamDropDownMenu.option("Pacman");
    teamDropDownMenu.option("Blue Ghost");
    teamDropDownMenu.option("Red Ghost");
    teamDropDownMenu.option("Green Ghost");
    teamDropDownMenu.option("Purple Ghost");
    teamDropDownMenu.position(40,800);
    teamDropDownMenu.id("menu");

    teamDropDownMenu.changed(() =>{
        my.selectedTeam = teamDropDownMenu.value();
    });
}

function draw(){
  //  image(pacman,300,300,200,100);
    switch(scene){
    case 1:
      game();
      break;
    default:
      startScreen();
      break;
   }
}


function mousePressed(){
    if(scene == 0){
        scene = 1;
    }
}

function startScreen(){
    textSize(60);
    fill(255);
    if(frameCount % 60 < 30){
       text("Start Game",500,750);
    }
}

function waitForHost(){

}

function game(){
    background(0);
    maze();
    tokens();
    pacmanControls();
    collisionDetection();
    // ghostControls();
    // chaosMode();
    //pacman appears on the other side of the screen when out of bounds
    px = (px + width) % width;

    //pacman movement
    keyPressed();
}

function gameOver(){

}

function pause(){

}

function death(){

}

function victory(){

}

function maze(){
    //boundaries
    fill(0);
    stroke(borders);
    strokeWeight(spacing);
    rect(marginHori + 25,marginVert + 15,1350, 975);//recalculate
    fill(0);
    noStroke();

    //exits
    //left side
    rect(9, centerY(6) - 25, 25, 70);
    stroke(borders);
    line(centerX(0),centerY(6) - 25, centerX(1) - 25, centerY(6) - 25);
    line(centerX(0), centerY(6) + 45, centerX(1) - 25, centerY(6) + 45);

    //right
    noStroke();
    rect(centerX(col) + 10, centerY(6) - 25, 25, 70);
    stroke(borders);
    line(centerX(col) + 25, centerY(6) + 45, centerX(col + 1), centerY(6) + 45);
    line(centerX(col) + 25, centerY(6) - 25, centerX(col + 1), centerY(6) - 25);

    //change the walls!
    // Draw obstacles of the type: (column, row, width XX, length YY)
    walls(2, 2, 1, 2);
    walls(2, 5, 2, 1);
    walls(2, 7, 1, 3);
    walls(3, 7, 1, 1);
    walls(4, 2, 1, 3);
    walls(4, 9, 2, 1);
    walls(5, 6, 2, 1);
    walls(5, 7, 1, 1);
    walls(4, 2, 1, 3);
    walls(7, 8, 2, 2);
    walls(6, 4, 4, 1);
    walls(6, 2, 1, 1);
    walls(8, 2, 1, 2);
    walls(13, 2, 1, 2);
    walls(11, 2, 1, 3);
    walls(10, 2, 1, 1);
    walls(12, 5, 2, 1);
    walls(13, 7, 1, 3);
    walls(12, 7, 1, 1);
    walls(8, 6, 3, 1);
    walls(10, 8, 1, 2);
    walls(11, 9, 1, 1);
}
//draw walls after tokens - temp fix
function walls(x,y,numC,numR){
    let x0, y0, large, comp;
    x0 = marginHori + (x - 1) * size;
    y0 = marginVert + (y - 1) * size;
    large = numC * size;
    comp = numR * size;
    fill(obstacles);
    noStroke();
    strokeWeight(spacing / 2);
    rect(x0,y0,large,comp);
}

//discs around the maze
function tokens(){
  let cx,cy;
 // ellipseMode(CENTER);
  //fill(255);
  noStroke();
  for(let i = 1; i <= col; i++){
    for(let j = 1; j <= row; j++){
       cx = centerX(i);
       cy = centerY(j);
       //splice(list, value, position)
       path[j][i] = 2;//fix - draws all over the maze
       //splice(path,);
       //target the position or color of walls
       if(cy == 9){
        path.splice(i,1);
        path.splice(j,1);
       }
       if(path[j][i] == 2){
         // path[i].splice(j,1);
          fill(ballCol);
          ellipse(cx,cy,25,25);
       }
    }
  }
}

function centerX(col){
    return marginHori + (col - 0.5) * size;
}

function centerY(nLin){
    return marginVert + (nLin - 0.5) * size;
}

//may cause issues later
// transform a cell's index into on-screen coordinates
function positionX(px){
    return (int)(((px - marginHori) / size) + 0.5);
}

// transform a cell's index into on-screen coordinates
function positionY(py){
  return (int)(((py - marginVert) / size) + 0.5);
}

function turnRight(){
  if(path[positionY(py)][positionX(px) + 1] != 0){
      return true;
  }
  else{
      return false;
  }
}

function turnLeft(){
    for(let j = 1; j <= row; j++){
        for(let i = 1; i <= col; i++){
            if(px == centerX(i) && py == centerY(j)){
                if(get(centerX(i-1),(centerY(j) == obstacles  || px <= centerX(1) && (j != 6)))){
                    return false;
                }
            }
        }
    }
    return true;
}

//check if pacman can turn downward
function turnDown(){
    if(path[positionY(py) + 1][positionX(px)] != 0){
        return true;
    }
    else{
        return false;
    }
}

function turnUp(){
    for(let j = 1; j <= row; j++){
        for(let i = 1; i <= col; i++){
            if(px == centerX(i) && py == centerY(j)){
                if(get(centerX(i),centerY(j - 1)) == obstacles || py <= centerY(1)){
                    return false;
                }
            }
        }
    }
    return true;
}

function keyPressed(){
    if(keyIsPressed){
        //right
  if(keyCode == RIGHT_ARROW){
    for(let i = 1; i < row + 1; i++){
        if(py == centerY(i) && turnRight()){
            vx = vel;
            vy = 0;
            direction = "right";
        }
       // x += 5;
    }

    console.log("Right arrow pressed");
  }

  //left
  if(keyCode == LEFT_ARROW){
    for(let i = 1; i < row + 1; i++){
        if(py == centerY(i) && turnLeft()){
            vx = -vel;
            vy = 0;
            direction = "left";
        }
       // x -= 5;
    }
    console.log("Left arrow pressed");
  }

  //up
  if(keyCode == UP_ARROW){
     for(let i = 1; i < col + 1; i++){
         if(px == centerX(i) && turnUp()){
             vx = 0;
             vy = vel;
             direction = "up";
         }
     }
  }

  //down
  if(keyCode == DOWN_ARROW){
    for(let i = 1; i < col + 1; i++){
        if(px == centerX(i) && turnDown()){
            vx = 0;
            vy = -vel;
            direction == "down";
        }
    }
  }
    }
//    switch(keyCode){
//        case RIGHT:
//         for(let i = 1; i < row + 1; i++){
//             if(py == centerY(i) && turnRight()){
//                 vx = vel;
//                 vy = 0;
//                 direction = "right";
//             }
//         }
//         break;
//         case LEFT:
//             for(let i = 1; i < row + 1; i++){
//                 if(py == centerY(i) && turnLeft()){
//                     vx = -vel;
//                     vy = 0;
//                     direction = "left";
//                 }
//             }
//    }
}

function pacmanControls(){
    fill(pacmanCol);
    push();
    translate(px += vx, py -= vy);

    if(direction == "down"){
        rotate(HALF_PI);
    }

    if(direction == "up"){
        rotate(PI + HALF_PI);
    }

    if(direction == "left"){
        rotate(PI);
        // push();
        // fill(0);
        // ellipse(0,-10,10,10);
        // pop();
    }
    //right
    if(vx != 0 || vy != 0){
        //if pacman's moving then do the animation
        arc(0,0,pacSize,pacSize,map((millis() % 350), 50, 300, 0, 0.52), map((millis() % 350), 50, 300, TWO_PI, 5.76));
        // push();
        // fill(0);
        // ellipse(0,-10,10,10);
        // pop();
    }
    else{
        //no animation if he's not moving
        arc(0,0,pacSize,pacSize,QUARTER_PI,(7 + PI/4));
    }
    pop();
}

function collisionDetection(){
    if(!turnRight() && direction == "right"){
        vx = 0;
    }
    if(!turnLeft() && direction == "left"){
        vx = 0;
    }

    if(!turnDown() && direction == "down"){
        vy = 0;
    }

    if(turnUp() && direction == "up"){
        vy = 0;
    }
}

function ghostControls(){

}

function chaosMode(){

}