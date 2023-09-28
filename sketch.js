let my,shared,pacmanFont;
let marginVert,marginHori,col,row;
let obstacles, borders, ballCol,pacmanCol,redCol,blueCol,greenCol,purpleCol;
let chomping;
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
        "https://main--pacmanchaos.netlify.app",
        "Pacman_Chaos_Test10",
        "main1"
      );
    shared = partyLoadShared("globals");
    my = partyLoadMyShared();//object in participants array
    participants = partyLoadParticipantShareds();
    //sounds
   chomping = loadSound("assets/Sounds/pacman_chomp.wav");
    //images
    titleBackground = loadImage("assets/titleScreen.png");
    paused = loadImage("assets/PausedScreen.png");

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

    // setInterval(againstTheClock,900);

    //change colors - or make them random
    obstacles = color(50,0,200);
    borders = color(80,60,200);
    ballCol = color(255);
    pacmanCol = color(254,213,0);
    redCol = color(255,0,0);
    blueCol = color(0,0,255);
    greenCol = color(0,255,0);
    purpleCol = color(255,0,255);

    chomping.setVolume(0.015);
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
    /*using participants solves issues with players being able 
    to control the same player at once*/

    //pacman
    my.w = 60;
    my.h = 60;
    my.vx = 0;
    my.vy =  0;
    my.speed = 5;
    my.speedX = 0;
    my.speedY = 0;
    my.dir = 0;
    my.vel = 1;
    my.thetaOff = 0;
    my.theta = 0;
    my.playerMoving = false;

    //red
    my.rw = 60;
    my.rh = 60;
    my.rvx = 0;
    my.rvy =  0;
    my.rSpeed = 5;
    my.rSpeedX = 0;
    my.rSpeedY = 0;
    my.rDir = 0;
    my.rVel = 1;
    my.rThetaOff = 0;
    my.rTheta = 0;

    my.pacScore = 0;
    my.blinkyScore  = 0;
    my.inkyScore = 0;
    my.clydeScore = 0;
    my.pinkyScore = 0;
    my.countdown = 60;

    if(participants.length == 1){
      my.color = "yellow";
      my.px = centerX(6);
      my.py = centerX(7);
    }
    if(participants.length == 2){
      my.color = "red";
      my.rpx = ghostCenterX(5);
      my.rpy = ghostCenterY(4);
    }
    if(participants.length == 3){
        my.color = "blue";
        my.px = ghostCenterX(6);
        my.py = ghostCenterY(4);
    }
    if(participants.length == 4){
        my.color = "green";
        my.px = ghostCenterX(5);
        my.py = ghostCenterY(5);
    }
    if(participants.length == 5){
        my.color = "purple";
        my.px = ghostCenterX(6);
        my.py = ghostCenterY(5);
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

   buttonHighlight();
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
    fill(pacmanCol);
    if(scene == 0 && mouseX < 800 && mouseX > 350 && mouseY < 750 && mouseY > 700){
        text("Start Game",350,750);
    }
}

//timer
// function againstTheClock(){
//     if(scene == 2){
//       if(my.countdown > 0){
//         my.countdown--;
//       }
    
//       else if(my.countdown <= 0){
//         scene = 3;
//       }
//     }
//   }

function scoreBoard(){
    let scoreBoard = createDiv("Score Board");
    scoreBoard.id("scoreBoard");
    scoreBoard.position(1475,430);

    //pac-man
    let pacScoreText = createElement("h3", "Pac-man: " + my.pacScore);
    pacScoreText.parent(scoreBoard);

    //red ghost
    let blinkyScoreText = createElement("h3","Blinky: " + my.blinkyScore);
    blinkyScoreText.parent(scoreBoard);

    //blue ghost
    let inkyScoreText = createElement("h3", "Inky: " + my.inkyScore);
    inkyScoreText.parent(scoreBoard);

    //green ghost
    let clydeScoreText = createElement("h3","Clyde: " + my.clydeScore);
    clydeScoreText.parent(scoreBoard);

    //purple ghost
    let winkyScoreText = createElement("h3","Pinky: " + my.pinkyScore);
    winkyScoreText.parent(scoreBoard);
}

function game(){
    background(0);
    maze();
    // tokens();
    drawPlayers();
    controls();
    if(my.countdown <= 10){
        fill(255,0,0);
        text("Time: " + my.countdown,50,50);
      }
      else{
        fill(0);
        text("Time: " + my.countdown,50,50);
      }
    // if(shared.gameState === "PLAYING"){
    //     game();
    // }
    // else{
    //     gameOver();
    // }

    // if(partyIsHost()){
        collisionDetection();
        // detectWalls();
    // }
}

