let my,shared,pacmanFont;
let marginVert,marginHori,col,row;
let obstacles, borders, ballCol,pacmanCol,redCol,blueCol,greenCol,purpleCol;

let pacScore = 0;
let blinkyScore = 0;
let inkyScore = 0;
let clydeScore = 0;
let winkyScore = 0;

let path = [];
let wasHere = [];
let createWalls = [];
let eggs = [];

let scene = 0;
let size = 90;
let pacSize = 55;
let ghostSize = 50;
let spacing = 2;

let isPaused = false;
let hightlight = false;
let pacman,instructions,link;
let titleBackground,paused;

let x = 10;
let y = 300;

let redGhostArray = [];
let blueGhostArray = [];
let greenGhostArray = [];
let purpleGhostArray = [];

function preload(){
    partyConnect(
        "wss://deepstream-server-1.herokuapp.com",
        "Pacman_Chaos_test",
        "main1"
      );
    shared = partyLoadShared("globals");
    my = partyLoadMyShared();//object in participants array
    participants = partyLoadParticipantShareds();
    //sounds

    //images
    titleBackground = loadImage("assets/titleScreen.png");
    paused = loadImage("assets/PausedScreen.png");

    //sprites
    redGhostArray[0] = loadImage("assets/RedGhostStatic.png");
    redGhostArray[1] = loadImage("assets/RedGhostLeft.png");
    redGhostArray[2] = loadImage("assets/RedGhostRight.png");
    redGhostArray[3] = loadImage("assets/RedGhostUp.png");
    redGhostArray[4] = loadImage("assets/RedGhostDown.png");
    redGhostArray[5] = loadImage("assets/RedGhostDead.png");

    blueGhostArray[0] = loadImage("assets/BlueGhostStatic.png");
    blueGhostArray[1] = loadImage("assets/BlueGhostLeft.png");
    blueGhostArray[2] = loadImage("assets/BlueGhostRight.png");
    blueGhostArray[3] = loadImage("assets/BlueGhostUp.png");
    blueGhostArray[4] = loadImage("assets/BlueGhostDown.png");
    blueGhostArray[5] = loadImage("assets/BlueGhostDead.png");

    greenGhostArray[0] = loadImage("assets/GreenGhostStatic.png");
    greenGhostArray[1] = loadImage("assets/GreenGhostLeft.png");
    greenGhostArray[2] = loadImage("assets/GreenGhostRight.png");
    greenGhostArray[3] = loadImage("assets/GreenGhostUp.png");
    greenGhostArray[4] = loadImage("assets/GreenGhostDown.png");
    greenGhostArray[5] = loadImage("assets/GreenGhostDead.png");

    purpleGhostArray[0] = loadImage("assets/PurpleGhostStatic.png");
    purpleGhostArray[1] = loadImage("assets/PurpleGhostLeft.png");
    purpleGhostArray[2] = loadImage("assets/PurpleGhostRight.png");
    purpleGhostArray[3] = loadImage("assets/PurpleGhostUp.png");
    purpleGhostArray[4] = loadImage("assets/PurpleGhostDown.png");
    purpleGhostArray[5] = loadImage("assets/PurpleGhostDead.png");

     //Font
     pacmanFont = loadFont("assets/crackman.TTF");
}

