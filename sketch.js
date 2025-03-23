let my, shared, participants, pacmanFont;
let marginVert, marginHori, col, row;
let obstacles,
  borders,
  ballCol,
  pacmanCol,
  redCol,
  blueCol,
  greenCol,
  purpleCol;
let chomping;
let path = [];
let wasHere = [];
let createWalls = [];
let eggs = [];

let scene = 0;
let size = 50;
let pacSize = 30;
let ghostSize = 30;
let spacing = 2;

let isPaused = false;
let hightlight = false;
let pacman, instructions, link;
let titleBackground, paused;

let x = 10;
let y = 300;

// Add these global variables at the top of your sketch.js file
let leftExitArea = {x: 0, y: 0, width: 0, height: 0};
let rightExitArea = {x: 0, y: 0, width: 0, height: 0};

let redGhostArray = [];
let blueGhostArray = [];
let greenGhostArray = [];
let purpleGhostArray = [];

function preload() {
  partyConnect(
    //"wss://deepstream-server-1.herokuapp.com",
    // "http://localhost:8080/",
    "wss://demoserver.p5party.org",
    "Pacman_Chaos_Debug",
    "main1"
  );
  shared = partyLoadShared("globals");
  my = partyLoadMyShared(); //object in participants array
  participants = partyLoadParticipantShareds();

  //sounds
  chomping = loadSound("assets/Sounds/pacman_chomp.wav");
  //images
  titleBackground = loadImage("assets/titleScreen.png");
  paused = loadImage("assets/PausedScreen.png");

  //Font
  pacmanFont = loadFont("assets/crackman.TTF");
}

function setup() {
  let mainCanvas = createCanvas(1100, 900);
  mainCanvas.parent("canvasdiv");
  let frameCount = frameRate(60);
  // angleMode(RADIANS);
  textFont(pacmanFont);
  col = width / size;
  row = height / size;

  marginVert = Math.floor((width - col * size) / 2);
  marginHori = Math.floor((height - row * size) / 2);

  // setInterval(againstTheClock,900);

  //change colors - or make them random
  obstacles = color(50, 0, 200);
  borders = color(80, 60, 200);
  ballCol = color(255);
  pacmanCol = color(254, 213, 0);
  redCol = color(255, 0, 0);
  blueCol = color(0, 0, 255);
  greenCol = color(0, 255, 0);
  purpleCol = color(255, 0, 255);

  chomping.setVolume(0.05);
  link = createA("instructions.html", "");

  instructions = createImg("assets/icon.png", "instructions.html").parent(link);
  instructions.position(1350, 50);
  instructions.size(60, 60);
  //toggle server info
  partyToggleInfo(false);
  toggle = document.getElementById("toggle");

  if (partyIsHost()) {
    partySetShared(shared, {
      player: 0,
      gameState: "PLAYING",
      hostStart: false,
      hostRestart: false,
      role: "Observer",
    });
  }
  /*using participants solves issues with players being able 
    to control the same player at once*/

  //pacman
  // my.w = 60;
  // my.h = 60;
  // my.vx = 0;
  // my.vy = 0;
  // my.speed = 5;
  // my.speedX = 0;
  // my.speedY = 0;
  // my.dir = 0;
  // my.vel = 1;
  // my.thetaOff = 0;
  // my.theta = 0;
  // my.playerMoving = false;

  // //red
  // my.rw = 60;
  // my.rh = 60;
  // my.rvx = 0;
  // my.rvy = 0;
  // my.rSpeed = 5;
  // my.rSpeedX = 0;
  // my.rSpeedY = 0;
  // my.rDir = 0;
  // my.rVel = 1;
  // my.rThetaOff = 0;
  // my.rTheta = 0;

  // my.pacScore = 0;
  // my.blinkyScore = 0;
  // my.inkyScore = 0;
  // my.clydeScore = 0;
  // my.pinkyScore = 0;
  // my.countdown = 60;

  // if (participants.length == 1) {
  //   my.color = "yellow";
  //   my.px = centerX(6);
  //   my.py = centerX(7);
  // }
  // if (participants.length == 2) {
  //   my.color = "red";
  //   my.rpx = ghostCenterX(5);
  //   my.rpy = ghostCenterY(4);
  // }
  // if (participants.length == 3) {
  //   my.color = "blue";
  //   my.px = ghostCenterX(6);
  //   my.py = ghostCenterY(4);
  // }
  // if (participants.length == 4) {
  //   my.color = "green";
  //   my.px = ghostCenterX(5);
  //   my.py = ghostCenterY(5);
  // }
  // if (participants.length == 5) {
  //   my.color = "purple";
  //   my.px = ghostCenterX(6);
  //   my.py = ghostCenterY(5);
  // } else {
  //   shared.role = "observer";
  // }

    // Set consistent player sizes
  my.w = pacSize;
  my.h = pacSize;
  my.vx = 0;
  my.vy = 0;
  my.speed = 4; // Slightly slower for better control in the smaller maze
  my.dir = 0;
  my.vel = 1;
  my.thetaOff = 0;
  my.theta = 0;
  my.playerMoving = false;

  // Ghost sizes
  my.rw = ghostSize;
  my.rh = ghostSize;
  my.rvx = 0;
  my.rvy = 0;
  my.rSpeed = 4;
  my.rDir = 0;

  my.pacScore = 0;
  my.blinkyScore = 0;
  my.inkyScore = 0;
  my.clydeScore = 0;
  my.pinkyScore = 0;
  my.countdown = 60;

  // Assign different colors and starting positions based on participant number
  if (participants.length == 1) {
    my.color = "yellow"; // Pac-Man (Player 1)
    my.px = centerX(6);
    my.py = centerX(7);
  }
  else if (participants.length == 2) {
    my.color = "red"; // Blinky (Player 2)
    my.px = ghostCenterX(5);
    my.py = ghostCenterY(4);
  }
  else if (participants.length == 3) {
    my.color = "blue"; // Inky (Player 3)
    my.px = ghostCenterX(6);
    my.py = ghostCenterY(4);
  }
  else if (participants.length == 4) {
    my.color = "green"; // Clyde (Player 4)
    my.px = ghostCenterX(5);
    my.py = ghostCenterY(5);
  }
  else if (participants.length == 5) {
    my.color = "purple"; // Pinky (Player 5)
    my.px = ghostCenterX(6);
    my.py = ghostCenterY(5);
  } else {
    shared.role = "observer";
  }
  //initialize exits array
  exits = [];

  //generate pellets
  pellets = [];
  generatePellets();
}