function gameOver(){
    background(220);
    fill(255,0,0);
    textSize(40);
    textAlign(CENTER);
    text("Game Over!", 300,300);

    if(my.pacScore > my.blinkyScore || my.pacScore > my.inkyScore || my.pacScore > my.clydeScore || my.pacScore > my.pinkyScore){
        text("Pacman wins! ", 300, 500);
        text("The ghosts lose!", 300,700);
    }

    if(my.pacScore < my.blinkyScore || my.pacScore < my.inkyScore || my.pacScore < my.clydeScore || my.pacScore < my.pinkyScore){
        text("Pacman loses! ", 300, 500);
        text("The ghosts win!", 300,700);
    }

    if(my.pacScore == my.blinkyScore || my.pacScore == my.inkyScore || my.pacScore == my.clydeScore || my.pacScore == my.pinkyScore){
        text("It's a tie! ", 300, 500);
        // text("The ghosts win!", width/2,700);
    }

    if(partyIsHost()){
        text("Press R to restart",300,800);
        shared.hostRestart = false;

        if(keyCode == 82){
            shared.hostRestart = true;
            shared.hostStart = false;
            scene = 1;
        }
    }
    else if(!partyIsHost()){
        text("Wait for the host to restart",300, 800);
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
            //try p1.px < p2.px
            if(p1.px > p2.px){
                my.pacScore++;
            }
            if(p2.color == "red" ){
                my.blinkyScore++;
            }

            if(p2.color == "blue" ){
               my.inkyScore++; 
            }

            if( p2.color == "green" ){
                my.clydeScore++;
            }

            if(p2.color == "purple" ){
                my.pinkyScore++;
            }

            // else if(my.playerMoving == false){
            //     my.pacScore = 0;
            //     my.blinkyScore = 0;
            //     my.inkyScore = 0;
            //     my.clydeScore = 0;
            //     my.pinkyScore = 0;
            // }
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
            if(dist(cx,cy,createWalls[i][0],createWalls[i][1]) > 10){
                if(cx >= createWalls[i][0]){
                    fill(ballCol);
                    ellipse(cx,cy,25,25);
                }
                eggs.push([cx,cy]);
            }
          }
       }
    }
//   console.log(eggs);
}