function setup(){
    let mainCanvas = createCanvas(1100,900);
    mainCanvas.parent("canvasdiv");
    let frameCount = frameRate(100);
    // angleMode(RADIANS);
    textFont(pacmanFont);
    col = width / size;
    row = height / size; 
   
    marginVert = Math.floor((width - col * size) / 2);
    marginHori = Math.floor((height - row * size) / 2);

    //change colors - or make them random
    obstacles = color(50,0,200);
    borders = color(80,60,200);
    ballCol = color(255);
    pacmanCol = color(254,213,0);
    redCol = color(255,0,0);
    blueCol = color(0,0,255);
    greenCol = color(0,255,0);
    purpleCol = color(255,0,255);

    link = createA("instructions.html","");

    instructions = createImg("assets/icon.png","instructions.html").parent(link);
    instructions.position(1350,50);
    instructions.size(60,60);
        //toggle server info
    partyToggleInfo(false);
    toggle = document.getElementById('toggle');

    if(partyIsHost()){
        partySetShared(shared,{
            player: 0,
            gameState: "PLAYING",
            hostStart: false,
            hostRestart: false,
            role: "Observer"
        });
    }

    // Make a select menu
    // teamDropDownMenu = createSelect();
    // teamDropDownMenu.option("Choose a Team");
    // teamDropDownMenu.disable("Choose a Team");
    // teamDropDownMenu.option("Pac-man");
    // teamDropDownMenu.option("Red Ghost");
    // teamDropDownMenu.option("Blue Ghost");
    // teamDropDownMenu.option("Green Ghost");
    // teamDropDownMenu.option("Purple Ghost");
    // teamDropDownMenu.position(1470,600);
    // teamDropDownMenu.id("menu");
    
    // // When an option is chosen, assign it to my.selectedTeam
    // teamDropDownMenu.changed(() =>{
    //     my.selectedTeam = teamDropDownMenu.value();
    // });

    /*using participants solves issues with players being able 
    to control the same player at once*/
    my.w = 60;
    my.h = 60;
    my.vx = 0;
    my.vy =  0;
    my.speed = 3;
    my.speedX = 0;
    my.speedY = 0;
    my.dir = 0;
    my.vel = 1;
    my.thetaOff = 0;
    my.theta = 0;

    if(participants.length == 1){
    //   my.selectedTeam = "Pac-man";
      my.color = "yellow";
      my.px = centerX(6);
      my.py = centerX(7);
      my.pacPoints = 0;
    }
    if(participants.length == 2){
    //  my.selectedTeam = "Red Ghost";
      my.color = "red";
     // my.sprite = "assets/RedGhostStatic.png";
    //   console.log(my.px);
      my.px = ghostCenterX(5);
      my.py = ghostCenterY(4);
      my.ghostPoints = 0;
    }
    if(participants.length == 3){
        my.color = "blue";
        my.px = ghostCenterX(6);
        my.py = ghostCenterY(4);
        my.ghostPoints = 0;
    // my.selectedTeam = "Blue Ghost";
    }
    if(participants.length == 4){
        my.color = "green";
        my.px = ghostCenterX(5);
        my.py = ghostCenterY(5);
        my.ghostPoints = 0;
    // my.selectedTeam = "Green Ghost";
    }
    if(participants.length == 5){
        my.color = "purple";
        my.px = ghostCenterX(6);
        my.py = ghostCenterY(5);
        my.ghostPoints = 0;
    // my.selectedTeam = "Purple Ghost";
    }
    else{
      shared.role = "observer";
    }
}

function draw(){
    background(1);
    instructions.hide();
    scoreBoard();
    switch(scene){
    case 1:
      waitForHost();
      break;
    case 2:
      game();
      break;
    case 3:
        gameOver();
        break;
    default:
      startScreen();
      instructions.show();
      break;
   }
}


function mousePressed(){
    if(scene == 0 && mouseX < 800 && mouseX > 350 && mouseY < 750 && mouseY > 700){
        scene = 1;
    }

    //exit or quit
}

function startScreen(){
    image(titleBackground,0,0,1100,1000);
    textSize(90);
    fill(255);
    text("Pac-man: Chaos",100,200);
    textSize(60);
    
    if(frameCount % 60 < 30){
        text("Start Game",350,750);
    }

   //buttonHighlight();
}

function waitForHost(){
    textSize(40);
    fill(255);
    if(partyIsHost()){
      text("You're the host" + "\n" + "Press ENTER to start",300,300);
      if(keyCode == 13){
          shared.hostStart = true;
          scene = 2;
      }
    }
    else if(!partyIsHost()){
        text("Waiting for the host",300,300);
        if(shared.hostStart == true){
            scene = 2;
        }
    }
}

function buttonHighlight(){

}

