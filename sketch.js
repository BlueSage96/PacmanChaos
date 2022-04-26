let my,shared,pacmanFont;
let marginVert,marginHori,col,row;
let obstacles, borders, ballCol,pacmanCol;
let path = [];
let wasHere = [];
let createWalls = [];
let scene = 0;
let size = 100;
let pacSize = 60;
let ghostSize = 70;
let spacing = 2;
// let speed = 3;
// let speedX = 0;
// let speedY = 0;
// let dir,red_dir,blue_dir,green_dir,purple_dir;
// let thetaOff = 0;
// let vel = 1;
let pacman,instructions,link;
let titleBackground;
let x = 10;
let y = 300;
// let px,py,vx,vy;//x & y velocity
// let red_px,red_py,blue_px,blue_py,green_px,green_py,purple_px,purple_py,
// red_vx, red_vy, blue_vx, blue_vy, green_vx, green_vy, purple_vx, purple_vy,
// green_pathCount,purple_pathCount;
let redGhostArray = [];
let blueGhostArray = [];
let greenGhostArray = [];
let purpleGhostArray = [];
// let frameCount = 0;

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

    //images
    titleBackground = loadImage("assets/titleScreen.png");
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
    let mainCanvas = createCanvas(1450,1150);
    mainCanvas.parent("canvasdiv");
    let frameCount = frameRate(200);

    background(1);
    // angleMode(RADIANS);
    textFont(pacmanFont);
    col = width / size;//  1400/10 = 14
    row = height / size; // 1000/100 = 10
    //(1400 - 14 * 100) / 2 = 0
    marginVert = Math.floor((width - col * size) / 2);
    // (1000 - 10 * 100)/ 2 = 0
    marginHori = Math.floor((height - row * size) / 2);
    //change colors - or make them random
    obstacles = color(50,0,200);
    borders = color(80,60,200);
    ballCol = color(255);
    pacmanCol = color(254,213,0);
    link = createA("instructions.html","");

    instructions = createImg("assets/icon.png","instructions.html").parent(link);
    instructions.position(1700,100);
    instructions.size(80,80);

    for(let i = 0; i < col; i++){
        path[i] = [];
        wasHere[i] = [];
       for(let j = 0; j < row; j++){
          path[i][j] = [[col + 2][row + 2]];
        //   wasHere[i][j] = [[col + 2][row + 2]];
       }
    }
        //toggle server info
    partyToggleInfo(false);
    toggle = document.getElementById('toggle');

    //connect 4 observer role
    if(partyIsHost()){
        partySetShared(shared,{
            player: 0,
            //initialize pacman
            px: centerX(8),
            py: centerY(7),
            vx: 0,
            vy: 0,
            speed: 3,
            speedX: 0,
            speedY: 0,
            dir: 0,
            red_dir: 0,
            blue_dir: 0,
            green_dir: 0,
            purple_dir: 0,
            vel: 1,
            thetaOff: 0,
            theta: 0,

            //red ghost
            red_px: ghostCenterX(7),
            red_py: ghostCenterY(4),
            red_vx: 0,
            red_vy: 0,

            //blue
            blue_px: ghostCenterX(8),
            blue_py: ghostCenterY(4),
            blue_vx: 0,
            blue_vy: 0,

            //green
            green_px: ghostCenterX(7),
            green_py: ghostCenterY(5),
            green_vx: 0,
            green_vy: 0,
            green_pathCount: 0,

            //purple
            purple_px: ghostCenterX(8),//was col
            purple_py: ghostCenterY(5),
            purple_vx: 0,
            purple_vy: 0,
            purple_pathCount: 0,

            hostStart: false,
            hostRestart: false,
            role: "Observer"
        });
    }

    // Make a select menu
    teamDropDownMenu = createSelect();
    teamDropDownMenu.option("Choose a Team");
    teamDropDownMenu.disable("Choose a Team");
    teamDropDownMenu.option("Pac-man");
    teamDropDownMenu.option("Red Ghost");
    teamDropDownMenu.option("Blue Ghost");
    teamDropDownMenu.option("Green Ghost");
    teamDropDownMenu.option("Purple Ghost");
    teamDropDownMenu.position(1935,600);
    teamDropDownMenu.id("menu");

    // if(partyIsHost){
        if(shared.player == 1){
            my.selectedTeam = "Pac-man";
        }
        else if(shared.player == 2){
            my.selectedTeam = "Red Ghost";
        }
        else if(shared.player == 3){
            my.sharedTeam = "Blue Ghost";
        }
        else if(shared.player == 4){
            my.sharedTeam = "Green Ghost";
        }
        else if(shared.player == 5){
            my.sharedTeam = "Purple Ghost";
        }
        else{
            my.sharedTeam = "Observer";
        }
    // }
    
    // When an option is chosen, assign it to my.selectedTeam
    teamDropDownMenu.changed(() =>{
        my.selectedTeam = teamDropDownMenu.value();
    });
}

