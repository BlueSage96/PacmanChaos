let my,shared,pacmanFont;
let marginVert,marginHori,col,row;
let obstacles, borders, ballCol;
let path = [];
let scene = 0;
let size = 100;
let spacing = 2;

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

     //Font
     pacmanFont = loadFont("assets/crackman.TTF");
}

function setup(){
    let mainCanvas = createCanvas(1400,1000);
    mainCanvas.parent("canvasdiv");
    let frameCount = frameRate(60);
    textFont(pacmanFont);
    col = width / size;
    row = height / size;
    marginVert = (width - col * size) / 2;
    marginHori = (height - row * size) / 2;
    //change colors - or make them random
    obstacles = color(50,0,200);
    borders = color(80,60,200);
    ballCol = color(255);

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
    background(1);
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
 maze();
 tokens();
    // pacmanControls();
    // ghostControls();
    // chaosMode();
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

function walls(x,y,numC,numR){
    let x0, y0, large, comp;
    x0 = marginHori + (x - 1) * size;
    y0 = marginVert + (y - 1) * size;
    large = numC * size;
    comp = numR * size;
    fill(50,0,200);
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
       path[j][i] = 2;//fix - draws a over the maze
       if(path[j][i] == 2){
            fill(ballCol);
            ellipse(cx,cy,25,25);
       }
    }
  }
}

function pacmanControls(){

}

function ghostControls(){

}

function centerX(col){
    return marginHori + (col - 0.5) * size;
}

function centerY(nLin){
    return marginVert + (nLin - 0.5) * size;
}

function chaosMode(){

}