function scoreBoard(){
    let scoreBoard = createDiv("Score Board");
    scoreBoard.id("scoreBoard");
    scoreBoard.position(1475,430);

    //pac-man
    let pacScoreText = createElement("h3", "Pac-man: " + pacScore);
    pacScoreText.parent(scoreBoard);

    //red ghost
    let blinkyScoreText = createElement("h3","Blinky: " + blinkyScore);
    blinkyScoreText.parent(scoreBoard);

    //blue ghost
    let inkyScoreText = createElement("h3", "Inky: " + inkyScore);
    inkyScoreText.parent(scoreBoard);

    //green ghost
    let clydeScoreText = createElement("h3","Clyde: " + clydeScore);
    clydeScoreText.parent(scoreBoard);

    //purple ghost
    let winkyScoreText = createElement("h3","Winky: " + winkyScore);
    winkyScoreText.parent(scoreBoard);
}

function game(){
    background(0);
    maze();
    // tokens();
    drawPlayers();
    controls();
    // if(shared.gameState === "PLAYING"){
    //     game();
    // }
    // else{
    //     gameOver();
    // }

    if(partyIsHost()){
        collisionDetection();
        detectWalls();
    }
}

function gameOver(){
    background(220);
    fill(255,0,0);
    textSize(40);
    textAlign(CENTER);
    text("Game Over!", width/2,300);

    if(partyIsHost()){
        text("Press R to restart",width/2,500);
        shared.hostRestart = false;

        if(keyCode == 82){
            shared.hostRestart = true;
            shared.hostStart = false;
            scene = 1;
        }
    }
    else if(!partyIsHost()){
        text("Wait for the host to restart", width/2, 500);
        if(shared.hostRestart == true){
            scene = 1;
        }
    }

}

function pause(){
    background(paused);
    textSize(60);
    text("PAUSED",300,300);
}

function death(){

}

function victory(){

}

function collisionDetection(){
  //players
  for (const p1 of participants) {
    for (const p2 of participants) {
      if (p1 === p2) continue;
        if (dist(p1.px, p1.py, p2.px, p2.py) < 20) {
        //console.log("collision!");
            // gameOver();
            // shared.gameState = "GAME_OVER";
        }
    //    for(let i = 0; i < createWalls.length; i++){
    //        if(dist(p1.px,p1.py,createWalls[i][0] < 20)){
    //           console.log("P1 has hit the wall");
    //        }
    //    }
    }
  }
}

function detectWalls(){
    for(let i = 0; i < createWalls.length; i++){
       for(const p of participants){
           //top wall get coordinates of individual walls
           if(dist(p.px,p.py,createWalls[i][0],createWalls[i][3]) < 20){
               console.log("Hit wall");
           }
       }
    }
}

function maze(){
    //boundaries
    fill(0);
    stroke(borders);
    strokeWeight(spacing * 3);
    //
    rect(marginHori + 20,marginVert + 15,1050, 870);//recalculate
    fill(0);
    noStroke();

    //exits
    //left side
    rect(9, centerY(6) - 100, 25, 100);
    stroke(borders);
    line(centerX(0),centerY(6) - 100, centerX(1) - 25, centerY(6) - 100);
    line(centerX(0), centerY(6), centerX(1) - 25, centerY(6));

    //right
    noStroke();
    rect(centerX(col) + 10, centerY(6) - 100, 25, 100);
    stroke(borders);
    line(centerX(col) + 15, centerY(6) - 100, centerX(col + 1), centerY(6) - 100);
    line(centerX(col) + 15, centerY(6), centerX(col + 1), centerY(6));
    /*
    make array of the walls to loop through it
    change the walls!
    Draw obstacles of the type: (column, row, width XX, length YY)
    array of coordinates - iterate and don't draw eggs on the coordinates*/
    
        //top left
        walls(2, 2, 1, 2),
        walls(2, 2, 2, 1),

        //bottom left
        walls(2, 7, 1, 2),
        walls(2, 7, 1, 1),
        walls(2, 8, 2, 1),
        walls(4, 8, 1, 2),
  
        //top right
        walls(8, 2, 2, 1),
        walls(10, 2, 1, 3),

        //ghost cage
        walls(4, 4, 1, 2),
        walls(4, 6, 2, 1),
        walls(5, 6, 2, 1),
        walls(7, 4, 1, 3),
        
        //bottom
        walls(6, 10, 2, 0.75),
        //bottom right
        walls(10, 6, 1, 1),
        walls(10, 7, 2, 1),
        walls(8, 8, 2, 1),
        walls(9, 8, 1, 2);
       // console.log(createWalls);
}