function draw(){
    instructions.hide();
    switch(scene){
    case 1:
      game();
      break;
    default:
      startScreen();
      instructions.show();
      break;
   }
}


function mousePressed(){
    if(scene == 0 && mouseX < 950 && mouseX > 500 && mouseY < 950 && mouseY > 850){
        scene = 1;
    }

    //exit or quit
}

function startScreen(){
    image(titleBackground,50,100);
    textSize(100);
    fill(255);
    text("Pac-man: Chaos",250,350);
    textSize(60);
    if(frameCount % 60 < 30){
        text("Start Game",500,950);
    }
  console.log(frameCount);
   //buttonHighlight();
}

function buttonHighlight(){

}

function waitForHost(){

}

function game(){
    background(0);
    maze();
    tokens();
    //pacman
    pacmanDraw();
    pacmanControls();

    //red ghost
    drawRedGhost();
    redGhostControls();

    //blue ghost
    drawBlueGhost();

    //green ghost
    drawGreenGhost();

    //purple ghost
    drawPurpleGhost();

    // definePath();

    detectWall();
    // chaosMode();
    //pacman appears on the other side of the screen when out of bounds
    shared.px = (shared.px + width) % width;
    shared.py = (shared.py + height) % height;//temporary
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
    strokeWeight(spacing * 3);
    //
    rect(marginHori + 20,marginVert + 15,1400, 1120);//recalculate
    fill(0);
    noStroke();

    //exits
    //left side
    rect(9, centerY(6) - 25, 25, 100);
    stroke(borders);
    line(centerX(0),centerY(6) - 25, centerX(1) - 30, centerY(6) - 25);
    line(centerX(0), centerY(6) + 75, centerX(1) - 30, centerY(6) + 75);

    //right
    noStroke();
    rect(centerX(col) + 10, centerY(6) - 25, 25, 120);
    stroke(borders);
    line(centerX(col) + 21, centerY(6) - 25, centerX(col + 1), centerY(6) - 25);
    line(centerX(col) + 21, centerY(6) + 95, centerX(col + 1), centerY(6) + 95);
    /*
    make array of the walls to loop through it
    change the walls!
    Draw obstacles of the type: (column, row, width XX, length YY)
    array of coordinates - iterate and don't draw eggs on the coordinates*/
    createWalls = [
            //top left
            walls(2, 2, 2, 1),
            walls(2, 5, 2, 1),
            walls(2, 5, 1, 3),
            walls(4, 2, 1, 2),
            //bottom left
            walls(2, 9, 1, 3),
            walls(2, 9, 2, 1),
            walls(5, 8, 1, 3),
            walls(4, 11, 3, 1),
            //bottom right
            walls(11,11,3,1),
            walls(13,9,1,3),
            //ghost cage
            walls(6, 4, 1, 2),
            walls(6, 6, 2, 1),
            walls(7, 6, 2, 1),
            walls(9, 4, 1, 3),
            //T
            walls(7, 8, 4, 1),
            walls(8, 9, 1, 2),
            //walls(6, 4, 4, 1),

            //top
            walls(7, 2, 4, 1),

            //top right - cross
            walls(11, 4, 3, 1),
            walls(12, 2, 1, 6)
    ];
}