function detectWalls(){
    for(let i = 0; i < createWalls.length; i++){
       // console.log(createWalls[2][2]);//90
       for(const p of participants){
           //top right wall get coordinates of individual walls
           if(dist(p.px,p.py,createWalls[i][0],createWalls[i][2]) < 25){
             if(p.px > 635 && p.px < 810 && p.py > 60 && p.py < 200){
               console.log("X: " + p.px, "Y: " + p.py);
               p.vx = -1;
               p.vy = -1;
             }
           }
        // if(p.py < createWalls[i][0] || p.py > height - createWalls[i][3]){
        //     if(p.px > createWalls[i][0] && p.px < createWalls[i][3] + width){
        //         p.vx = -1;
        //         p.vy = -1;
        //         console.log("X: " + p.px, "Y: " + p.py);
        //         // hightlight = true;
        //         // return true;
        //     }
        // }
       }
    }
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
        if(p.color == "yellow"){
            p.theta = PI / 3 * sq(sin(p.thetaOff));//chomping
            p.thetaOff += 0.1;
            //stationary
            if(p.dir == 0){
                arc(p.px,p.py,p.w,p.h,p.theta,-p.theta);
                //eyes
                fill(0);
                ellipse(p.px,p.py-12,10,10);
            }

            //up
            if(p.dir == 1){
                arc(p.px,p.py,p.w,p.h,-p.theta - PI / 6, p.theta + 7 * PI / 6);
                fill(0);
                ellipse(p.px - 12, p.py,10,10);
            }

            //down
            if(p.dir == 2){
                arc(p.px,p.py,pacSize,pacSize,-7 * PI / 6 - p.theta, p.theta + PI / 6);
                //eyes
                fill(0);
                ellipse(p.px+12,p.py,10,10); 
            }

            //left
            if(p.dir == 3){
                arc(p.px,p.py,pacSize,pacSize,p.theta + PI, -p.theta + PI);
                //eyes
                fill(0);
                ellipse(p.px,p.py-12, 10,10);
            }

            //right
            if(p.dir == 4){
                arc(p.px,p.py,pacSize,pacSize,p.theta,-p.theta);
                //eyes
                fill(0);
                ellipse(p.px,p.py-12,10,10);  
            }
       }

       else{
           if(p.dir == 0){
                ellipse(p.px,p.py,p.w,p.h);
                //eyeball
                fill(255);
                ellipse(p.px - 8, p.py - 2, 10, 10);
                ellipse(p.px + 8, p.py - 2, 10, 10);

                //iris
                fill(p.color);
                ellipse(p.px - 8, p.py - 2, 6, 6);
                ellipse(p.px + 8, p.py - 2, 6, 6);

                //pupil
                fill(0);
                ellipse(p.px - 8, p.py - 2, 4, 4);
                ellipse(p.px + 8, p.py - 2, 4, 4);
           }
    //        //up
           if(p.dir == 1){
                ellipse(p.px,p.py,p.w,p.h);
                //eyeball
                fill(255);
                ellipse(p.px - 8, p.py - 2, 10, 10);
                ellipse(p.px + 8, p.py - 2, 10, 10);

                //iris
                fill(p.color);
                ellipse(p.px - 8, p.py - 6, 6, 6);
                ellipse(p.px + 8, p.py - 6, 6, 6);

                //pupil
                fill(0);
                ellipse(p.px - 8, p.py - 6, 4, 4);
                ellipse(p.px + 8, p.py - 6, 4, 4);
            }
    //        //down
           if(p.dir == 2){
                ellipse(p.px,p.py,p.w,p.h);
                //eyeball
                fill(255);
                ellipse(p.px - 8, p.py - 2, 10, 10);
                ellipse(p.px + 8, p.py - 2, 10, 10);

                //iris
                fill(p.color);
                ellipse(p.px - 8, p.py + 2, 6, 6);
                ellipse(p.px + 8, p.py + 2, 6, 6);

                //pupil
                fill(0);
                ellipse(p.px - 8, p.py + 2, 4, 4);
                ellipse(p.px + 8, p.py + 2, 4, 4);
            }
    //         //left
            if(p.dir == 3){
                ellipse(p.px,p.py,p.w,p.h);
                //eyeball
                fill(255);
                ellipse(p.px - 8, p.py - 2, 10, 10);
                ellipse(p.px + 8, p.py - 2, 10, 10);

                //iris
                fill(p.color);
                ellipse(p.px - 10, p.py - 2, 6, 6);
                ellipse(p.px + 6, p.py - 2, 6, 6);

                //pupil
                fill(0);
                ellipse(p.px - 10, p.py - 2, 4, 4);
                ellipse(p.px + 6, p.py - 2, 4, 4);
           }

    //        //right
           if(p.dir == 4){
                ellipse(p.px,p.py,p.w,p.h);
                //eyeball
                fill(255);
                ellipse(p.px - 8, p.py - 2, 10, 10);
                ellipse(p.px + 8, p.py - 2, 10, 10);

                //iris
                fill(p.color);
                ellipse(p.px - 6, p.py - 2, 6, 6);
                ellipse(p.px + 10, p.py - 2, 6, 6);

                //pupil
                fill(0);
                ellipse(p.px - 6, p.py - 2, 4, 4);
                ellipse(p.px + 10, p.py - 2, 4, 4);
           }
    //        //set eyes to static
           else{
               p.dir = 0;
           }
       }
        // image(p.sprite,p.px,p.py,50,50);
        // console.log(p.sprite);
    }
}

function controls(){
    //left wall
    if(my.vx < 0 && my.px > 50){
        my.px += my.vx;
    }

    //my.px = (my.px + width) % width; //for exits
    
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
    if(keyIsDown(UP_ARROW) || keyIsDown(87)){
            my.vx = 0;
            my.vy = -my.vel * my.speed;
            my.dir = 1;
      if(my.color == "yellow"){
        //   chomping.play();
      }
    }
    //down arrow or S
    if(keyIsDown(DOWN_ARROW) || keyIsDown(83)){
            my.vx = 0;
            my.vy = my.vel * my.speed;
            my.dir = 2;
        if(my.color == "yellow"){
            // chomping.play();
        }
    }
    //left arrow & A
    if(keyIsDown(LEFT_ARROW) || keyIsDown(65)){
            my.vx = -my.vel * my.speed;
            my.vy = 0;
            my.dir = 3;
        if(my.color == "yellow"){
            // chomping.play();
        }
    }
    //right arrow or D
    if(keyIsDown(RIGHT_ARROW) || keyIsDown(68)){
            my.vx = my.vel * my.speed;
            my.vy = 0;
            my.dir = 4;
        if(my.color == "yellow"){
            // chomping.play();
        }
    }
}

function chaosMode(){

}