//draw walls after tokens - temp fix
function walls(x,y,numC,numR){
    let x0, y0, large, comp;
    x0 = marginHori + (x - 1) * size; // _ + (9) * 100 = 
    y0 = marginVert + (y - 1) * size; // _ + (299) * 100 = 
    large = numC * 90;
    comp = numR * 90;
    fill(obstacles);
    noStroke();
    strokeWeight(spacing / 2);
    rect(x0,y0,large,comp);
    //console.log(large,comp);
    createWalls.push([x0,y0,large,comp]);
}

//pellets around the maze
//use wall array - make sure eggs don't collide with walls - if they do remove eggs from egg array
function tokens(){
  let cx,cy;
  noStroke();
  for(let i = 1; i <= col; i++){
    for(let j = 1; j <= row; j++){
       cx = centerX(i);
       cy = centerY(j);
       for(let i = 0; i < createWalls.length; i++){
            //see if walls x & y is the same as the create walls
           //loop through walls and see if
           //only create eggs if there is not a wall in location - centerX, centerY
            if(cx <= createWalls[i][0] || cy >= createWalls[i][1]){
                fill(ballCol);
                ellipse(cx,cy,25,25);
            }
            //eggs.push([cx,cy]);
          }
       }
    }
  //console.log(eggs);
}

function centerX(col){
    return marginHori + (col - 0.5) * size;
}

function centerY(row){
    return marginVert + (row - 0.5) * size;
}

function ghostCenterX(col){
    return marginHori + (col - 0.75) * size;
}

function ghostCenterY(row){
    return marginVert + (row - 0.75) * size;
}

function drawPlayers(){
    for(const p of participants){
        fill(p.color);
        ellipse(p.px,p.py,p.w,p.h);
        // image(p.sprite,p.px,p.py,50,50);
        // console.log(p.sprite);
    }
}

function controls(){
    //left wall
    if(my.vx < 0 && my.px > 50){
        my.px += my.vx;
    }
    
    //right wall
    if(my.vx > 0 && my.px < 1035){
        my.px += my.vx;
    }

    //top wall
    if(my.vy < 0 && my.py > 50){
        my.py += my.vy;
    }

    //bottom wall
    if(my.vy > 0 && my.py < 850){
        my.py += my.vy;
    }

    my.vx = 0;
    my.vy = 0;
    //Up arrow or W
    //vertical collision - make velocity 0
    if(keyIsDown(UP_ARROW) || keyIsDown(87)){
        // if(my.selectedTeam == "Pac-man"){
            my.vx = 0;
            my.vy = -my.vel * my.speed;
            my.dir = 1;
        // }
    }
    //down arrow or S
    if(keyIsDown(DOWN_ARROW) || keyIsDown(83)){
        // if(my.selectedTeam == "Pac-man"){
            my.vx = 0;
            my.vy = my.vel * my.speed;
            my.dir = 2;
        // }
    }
    //left arrow & A
    if(keyIsDown(LEFT_ARROW) || keyIsDown(65)){
        // if(my.selectedTeam == "Pac-man"){
            my.vx = -my.vel * my.speed;
            my.vy = 0;
            my.dir = 3;
        // }
    }
    //right arrow or D
    if(keyIsDown(RIGHT_ARROW) || keyIsDown(68)){
        // if(my.selectedTeam == "Pac-man"){
            my.vx = my.vel * my.speed;
            my.vy = 0;
            my.dir = 4;
        // }
    }
}

function chaosMode(){

}