//draw walls after tokens - temp fix
function walls(x,y,numC,numR){
    let x0, y0, large, comp;
    x0 = marginHori + (x - 1) * size; // _ + (9) * 100 = 
    y0 = marginVert + (y - 1) * size; // _ + (299) * 100 = 
    large = numC * size;
    comp = numR * size;
    fill(obstacles);
    noStroke();
    strokeWeight(spacing / 2);
    rect(x0,y0,large,comp);
}

//pellets around the maze
function tokens(){
  let cx,cy;
  noStroke();
  for(let i = 1; i <= col; i++){
    for(let j = 1; j <= row; j++){
       cx = centerX(i);
       cy = centerY(j);//fixes space above and below tokens
       //splice(list, value, position)
       path[j][i] = 2;//fix - draws all over the maze

       if(path[j][i] == 2){
         // path[i].splice(j,1);
          fill(ballCol);
          ellipse(cx,cy,25,25);
       }
    }
  }
}

//define the array of the map
// function definePath(){
//    for(let j = 0; j <= row + 1; j++){
//        for(let i = 0; i <= col + 1; i++){
//            if(get(centerX(i),centerY(j) != obstacles && wasHere[j][i] == false)){
//                path[j][i] = 2;
//            }
//            if(i == 0 || j == 0 || i == col + 1 || j == row + 1){
//                path[j][i] = 0;
//            }
//            if((i == 0 || i == col + 1) && j == 6){
//                path[j][i] = 3;
//            }
//            if((i == 3 && j == 3) || (i == 12 && j == 3)){
//                path[j][i] = 4;
//            }
//            if(wasHere[8][4] == false){
//                path[8][4] = 4;
//            }
//            if(wasHere[8][4] == true){
//             path[8][4] = 1;
//         }
//         if(wasHere[8][11] == false){
//             path[8][11] = 4;
//         }
//         if(wasHere[8][11] == true){
//          path[8][11] = 1;
//      }
//        }
//    } 
// }

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
//pacman
function pacmanDraw(){
    fill(pacmanCol);
    stroke(0);
    strokeWeight(3);
    shared.theta = PI / 3 * sq(sin(shared.thetaOff));//chomping

    if(shared.speedY < 0){
        arc(shared.px,shared.py,pacSize,pacSize, -shared.theta - PI / 6, shared.theta + 7 * PI / 6);
    }

    else if(shared.speedY > 0){
        arc(shared.px,shared.py,pacSize,pacSize, -7 * PI /6 - shared.theta, shared.theta + PI / 6);
    }

    else if(shared.speedX < 0){
        arc(shared.px,shared.py,pacSize,pacSize, shared.theta + PI, -shared.theta + PI);
    }

    else if(shared.speedX > 0){
        arc(shared.px,shared.py,pacSize,pacSize,shared.theta,-shared.theta);
    }

    else{
        //up
        if(shared.dir == 1){
            arc(shared.px,shared.py,pacSize,pacSize,-shared.theta - PI / 6, shared.theta + 7 * PI / 6);
            //eyes
            fill(0);
            ellipse(shared.px+12,shared.py,10,10);
        }
        //down
        else if(shared.dir == 2){
            arc(shared.px,shared.py,pacSize,pacSize,-7 * PI / 6 - shared.theta, shared.theta + PI / 6);
            //eyes
            fill(0);
            ellipse(shared.px+12,shared.py,10,10);
        }
        //left
        else if(shared.dir == 3){
            arc(shared.px,shared.py,pacSize,pacSize,shared.theta + PI, -shared.theta + PI);
            //eyes
            fill(0);
            ellipse(shared.px,shared.py-12, 10,10);
        }
        //right
        else if(shared.dir == 4){
            arc(shared.px,shared.py,pacSize,pacSize,shared.theta,-shared.theta);
            //eyes
            fill(0);
            ellipse(shared.px,shared.py-12,10,10);
        }
        else{
            arc(shared.px,shared.py,pacSize,pacSize,shared.theta,-shared.theta);
            //eyes
            fill(0);
            ellipse(shared.px,shared.py-12,10,10);
        }
    }
    shared.thetaOff += 0.1;//mouth movement
}