function draw() {
  background(1);
  instructions.hide();
//   scoreBoard();
  switch (scene) {
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

function mousePressed() {
  if (
    scene == 0 &&
    mouseX < 800 &&
    mouseX > 350 &&
    mouseY < 750 &&
    mouseY > 700
  ) {
    scene = 1;
  }

  //exit or quit
}

function startScreen() {
  image(titleBackground, 0, 0, 1100, 1000);
  textSize(90);
  fill(255);
  text("Pac-man: Chaos", 100, 200);
  textSize(60);

  if (frameCount % 60 < 30) {
    text("Start Game", 350, 750);
  }

  buttonHighlight();
}

function waitForHost() {
  textSize(40);
  fill(255);
  if (partyIsHost()) {
    text("You're the host" + "\n" + "Press ENTER to start", 300, 300);
    if (keyCode == 13) {
      shared.hostStart = true;
      scene = 2;
    }
  } else if (!partyIsHost()) {
    text("Waiting for the host", 300, 300);
    if (shared.hostStart == true) {
      scene = 2;
    }
  }
}

function buttonHighlight() {
  fill(pacmanCol);
  if (
    scene == 0 &&
    mouseX < 800 &&
    mouseX > 350 &&
    mouseY < 750 &&
    mouseY > 700
  ) {
    text("Start Game", 350, 750);
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

function scoreBoard() {
  let scoreBoard = createDiv("Score Board");
  scoreBoard.id("scoreBoard");
  scoreBoard.position(1475, 430);

  //pac-man
  let pacScoreText = createElement("h3", "Pac-man: " + my.pacScore);
  pacScoreText.parent(scoreBoard);

  //red ghost
  let blinkyScoreText = createElement("h3", "Blinky: " + my.blinkyScore);
  blinkyScoreText.parent(scoreBoard);

  //blue ghost
  let inkyScoreText = createElement("h3", "Inky: " + my.inkyScore);
  inkyScoreText.parent(scoreBoard);

  //green ghost
  let clydeScoreText = createElement("h3", "Clyde: " + my.clydeScore);
  clydeScoreText.parent(scoreBoard);

  //purple ghost
  let winkyScoreText = createElement("h3", "Pinky: " + my.pinkyScore);
  winkyScoreText.parent(scoreBoard);
}

// Updated game function to incorporate new maze and pellets
function game() {
  background(0);
  
  // Draw the maze
  maze();
  
  // Draw and handle pellets
  tokens();
  
  // Handle player movement
  controls();
  
  // Draw players
  drawPlayers();
  
  // Display countdown
  if (my.countdown <= 10) {
    fill(255, 0, 0);
  } else {
    fill(255);
  }
  textSize(24);
  text("Time: " + my.countdown, 50, 30);
  
  // Display score
  text("Score: " + my.pacScore, width - 200, 30);
  
  // Handle player interactions
  collisionDetection();
}

function gameOver() {
  background(220);
  fill(255, 0, 0);
  textSize(40);
  textAlign(CENTER);
  text("Game Over!", 300, 300);

  if (
    my.pacScore > my.blinkyScore ||
    my.pacScore > my.inkyScore ||
    my.pacScore > my.clydeScore ||
    my.pacScore > my.pinkyScore
  ) {
    text("Pacman wins! ", 300, 500);
    text("The ghosts lose!", 300, 700);
  }

  if (
    my.pacScore < my.blinkyScore ||
    my.pacScore < my.inkyScore ||
    my.pacScore < my.clydeScore ||
    my.pacScore < my.pinkyScore
  ) {
    text("Pacman loses! ", 300, 500);
    text("The ghosts win!", 300, 700);
  }

  if (
    my.pacScore == my.blinkyScore ||
    my.pacScore == my.inkyScore ||
    my.pacScore == my.clydeScore ||
    my.pacScore == my.pinkyScore
  ) {
    text("It's a tie! ", 300, 500);
    // text("The ghosts win!", width/2,700);
  }

  if (partyIsHost()) {
    text("Press R to restart", 300, 800);
    shared.hostRestart = false;

    if (keyCode == 82) {
      shared.hostRestart = true;
      shared.hostStart = false;
      scene = 1;
    }
  } else if (!partyIsHost()) {
    text("Wait for the host to restart", 300, 800);
    if (shared.hostRestart == true) {
      scene = 1;
    }
  }
}

function pause() {
  background(paused);
  textSize(60);
  text("PAUSED", 300, 300);
}

function death() {}

function victory() {}

function collisionDetection() {
  //players
  for (const p1 of participants) {
    for (const p2 of participants) {
      if (p1 === p2) continue;
      if (dist(p1.px, p1.py, p2.px, p2.py) < 20) {
        //try p1.px < p2.px
        if (p1.px > p2.px) {
          my.pacScore++;
        }
        if (p2.color == "red") {
          my.blinkyScore++;
        }

        if (p2.color == "blue") {
          my.inkyScore++;
        }

        if (p2.color == "green") {
          my.clydeScore++;
        }

        if (p2.color == "purple") {
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

// Solution to fix invisible barriers at Pac-Man exits

// FUNCTION 1: Modified maze() function to create clear exit paths
// function maze() {
//   //boundaries
//   fill(0);
//   stroke(borders);
//   strokeWeight(spacing * 3);

//   //outer boundaries (except the exit paths)
//   rect(marginHori + 20, marginVert + 15, 1050, 870); //recalculate
//   fill(0);
//   noStroke();

//   // Define exit dimensions - make them VERY wide and tall
//   let exitWidth = 100;
//   let exitHeight = 200;
//   let exitY = centerY(6) - exitHeight/2;
  
//   // Create exit paths by drawing black rectangles over the borders
//   fill(0);
//   noStroke();
//   rect(0, exitY, exitWidth, exitHeight); // Left exit
//   rect(width - exitWidth, exitY, exitWidth, exitHeight); // Right exit
  
//   // Draw border lines around exits to maintain visual consistency
//   stroke(borders);
//   strokeWeight(spacing * 3);
//   line(0, exitY, exitWidth, exitY); // Top line of left exit
//   line(0, exitY + exitHeight, exitWidth, exitY + exitHeight); // Bottom line of left exit
//   line(width - exitWidth, exitY, width, exitY); // Top line of right exit
//   line(width - exitWidth, exitY + exitHeight, width, exitY + exitHeight); // Bottom line of right exit
  
//   // Store exit areas for collision detection
//   if (typeof window !== 'undefined') {
//     window.leftExit = {x: 0, y: exitY, width: exitWidth, height: exitHeight};
//     window.rightExit = {x: width - exitWidth, y: exitY, width: exitWidth, height: exitHeight};
//   }
  
//   createWalls = []; // Reset walls array
  
//   noStroke();
//   //top left
//   walls(2, 2, 1, 2);
//   walls(2, 2, 2, 1);
//   //bottom left
//   walls(2, 7, 1, 2);
//   walls(2, 7, 1, 1);
//   walls(2, 8, 2, 1);
//   walls(4, 8, 1, 2);
//   //top right
//   walls(8, 2, 2, 1);
//   walls(10, 2, 1, 3);
//   //ghost cage
//   walls(4, 4, 1, 2);
//   walls(4, 6, 2, 1);
//   walls(5, 6, 2, 1);
//   walls(7, 4, 1, 3);
//   //bottom
//   walls(6, 10, 2, 0.75);
//   //bottom right
//   walls(10, 6, 1, 1);
//   walls(10, 7, 2, 1);
//   walls(8, 8, 2, 1);
//   walls(9, 8, 1, 2);
// }

// FUNCTION 2: Modified walls() function to prevent walls at exits
function walls(x, y, numC, numR) {
  let x0, y0, large, comp;
  x0 = marginHori + (x - 1) * size;
  y0 = marginVert + (y - 1) * size;
  large = numC * 90;
  comp = numR * 90;
  
  // Get exit dimensions (must match those in maze function)
  let exitWidth = 100;
  let exitHeight = 200;
  let exitY = centerY(6) - exitHeight/2;
  
  // Check if this wall would overlap with either exit
  let overlapsLeftExit = (x0 < exitWidth && 
                          !(y0 + comp < exitY || y0 > exitY + exitHeight));
  
  let overlapsRightExit = (x0 + large > width - exitWidth && 
                           !(y0 + comp < exitY || y0 > exitY + exitHeight));
  
  // Only create wall if it doesn't overlap with exits
  if (!overlapsLeftExit && !overlapsRightExit) {
    fill(obstacles);
    noStroke();
    rect(x0, y0, large, comp);
    createWalls.push([x0, y0, large, comp]);
  }
}



function keyPressed() {
  if (my.color === "yellow") {
    if (!chomping.isPlaying()) {
      chomping.loop(); // Play the chomping sound in a loop when a key is pressed
    }
  }
}

function keyReleased() {
  if (my.color === "yellow") {
    chomping.stop(); // Stop the sound when no key is pressed
  }
}

// Define a maze grid structure - 1 = wall, 0 = path
// This is a simplified version of the classic Pac-Man maze
function createClassicMazeTemplate() {
  // Grid size: 22 columns x 18 rows (adjust as needed to fit your canvas)
  return [
    // Row 0
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    // Row 1
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    // Row 2
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    // Row 3
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    // Row 4
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    // Row 5
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
    // Row 6
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    // Row 7
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    // Row 8
    [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0], // Left exit
    // Row 9
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
    // Row 10 - Ghost pen
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Right exit
    // Row 11
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
    // Row 12
    [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0], // Left exit
    // Row 13
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
    // Row 14
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    // Row 15
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    // Row 16
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    // Row 17
    [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
    // Row 18
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    // Row 19
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    // Row 20
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    // Row 21
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];
}

// Function to randomly modify the maze while keeping key features
function randomizeMaze(mazeTemplate) {
  let maze = JSON.parse(JSON.stringify(mazeTemplate)); // Deep copy
  
  // Keep 70% of the maze intact, modify 30% randomly
  // But preserve external walls, exits, and ghost pen
  for (let y = 1; y < maze.length - 1; y++) {
    for (let x = 1; x < maze[y].length - 1; x++) {
      // Skip ghost pen area (center of the maze)
      let isCenterArea = (x >= 8 && x <= 13 && y >= 8 && y <= 12);
      
      // Skip exit areas (rows 8, 10, 12)
      let isExitArea = (y === 8 || y === 10 || y === 12) && (x < 4 || x > 17);
      
      if (!isCenterArea && !isExitArea && Math.random() < 0.3) {
        // 30% chance to flip a cell (path to wall or wall to path)
        maze[y][x] = 1 - maze[y][x];
      }
    }
  }
  
  // Ensure maze has proper exit tunnels
  // Left exits
  for (let y of [8, 12]) {
    for (let x = 0; x < 4; x++) {
      maze[y][x] = 0;
    }
  }
  
  // Right exits
  for (let y of [10]) {
    for (let x = 18; x < 22; x++) {
      maze[y][x] = 0;
    }
  }
  
  return maze;
}

// New maze function that uses the grid template
function maze() {
  // Clear the background
  background(0);
  
  // Create or load the maze template and randomize it
  let mazeTemplate = createClassicMazeTemplate();
  
  // You can enable this for semi-random mazes inspired by the original
  // Or comment it out for a fixed classic layout
  // let mazeGrid = randomizeMaze(mazeTemplate);
  
  // For now, let's use the classic layout
  let mazeGrid = mazeTemplate;
  
  // Calculate cell size based on canvas dimensions and grid size
  let cellWidth = width / mazeGrid[0].length;
  let cellHeight = height / mazeGrid.length;
  
  // Clear createWalls array
  createWalls = [];
  
  // Define exit dimensions
  let exitWidth = cellWidth;
  let exitHeight = cellHeight;
  
  // Draw the maze
  fill(obstacles);
  stroke(borders);
  strokeWeight(spacing);
  
  for (let y = 0; y < mazeGrid.length; y++) {
    for (let x = 0; x < mazeGrid[y].length; x++) {
      if (mazeGrid[y][x] === 1) {
        // This is a wall cell
        let wx = x * cellWidth;
        let wy = y * cellHeight;
        
        // Draw the wall
        fill(obstacles);
        noStroke();
        rect(wx, wy, cellWidth, cellHeight);
        
        // Add to createWalls array for collision detection
        createWalls.push([wx, wy, cellWidth, cellHeight]);
      } else {
        // This is a path - optionally place dots/pellets here
        // For now, we're just leaving it empty
      }
    }
  }
  
  // Define exit areas for wrap-around
  // Left exit
  leftExitArea = {
    x: 0, 
    y: 8 * cellHeight, 
    width: cellWidth * 4, 
    height: cellHeight
  };
  
  // Right exit
  rightExitArea = {
    x: width - cellWidth * 4, 
    y: 10 * cellHeight, 
    width: cellWidth * 4, 
    height: cellHeight
  };
  
  // Bottom left exit
  bottomLeftExitArea = {
    x: 0, 
    y: 12 * cellHeight, 
    width: cellWidth * 4, 
    height: cellHeight
  };
  
  // Store all exits in an array
  exits = [leftExitArea, rightExitArea, bottomLeftExitArea];
  
  // Draw ghost pen (optionally add a gate)
  stroke(borders);
  fill(0); // Black interior
  rect(9 * cellWidth, 9 * cellHeight, 4 * cellWidth, 3 * cellHeight);
  
  // Draw exit tunnels - make sure they're clear
  noStroke();
  fill(0);
  rect(leftExitArea.x, leftExitArea.y, leftExitArea.width, leftExitArea.height);
  rect(rightExitArea.x, rightExitArea.y, rightExitArea.width, rightExitArea.height);
  rect(bottomLeftExitArea.x, bottomLeftExitArea.y, bottomLeftExitArea.width, bottomLeftExitArea.height);
}

// Improved collision detection and movement in the maze
// First, let's improve the controls function to handle smoother movement

function controls() {
  // Set velocities based on key presses
  my.vx = 0;
  my.vy = 0;
  
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    my.vy = -my.vel * my.speed;
    my.dir = 1;
  }
  else if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    my.vy = my.vel * my.speed;
    my.dir = 2;
  }
  else if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    my.vx = -my.vel * my.speed;
    my.dir = 3;
  }
  else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    my.vx = my.vel * my.speed;
    my.dir = 4;
  }
  
  // Check if player is in any exit area
  let inExitArea = false;
  for (let exit of exits) {
    if (my.px >= exit.x && my.px <= exit.x + exit.width && 
        my.py >= exit.y && my.py <= exit.y + exit.height) {
      inExitArea = true;
      break;
    }
  }
  
  if (inExitArea) {
    // In exit areas - allow unrestricted movement and handle wrap-around
    my.px += my.vx;
    my.py += my.vy;
    
    // Handle wrap-around
    if (my.px < -pacSize/2) my.px = width + pacSize/2;
    if (my.px > width + pacSize/2) my.px = -pacSize/2;
  } else {
    // Try moving in X direction first (with smaller steps)
    moveWithCollisionCheck(my.vx, 0);
    
    // Then try moving in Y direction
    moveWithCollisionCheck(0, my.vy);
  }
}

// New helper function to move with improved collision detection
function moveWithCollisionCheck(dx, dy) {
  if (dx === 0 && dy === 0) return; // No movement requested
  
  // Calculate next position
  let nextX = my.px + dx;
  let nextY = my.py + dy;
  
  // Get smaller hitbox for Pac-Man (70% of visual size)
  let hitboxSize = pacSize * 0.7; 
  
  // Check if the next position would cause a collision with any wall
  for (let wall of createWalls) {
    let [wx, wy, wWidth, wHeight] = wall;
    
    // Use a smaller hitbox for both Pac-Man and the walls
    if (nextX + hitboxSize/2 > wx + 2 && // Add small buffer to walls
        nextX - hitboxSize/2 < wx + wWidth - 2 && 
        nextY + hitboxSize/2 > wy + 2 && 
        nextY - hitboxSize/2 < wy + wHeight - 2) {
      
      // Collision detected, don't allow this movement
      return;
    }
  }
  
  // No collision, apply the movement
  my.px = nextX;
  my.py = nextY;
}

// Add this function to generate pellets/dots along the maze paths
function generatePellets() {
  let mazeGrid = createClassicMazeTemplate();
  let cellWidth = width / mazeGrid[0].length;
  let cellHeight = height / mazeGrid.length;
  
  // Clear pellets array if it exists
  pellets = [];
  
  for (let y = 0; y < mazeGrid.length; y++) {
    for (let x = 0; x < mazeGrid[y].length; x++) {
      if (mazeGrid[y][x] === 0) {
        // This is a path - place a pellet here
        let px = x * cellWidth + cellWidth/2;
        let py = y * cellHeight + cellHeight/2;
        
        // Skip ghost pen area
        let isGhostPen = (x >= 9 && x <= 12 && y >= 9 && y <= 11);
        
        if (!isGhostPen) {
          // Add to pellets array - [x, y, size, isEaten]
          // Make corner pellets larger (power pellets)
          let isPowerPellet = (
            (x === 1 && y === 1) || 
            (x === 20 && y === 1) || 
            (x === 1 && y === 20) || 
            (x === 20 && y === 20)
          );
          
          let pelletSize = isPowerPellet ? 10 : 4;
          pellets.push([px, py, pelletSize, false]);
        }
      }
    }
  }
}

// Function to draw pellets
function drawPellets() {
  fill(ballCol);
  noStroke();
  
  for (let pellet of pellets) {
    let [px, py, size, isEaten] = pellet;
    
    if (!isEaten) {
      ellipse(px, py, size, size);
    }
  }
}

// Update tokens function to use the new pellet system
function tokens() {
  drawPellets();
  
  // Check if Pac-Man eats any pellets
  if (my.color === "yellow") {
    for (let i = 0; i < pellets.length; i++) {
      let [px, py, size, isEaten] = pellets[i];
      
      if (!isEaten && dist(my.px, my.py, px, py) < pacSize/2) {
        // Pellet is eaten
        pellets[i][3] = true;
        
        // Play chomping sound
        if (!chomping.isPlaying()) {
          chomping.play();
        }
        
        // Update score (regular vs power pellet)
        if (size > 5) {
          my.pacScore += 50; // Power pellet
          // TODO: Make ghosts vulnerable
        } else {
          my.pacScore += 10; // Regular pellet
        }
      }
    }
  }
}



// FUNCTION 5: Add debug visualization to help see exit areas
function debugExits() {
  // Calculate exit dimensions
  let exitWidth = 100;
  let exitHeight = 200;
  let exitY = centerY(6) - exitHeight/2;
  
  // Draw exit areas with semi-transparent overlay
  noStroke();
  fill(0, 255, 0, 80);  // Semi-transparent green
  rect(0, exitY, exitWidth, exitHeight);  // Left exit
  rect(width - exitWidth, exitY, exitWidth, exitHeight);  // Right exit
  
  // Check if player is in exit areas
  let inLeftExit = my.py >= exitY && my.py <= exitY + exitHeight && my.px < exitWidth * 2;
  let inRightExit = my.py >= exitY && my.py <= exitY + exitHeight && my.px > width - (exitWidth * 2);
  
  // Debug text
  fill(255);
  textSize(16);
  text("In Left Exit: " + inLeftExit, 50, 20);
  text("In Right Exit: " + inRightExit, 200, 20);
  text("Position: " + Math.round(my.px) + ", " + Math.round(my.py), 400, 20);
}

// New function to handle exits and wrap-around
function handleExits() {
  // Check if we're in an exit area
  let inLeftExit = false;
  let inRightExit = false;
  
  for (let exit of exits) {
    // Check if player is in left exit
    if (exit.x === 0 && 
        my.px < exit.width * 2 && 
        my.py > exit.y && 
        my.py < exit.y + exit.height) {
      inLeftExit = true;
    }
    
    // Check if player is in right exit
    if (exit.x === width - 50 && 
        my.px > width - exit.width * 2 && 
        my.py > exit.y && 
        my.py < exit.y + exit.height) {
      inRightExit = true;
    }
  }
  
  // Handle wrap-around
  if (inLeftExit && my.vx < 0) {
    // If moving left through left exit
    if (my.px < -pacSize/2) {
      // Wrap to the right side
      my.px = width + pacSize/2;
    }
  }
  else if (inRightExit && my.vx > 0) {
    // If moving right through right exit
    if (my.px > width + pacSize/2) {
      // Wrap to the left side
      my.px = -pacSize/2;
    }
  }
}

// New function to handle wall collisions
function handleWallCollisions() {
  // Check if we're in an exit
  let inExit = false;
  
  for (let exit of exits) {
    if (my.px > exit.x && 
        my.px < exit.x + exit.width && 
        my.py > exit.y && 
        my.py < exit.y + exit.height) {
      inExit = true;
      break;
    }
  }
  
  // Skip collision detection if in an exit
  if (inExit) return;
  
  // Standard boundary checks (prevent going off-screen)
  if (my.vx < 0 && my.px < 50 && !inExit) {
    my.vx = 0;
  }
  if (my.vx > 0 && my.px > width - 50 && !inExit) {
    my.vx = 0;
  }
  if (my.vy < 0 && my.py < 50) {
    my.vy = 0;
  }
  if (my.vy > 0 && my.py > height - 50) {
    my.vy = 0;
  }
  
  // Check wall collisions
  for (let i = 0; i < createWalls.length; i++) {
    let [wx, wy, wWidth, wHeight] = createWalls[i];
    
    // Check if player would collide with this wall
    if (
      my.px + my.vx + my.w/2 > wx &&
      my.px + my.vx - my.w/2 < wx + wWidth &&
      my.py + my.vy + my.h/2 > wy &&
      my.py + my.vy - my.h/2 < wy + wHeight
    ) {
      // Stop movement in the direction of collision
      my.vx = 0;
      my.vy = 0;
    }
  }
}


function centerX(col) {
  return marginHori + (col - 0.5) * size;
}

function centerY(row) {
  return marginVert + (row - 0.5) * size;
}

function ghostCenterX(col) {
  return marginHori + (col - 0.75) * size;
}

function ghostCenterY(row) {
  return marginVert + (row - 0.75) * size;
}

// Update the drawPlayers function to make Pac-Man's size consistent in all directions

function drawPlayers() {
  for (const p of participants) {
    fill(p.color);
    if (p.color == "yellow") {
      p.theta = (PI / 3) * sq(sin(p.thetaOff)); //chomping
      p.thetaOff += 0.1;
      
      //stationary
      if (p.dir == 0) {
        arc(p.px, p.py, pacSize, pacSize, p.theta, -p.theta);
        //eyes
        fill(0);
        ellipse(p.px, p.py - pacSize/5, pacSize/6, pacSize/6);
      }

      //up
      if (p.dir == 1) {
        // Fixed: Use pacSize for both width and height
        arc(p.px, p.py, pacSize, pacSize, -p.theta - PI / 6, p.theta + (7 * PI) / 6);
        fill(0);
        ellipse(p.px - pacSize/5, p.py, pacSize/6, pacSize/6);
      }

      //down
      if (p.dir == 2) {
        arc(
          p.px,
          p.py,
          pacSize,
          pacSize,
          (-7 * PI) / 6 - p.theta,
          p.theta + PI / 6
        );
        //eyes
        fill(0);
        ellipse(p.px + pacSize/5, p.py, pacSize/6, pacSize/6);
      }

      //left
      if (p.dir == 3) {
        arc(p.px, p.py, pacSize, pacSize, p.theta + PI, -p.theta + PI);
        //eyes
        fill(0);
        ellipse(p.px, p.py - pacSize/5, pacSize/6, pacSize/6);
      }

      //right
      if (p.dir == 4) {
        arc(p.px, p.py, pacSize, pacSize, p.theta, -p.theta);
        //eyes
        fill(0);
        ellipse(p.px, p.py - pacSize/5, pacSize/6, pacSize/6);
      }
    } else {
      // Ghosts
      if (p.dir == 0) {
        // Draw ghost body
        ellipse(p.px, p.py, ghostSize, ghostSize);
        
        // Smaller, proportional eyes based on ghostSize
        //eyeball
        fill(255);
        ellipse(p.px - ghostSize/6, p.py - ghostSize/25, ghostSize/6, ghostSize/6);
        ellipse(p.px + ghostSize/6, p.py - ghostSize/25, ghostSize/6, ghostSize/6);

        //iris
        fill(p.color);
        ellipse(p.px - ghostSize/6, p.py - ghostSize/25, ghostSize/10, ghostSize/10);
        ellipse(p.px + ghostSize/6, p.py - ghostSize/25, ghostSize/10, ghostSize/10);

        //pupil
        fill(0);
        ellipse(p.px - ghostSize/6, p.py - ghostSize/25, ghostSize/15, ghostSize/15);
        ellipse(p.px + ghostSize/6, p.py - ghostSize/25, ghostSize/15, ghostSize/15);
      }
      
      //up
      if (p.dir == 1) {
        ellipse(p.px, p.py, ghostSize, ghostSize);
        //eyeball
        fill(255);
        ellipse(p.px - ghostSize/6, p.py - ghostSize/25, ghostSize/6, ghostSize/6);
        ellipse(p.px + ghostSize/6, p.py - ghostSize/25, ghostSize/6, ghostSize/6);

        //iris - look up
        fill(p.color);
        ellipse(p.px - ghostSize/6, p.py - ghostSize/8, ghostSize/10, ghostSize/10);
        ellipse(p.px + ghostSize/6, p.py - ghostSize/8, ghostSize/10, ghostSize/10);

        //pupil
        fill(0);
        ellipse(p.px - ghostSize/6, p.py - ghostSize/8, ghostSize/15, ghostSize/15);
        ellipse(p.px + ghostSize/6, p.py - ghostSize/8, ghostSize/15, ghostSize/15);
      }
      
      //down
      if (p.dir == 2) {
        ellipse(p.px, p.py, ghostSize, ghostSize);
        //eyeball
        fill(255);
        ellipse(p.px - ghostSize/6, p.py - ghostSize/25, ghostSize/6, ghostSize/6);
        ellipse(p.px + ghostSize/6, p.py - ghostSize/25, ghostSize/6, ghostSize/6);

        //iris - look down
        fill(p.color);
        ellipse(p.px - ghostSize/6, p.py + ghostSize/15, ghostSize/10, ghostSize/10);
        ellipse(p.px + ghostSize/6, p.py + ghostSize/15, ghostSize/10, ghostSize/10);

        //pupil
        fill(0);
        ellipse(p.px - ghostSize/6, p.py + ghostSize/15, ghostSize/15, ghostSize/15);
        ellipse(p.px + ghostSize/6, p.py + ghostSize/15, ghostSize/15, ghostSize/15);
      }
      
      //left
      if (p.dir == 3) {
        ellipse(p.px, p.py, ghostSize, ghostSize);
        //eyeball
        fill(255);
        ellipse(p.px - ghostSize/6, p.py - ghostSize/25, ghostSize/6, ghostSize/6);
        ellipse(p.px + ghostSize/6, p.py - ghostSize/25, ghostSize/6, ghostSize/6);

        //iris - look left
        fill(p.color);
        ellipse(p.px - ghostSize/5, p.py - ghostSize/25, ghostSize/10, ghostSize/10);
        ellipse(p.px + ghostSize/8, p.py - ghostSize/25, ghostSize/10, ghostSize/10);

        //pupil
        fill(0);
        ellipse(p.px - ghostSize/5, p.py - ghostSize/25, ghostSize/15, ghostSize/15);
        ellipse(p.px + ghostSize/8, p.py - ghostSize/25, ghostSize/15, ghostSize/15);
      }
      
      //right
      if (p.dir == 4) {
        ellipse(p.px, p.py, ghostSize, ghostSize);
        //eyeball
        fill(255);
        ellipse(p.px - ghostSize/6, p.py - ghostSize/25, ghostSize/6, ghostSize/6);
        ellipse(p.px + ghostSize/6, p.py - ghostSize/25, ghostSize/6, ghostSize/6);

        //iris - look right
        fill(p.color);
        ellipse(p.px - ghostSize/12, p.py - ghostSize/25, ghostSize/10, ghostSize/10);
        ellipse(p.px + ghostSize/4, p.py - ghostSize/25, ghostSize/10, ghostSize/10);

        //pupil
        fill(0);
        ellipse(p.px - ghostSize/12, p.py - ghostSize/25, ghostSize/15, ghostSize/15);
        ellipse(p.px + ghostSize/4, p.py - ghostSize/25, ghostSize/15, ghostSize/15);
      }
      
      //set eyes to static if no direction
      else if (p.dir === undefined) {
        p.dir = 0;
      }
    }
  }
}

// Also, update the setup() function in sketch.js to ensure player sizes are consistent
function updateSetupForSmallerPlayers() {
  // In your setup function, update these values
  my.w = pacSize;
  my.h = pacSize;
  
  // Red ghost size
  my.rw = ghostSize;
  my.rh = ghostSize;
}

function chaosMode() {}