function pacmanControls(){
    shared.px += shared.vx;
    shared.py += shared.vy;
    shared.vx = 0;
    shared.vy = 0;

    if(my.selectedTeam == "Pac-man"){
        //have to speed instead of speedX & speedY
        if(keyIsDown(UP_ARROW)){
            shared.vx = 0;
            shared.vy = -shared.vel * shared.speed;
            shared.dir = 1;
        }

        if(keyIsDown(DOWN_ARROW)){
            shared.vx = 0;
            shared.vy = shared.vel * shared.speed;
            shared.dir = 2;
        }

        if(keyIsDown(LEFT_ARROW)){
            shared.vx = -shared.vel * shared.speed;
            shared.vy = 0;
            shared.dir = 3;
        }

        if(keyIsDown(RIGHT_ARROW)){
            shared.vx = shared.vel * shared.speed;
            shared.vy = 0;
            shared.dir = 4;
        }
    }
}

//Red Ghost
function drawRedGhost(){
    if(shared.speedY < 0){
      image(redGhostArray[0],shared.red_px,shared.red_py,ghostSize,ghostSize);
    }

    else if(shared.speedY > 0){
       image(redGhostArray[3],shared.red_px,shared.red_py,ghostSize,ghostSize);
    }

    else if(shared.speedX < 0){
       image(redGhostArray[0],shared.red_px,shared.red_py,ghostSize,ghostSize);
    }

    else if(shared.speedX > 0){
        image(redGhostArray[2],shared.red_px,shared.red_py,ghostSize,ghostSize);
    }

    else{
        //up
        if(shared.red_dir == 1){
           image(redGhostArray[3],shared.red_px,shared.red_py,ghostSize,ghostSize);
        }
        //down
        else if(shared.red_dir == 2){
           image(redGhostArray[4],shared.red_px,shared.red_py,ghostSize,ghostSize);
        }
        //left
        else if(shared.red_dir == 3){
           image(redGhostArray[1],shared.red_px,shared.red_py,ghostSize,ghostSize);
        }
        //right
        else if(shared.red_dir == 4){
           image(redGhostArray[2],shared.red_px,shared.red_py,ghostSize,ghostSize);
        }
        else if (shared.red_dir == 0){
            image(redGhostArray[0],shared.red_px,shared.red_py,ghostSize,ghostSize);
        }
    }
}

function redGhostControls(){
    shared.red_px += shared.red_vx;
    shared.red_py += shared.red_vy;
    shared.red_vx = 0;
    shared.red_vy = 0;
    //have to speed instead of speedX & speedY

    // if(my.sharedTeam == "Red Ghost"){
        //w - up
        if(keyIsDown(87)){
            shared.red_vx = 0;
            shared.red_vy = -shared.vel * shared.speed;
            shared.red_dir = 1;
        }
        //s - down
        if(keyIsDown(83)){
            shared.red_vx = 0;
            shared.red_vy = shared.vel * shared.speed;
            shared.red_dir = 2;
        }
        //a - left
        if(keyIsDown(65)){
            shared.red_vx = -shared.vel * shared.speed;
            shared.red_vy = 0;
            shared.red_dir = 3;
        }
        //d - right
        if(keyIsDown(68)){
            shared.red_vx = shared.vel * shared.speed;
            shared.red_vy = 0;
            shared.red_dir = 4;
        }
        //set ghost back to static if the player isn't moving
        // else if(!keyIsDown(87) || !keyIsDown(83) || !keyIsDown(65) || !keyIsDown(68)){
        //     shared.red_vx = 0;
        //     shared.red_vy = 0;
        //     shared.red_dir = 0;
        // }
    // }
}

//Blue Ghost
function drawBlueGhost(){
    if(shared.speedY < 0){
      image(blueGhostArray[0],shared.blue_px,shared.blue_py,ghostSize,ghostSize);
    }

    else if(shared.speedY > 0){
       image(blueGhostArray[2],shared.blue_px,shared.blue_py,ghostSize,ghostSize);
    }

    else if(shared.speedX < 0){
       image(blueGhostArray[0],shared.blue_px,shared.blue_py,ghostSize,ghostSize);
    }

    else if(shared.speedX > 0){
        image(blueGhostArray[2],shared.blue_px,shared.blue_py,ghostSize,ghostSize);
    }

    else{
        //up
        if(shared.blue_dir == 1){
           image(blueGhostArray[3],shared.blue_px,shared.blue_py,ghostSize,ghostSize);
        }
        //down
        else if(shared.blue_dir == 2){
           image(blueGhostArray[4],shared.blue_px,shared.blue_py,ghostSize,ghostSize);
        }
        //left
        else if(shared.blue_dir == 3){
           image(blueGhostArray[1],shared.blue_px,shared.blue_py,ghostSize,ghostSize);
        }
        //right
        else if(shared.blue_dir == 4){
           image(blueGhostArray[2],shared.blue_px,shared.blue_py,ghostSize,ghostSize);
        }
        else{
            image(blueGhostArray[0],shared.blue_px,shared.blue_py,ghostSize,ghostSize);
        }
    }
}

function blueGhostControls(){
    shared.blue_px += shared.blue_vx;
    shared.blue_py += shared.blue_vy;
    shared.blue_vx = 0;
    shared.blue_vy = 0;
    //have to speed instead of speedX & speedY

    // if(my.sharedTeam == "Blue Ghost"){
        //w
        if(keyIsDown(87)){
            shared.blue_vx = 0;
            shared.blue_vy = -shared.vel * shared.speed;
            shared.blue_dir = 1;
        }
        //s
        if(keyIsDown(83)){
            shared.blue_vx = 0;
            shared.blue_vy = shared.vel * shared.speed;
            shared.blue_dir = 2;
        }
        //a
        if(keyIsDown(65)){
            shared.blue_vx = -shared.vel * shared.speed;
            shared.blue_vy = 0;
            shared.blue_dir = 3;
        }
        //d
        if(keyIsDown(68)){
            shared.blue_vx = shared.vel * shared.speed;
            shared.blue_vy = 0;
            shared.blue_dir = 4;
        }
    // }
}

//Green Ghost
function drawGreenGhost(){
    if(shared.speedY < 0){
      image(greenGhostArray[0],shared.green_px,shared.green_py,ghostSize,ghostSize);
    }

    else if(shared.speedY > 0){
       image(greenGhostArray[0],shared.green_px,shared.green_py,ghostSize,ghostSize);
    }

    else if(shared.speedX < 0){
       image(greenGhostArray[0],shared.green_px,shared.green_py,ghostSize,ghostSize);
    }

    else if(shared.speedX > 0){
        image(greenGhostArray[0],shared.green_px,shared.green_py,ghostSize,ghostSize);
    }

    else{
        //up
        if(shared.green_dir == 1){
           image(greenGhostArray[3],shared.green_px,shared.green_py,ghostSize,ghostSize);
        }
        //down
        else if(shared.green_dir == 2){
           image(greenGhostArray[4],shared.green_px,shared.green_py,ghostSize,ghostSize);
        }
        //left
        else if(shared.green_dir == 3){
           image(greenGhostArray[1],shared.green_px,shared.green_py,ghostSize,ghostSize);
        }
        //right
        else if(shared.green_dir == 4){
           image(greenGhostArray[2],shared.green_px,shared.green_py,ghostSize,ghostSize);
        }
        else{
            image(greenGhostArray[0],shared.green_px,shared.green_py,ghostSize,ghostSize);
        }
    }
}

function greenGhostControls(){
    shared.green_px += shared.green_vx;
    shared.green_py += shared.green_vy;
    shared.green_vx = 0;
    shared.green_vy = 0;
    //have to speed instead of speedX & speedY

    // if(my.sharedTeam == "Green Ghost"){
        //w
        if(keyIsDown(87)){
            shared.green_vx = 0;
            shared.green_vy = -shared.vel * shared.speed;
            shared.green_dir = 1;
        }
        //s
        if(keyIsDown(83)){
            shared.green_vx = 0;
            shared.green_vy = shared.vel * shared.speed;
            shared.green_dir = 2;
        }
        //a
        if(keyIsDown(65)){
            shared.green_vx = -shared.vel * shared.speed;
            shared.green_vy = 0;
            shared.green_dir = 3;
        }
        //d
        if(keyIsDown(68)){
            shared.green_vx = shared.vel * shared.speed;
            shared.green_vy = 0;
            shared.green_dir = 4;
        }
    // }
}

//Purple Ghost
function drawPurpleGhost(){
    if(shared.speedY < 0){
      image(purpleGhostArray[0],shared.purple_px,shared.purple_py,ghostSize,ghostSize);
    }

    else if(shared.speedY > 0){
       image(purpleGhostArray[2],shared.purple_px,shared.purple_py,ghostSize,ghostSize);
    }

    else if(shared.speedX < 0){
       image(purpleGhostArray[0],shared.purple_px,shared.purple_py,ghostSize,ghostSize);
    }

    else if(shared.speedX > 0){
        image(purpleGhostArray[2],shared.purple_px,shared.purple_py,ghostSize,ghostSize);
    }

    else{
        //up
        if(shared.purple_dir == 1){
           image(purpleGhostArray[3],shared.purple_px,shared.purple_py,ghostSize,ghostSize);
        }
        //down
        else if(shared.purple_dir == 2){
           image(purpleGhostArray[4],shared.purple_px,shared.purple_py,ghostSize,ghostSize);
        }
        //left
        else if(shared.purple_dir == 3){
           image(purpleGhostArray[1],shared.purple_px,shared.purple_py,ghostSize,ghostSize);
        }
        //right
        else if(shared.purple_dir == 4){
           image(purpleGhostArray[2],shared.purple_px,shared.purple_py,ghostSize,ghostSize);
        }
        else{
            image(purpleGhostArray[0],shared.purple_px,shared.purple_py,ghostSize,ghostSize);
        }
    }
}

function purpleGhostControls(){
    shared.purple_px += shared.purple_vx;
    shared.purple_py += shared.purple_vy;
    shared.purple_vx = 0;
    shared.purple_vy = 0;
    //have to speed instead of speedX & speedY

    // if(my.sharedTeam == "Purple Ghost"){
        //w
        if(keyIsDown(87)){
            shared.purple_vx = 0;
            shared.purple_vy = -shared.vel * shared.speed;
            shared.purple_dir = 1;
        }
        //s
        if(keyIsDown(83)){
            shared.purple_vx = 0;
            shared.purple_vy = shared.vel * shared.speed;
            shared.purple_dir = 2;
        }
        //a
        if(keyIsDown(65)){
            shared.purple_vx = -shared.vel * shared.speed;
            shared.purple_vy = 0;
            shared.purple_dir = 3;
        }
        //d
        if(keyIsDown(68)){
            shared.purple_vx = shared.vel * shared.speed;
            shared.purple_vy = 0;
            shared.purple_dir = 4;
        }
    // }
}


function detectWall(){
/*make an array of the walls for collision detection and the eggs 
if pacman enters the wall - check
loop through walls and make sure he doesn't intersect with them
make sure the distance b/n pacman and the walls aren't 0*/

    for(let i = 0; i < createWalls.length; i++){
        // if(dist(shared.pacman,createWalls[i]) == 0){
        //    shared.pacman = -shared.px;
        //    shared.pacman = -shared.py;
        // }
        // else{
            
        // }
    }
}

function chaosMode(){

}