/***********************************************************************************
  Your Model Minority
  by Morgan Lee

  Uses the p5.2DAdventure.js class by Scott Kidall
  
  Github Link: https://github.com/morrganlee/ModelMinority
  Live Link: https://xarts.usfca.edu/~mhlee4/modelminority/
***********************************************************************************/

// adventure manager global  
var adventureManager;

// p5.play
var playerAvatar;

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects

// keycodes for W-A-S-D
const W_KEY = 87;
const S_KEY = 83;
const D_KEY = 68;
const A_KEY = 65;

var speed = 7;

// global directions for the avatar animations
// 0 = down | 1 = up | 2 = left | 3 = right
var direction = 0;
var front;
var back;
var side;

// game variables
var screeni;
var numSignsCollected;

// fan
var fan

// arrows
var uparrow;
var downarrow;
var rightarrow;
var leftarrow;

// setting next room for arrow direction
var nextroom;

// allocate Adventure Manager with states table and interaction tables
function preload() {
  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');

  // load arrow images to use across rooms
  uparrow = loadImage('assets/arrows/up.png');
  downarrow = loadImage('assets/arrows/down.png');
  rightarrow = loadImage('assets/arrows/right.png');
  leftarrow = loadImage('assets/arrows/left.png');

}

// setup adventure manager
function setup() {
  createCanvas(1280, 800);
  background('#F8F5F2');

  // setup the clickables
  clickables = clickablesManager.setup();

  // draws player first on instruction screen
  playerAvatar = new Avatar("Player", 200, 500);
   
  // set avatar speed
  playerAvatar.setMaxSpeed(20);

  // avatar animations
  playerAvatar.sprite.addAnimation('front', 'assets/frontstill-01.png', 'assets/frontstill-06.png');
  playerAvatar.sprite.addAnimation('front-walking', 'assets/front-01.png', 'assets/front-03.png');
  playerAvatar.sprite.addAnimation('back', 'assets/backstill-01.png', 'assets/backstill-06.png');
  playerAvatar.sprite.addAnimation('back-walking', 'assets/back-01.png', 'assets/back-03.png');
  playerAvatar.sprite.addAnimation('side', 'assets/sidestill-01.png', 'assets/sidestill-06.png');
  playerAvatar.sprite.addAnimation('sideL', 'assets/sidestillL-01.png', 'assets/sidestillL-06.png');
  playerAvatar.sprite.addAnimation('side-walking', 'assets/side-01.png', 'assets/side-04.png');

  // use this to track movement from toom to room in adventureManager.draw()
  adventureManager.setPlayerSprite(playerAvatar.sprite);

  // manages turning visibility of buttons on/off
  adventureManager.setClickableManager(clickablesManager);

  // loads the images, go through state and interation tables, etc
  adventureManager.setup();

  // call function to setup additional information about the p5.clickables that are not in the array 
  setupClickables(); 

  // load adobe font
  textFont('roc-grotesk');
}

// Adventure manager handles it all!
function draw() {

  // draws background rooms and handles movement from one to another
  adventureManager.draw();

  // draw the p5.clickables, in front of the mazes but behind the sprites 
  clickablesManager.draw();

  // make DONE clickable button not visible until needed
  // drawn on top of clickable but under avatar
  if( adventureManager.getStateName() === "Center"){
    if(nextroom !== 5){
      push();
      noStroke();
      fill("#F8F5F2");
      rect(570, 490, 160, 65);
      pop();
    }
  }

  // no avatar for Splash screen or End screen
  if( adventureManager.getStateName() !== "Splash" && adventureManager.getStateName() !== "End") {
       
    // responds to keydowns
    checkMovement();
    checkMovementAdvanced();
    checkDirection();

    // this is a function of p5.play
    drawSprite(playerAvatar.sprite);
  } 

  avatarReset();

  setnextroom();
  
}

// connects room with number to know when arrows should be drawn
function setnextroom() {
  if(adventureManager.getStateName() === "Instructions"){
    nextroom = 1;
  }
  else if(adventureManager.getStateName() === "Tech3"){
    nextroom = 2;
  }
  else if(adventureManager.getStateName() === "Street3"){
    nextroom = 3;
  }
  else if(adventureManager.getStateName() === "Cinema3"){
    nextroom = 4;
  }
  else if(adventureManager.getStateName() === "InHome"){
    nextroom = 5;
  }
}

function keyPressed() {
  adventureManager.keyPressed();
}

// respond to W-A-S-D or the arrow keys
function checkMovement() {
  var xSpeed = 0;
  var ySpeed = 0;

  // Check x movement
  if(keyIsDown(RIGHT_ARROW) || keyIsDown(D_KEY)) {
    xSpeed = speed;
  }
  else if(keyIsDown(LEFT_ARROW) || keyIsDown(A_KEY)) {
    xSpeed = -speed;
  }
  
  // Check y movement
  if(keyIsDown(DOWN_ARROW) || keyIsDown(S_KEY)) {
    ySpeed = speed;
  }
  else if(keyIsDown(UP_ARROW) || keyIsDown(W_KEY)) {
    ySpeed = -speed;
  }

  playerAvatar.setSpeed(xSpeed,ySpeed);
}

// --- ADAPTED FROM MATT'S MOVEMENT CODE
function checkMovementAdvanced() {
  // Check x movement
  if(keyIsDown(RIGHT_ARROW) || keyIsDown(D_KEY)) {
    playerAvatar.sprite.mirrorX(1);
    playerAvatar.sprite.changeAnimation('side-walking');
    direction = 3;
    playerAvatar.sprite.velocity.x = speed;
  }
  else if(keyIsDown(LEFT_ARROW) || keyIsDown(A_KEY)) {
    playerAvatar.sprite.mirrorX(-1);
    playerAvatar.sprite.changeAnimation('side-walking');
    direction = 2;
    // print(direction);
    playerAvatar.sprite.velocity.x = -speed;
  }
  else {
    checkDirection();
    playerAvatar.sprite.velocity.x = 0;
  }


  if(keyIsDown(DOWN_ARROW) || keyIsDown(S_KEY)) {
    playerAvatar.sprite.changeAnimation('front-walking');
    direction = 0;
    // print(direction);
    playerAvatar.sprite.velocity.y = speed;

  }
  else if(keyIsDown(UP_ARROW) || keyIsDown(W_KEY)) {
    playerAvatar.sprite.changeAnimation('back-walking');
    direction = 1;
    // print(direction);
    playerAvatar.sprite.velocity.y = -speed;
  }
  else {
    playerAvatar.sprite.velocity.y = 0;
  }
}

function checkDirection() {
  if (direction === 0 && playerAvatar.sprite.velocity.y === 0) {
    playerAvatar.sprite.changeAnimation('front');
  } 
  else if (direction === 1 && playerAvatar.sprite.velocity.y === 0) {
    playerAvatar.sprite.changeAnimation('back');
  } 
  else if(direction === 2 && playerAvatar.sprite.velocity.x === 0){
    playerAvatar.sprite.changeAnimation('sideL');
  } 
  else if(direction === 3 && playerAvatar.sprite.velocity.x === 0){
    playerAvatar.sprite.changeAnimation('side');
  } 
}
// --

function mouseReleased() {
  // click to change state from splash to instructions
  if( adventureManager.getStateName() === "Splash") {
    adventureManager.changeState("Instructions");
  }
  // IN HOME ROOM tv interaction
  if( adventureManager.getStateName() === "InHome") {
    if(mouseX > 736 && mouseX < 995 && mouseY > 45 && mouseY < 216){
      if(screeni < 4){
        screeni ++;
      }
     else{
       screeni = 0;
      }
    }
  }
}

//-------------- CLICKABLE CODE  ---------------//

function setupClickables() {
  // All clickables to have same effects
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;
    clickables[i].onPress = clickableButtonPressed;
    clickables[i].textFont = "roc-grotesk";
    clickables[i].textColor = "#F8F5F2"; // white
    clickables[i].color = "#CA2B30"; // red
    clickables[i].textSize = 30;
    clickables[i].width = 130;
  }
}
//--

// tint when mouse is over
clickableButtonHover = function () {
  this.noTint = false;
  this.stroke = "#CA2B30"; // red
}

// revert back to original not hovered
clickableButtonOnOutside = function () {
  this.textcolor = "#7FB069";
  this.stroke = "black"; // black
}

clickableButtonPressed = function() {
  // clickables are ones that change your state
  // they route to the adventure manager to do this
  adventureManager.clickablePressed(this.name); 
}
//

function avatarReset(){
}



//-------------- SUBCLASSES  ---------------//

class SplashScreen extends PNGRoom {
  preload() {
    // load fan image
    fan = loadImage('assets/fan/fan-01.png');
  }

  draw() {
    // this calls pngroom.draw()
    super.draw();

    // draw fan
    imageMode(CENTER);
    image(fan, width/2, 280, 380.1, 242.9);
  }
}

class InstructionsScreen extends PNGRoom {
  preload() {
    this.npc1 = new NPC("MomInstruction", width/3, 450, 'assets/npc-mom.png');
    this.npc1.addSingleInteraction("Why don\'t you visit home? \n Do you not love us?");
    this.npc1.addSingleInteraction("Keep moving. \n Why are you just standing.");

    this.hasSetup = false;
  }

  draw() {
    if( this.hasSetup === false ) {
      // set up npc
      this.npc1.setup();
      this.npc1.setPromptLocation(0,-175);

      this.hasSetup = true; 
    }

    // this calls pngroom.draw()
    super.draw();

    // draw npc
    drawSprite(this.npc1.sprite);

    this.npc1.displayInteractPrompt(playerAvatar);

    // when conversation w mom is over, draw arrow to the center
    if(this.npc1.interactionIndex === 1){
      image(rightarrow, width - 110, height/2);
    }
    }

    load() {
    // pass to PNGRoom to load image
    super.load();
    }

    keyPressed() {
    if(key === ' ') {
      if(this.npc1.isInteracting(playerAvatar)) {
        this.npc1.continueInteraction();
      }
    }
    }
}
// nextroom = 1

class CenterRoom extends PNGRoom {
  draw() {
    // this calls pngroom.draw()
    super.draw();

    // after instructions, before going to protest
    if(nextroom === 1){
      image(downarrow, width/2 - 100, height - 110);
    }
    // after protest, before going to tech
    else if(nextroom === 3){
      image(rightarrow, width - 110, height/2);
    }
    }

    load() {
    super.load();
    }

}

class Street1Room extends PNGRoom {
  preload() {
    this.signs = [];
    this.signs.push(new StaticSprite("Sign1", 500, 450, 'assets/streetgrab1.png'));
    this.signs.push(new StaticSprite("Sign2", 800, 700, 'assets/streetgrab2.png'))
    this.signs.push(new StaticSprite("Sign3", 550, 600, 'assets/streetgrab3.png'))

    this.signsCollected = [];
    this.signsCollected.push(false);
    this.signsCollected.push(false);
    this.signsCollected.push(false);

    
    this.signsLoaded = false;
  }

  draw() {
    super.draw();

    // if not yet gone to the Street3Room draw instructions
    if(nextroom !== 3){
      push();
      rectMode(CENTER);
      fill('#E2A453');
      noStroke();
      rect(955, 110, 355, 110);
      fill('black'); 
      textSize(20);
      rectMode(CORNER);
      text('Ready to join the protest? \nCollect all seven signs on the \nstreet to bring to the crowd.', 805, 75, 375);
      pop();
    }

    // if avatar has not gone to protest room yet
    if(nextroom === 1){
      image(downarrow, width/2 - 100, height - 110);
    }

    // setup signs if signs not loaded in preload()
    if(this.signsLoaded === false) {
      for(let i = 0; i < this.signs.length; i++ ) {
        this.signs[i].setup();
      }
      this.signLoaded = true;
    }

    // draws sprites that have not been collided yet
    for(let i = 0; i < this.signs.length; i++ ) {
      if(this.signsCollected[i] === false){
        drawSprite(this.signs[i].sprite);
      }
    }
    this.signLoaded = true;

    // set collided signs to true
    for( let i = 0; i < this.signs.length; i++ ) {
      if( playerAvatar.sprite.overlap(this.signs[i].sprite) ) {
        this.signsCollected[i] = true;
      }
    }
  }
}

class Street2Room extends PNGRoom {
  preload() {
    this.signs = [];
    this.signs.push(new StaticSprite("Sign4", 900, 250, 'assets/streetgrab4.png'));
    this.signs.push(new StaticSprite("Sign5", 800, 700, 'assets/streetgrab5.png'))
    this.signs.push(new StaticSprite("Sign6", 300, 400, 'assets/streetgrab6.png'))
    this.signs.push(new StaticSprite("Sign7", 750, 500, 'assets/streetgrab7.png'))

    this.signsCollected = [];
    this.signsCollected.push(false);
    this.signsCollected.push(false);
    this.signsCollected.push(false);
    this.signsCollected.push(false);

    
    this.signsLoaded = false;
  }

  draw() {
    // this calls PNGRoom.draw()
    super.draw();

    // setup signs if signs not loaded in preload()
    if(this.signsLoaded === false) {
      for( let i = 0; i < this.signs.length; i++ ) {
        this.signs[i].setup();
      }
      this.signLoaded = true;
    }

    // if avatar has not gone to protest room yet
    if(nextroom === 1){
      image(downarrow, width/2 - 100, height - 110);
    }

    // draws sprites that have not been collided yet
    for(let i = 0; i < this.signs.length; i++ ) {
      if(this.signsCollected[i] === false){
        drawSprite(this.signs[i].sprite);
      }
    }
    this.signLoaded = true;

    // set collided signs to true
    for( let i = 0; i < this.signs.length; i++ ) {
      if( playerAvatar.sprite.overlap(this.signs[i].sprite) ) {
        this.signsCollected[i] = true;;
      }
    }
  }
}

class ProtestRoom extends PNGRoom {
  preload() {
    // define class varibles here, load images or anything else
    this.npc1 = new NPC("Activist", width-200, 330, 'assets/npc-activist.png');
    this.npc1.addSingleInteraction("Hi! Did you just get here? \n My name is Jackie, nice to meet you.");
    this.npc1.addSingleInteraction("... \n Thanks for bringing all these signs!");
    this.npc1.addSingleInteraction("It is so amazing to see everyone here, \n I\'m so tired of hearing how we have");
    this.npc1.addSingleInteraction("to be quiet and listen to every rule. \n Today\'s protest is to call for a more");
    this.npc1.addSingleInteraction("detailed race questions on the census. \n This will help us break the model-");
    this.npc1.addSingleInteraction("minority myth, so that\'s why you\'ll \n see other signs here.");
    this.npc1.addSingleInteraction("Hope to see you around! \n Stay safe on your way home!");

    this.npc2 = new NPC("Protest", width/3, height-200, 'assets/npc-protest.png');
    // no interaction text

    this.hasSetup = false;
  }


  draw() {
    // Idea is to call the npc1.setup() function ONE time, so we use this kind of flag
    if( this.hasSetup === false ) {
      // setup NPC1
      this.npc1.setup();
      this.npc1.setPromptLocation(0,-225);
      
      // setup NPC2
      this.npc2.setup();
      this.npc2.setPromptLocation(0,-250);

      this.hasSetup = true; 
    }

    // this calls PNGRoom.draw()
    super.draw();

    // draw NPCs
    drawSprite(this.npc1.sprite);
    drawSprite(this.npc2.sprite);

    this.npc1.displayInteractPrompt(playerAvatar);

    // draws arrow after npc1 interaction is complete
    if(this.npc1.interactionIndex === 6){
      image(uparrow, width/2 - 110, 50);
    }
  }

  unload() {
    this.npc1.resetInteraction();
  }

  load() {
    // pass to PNGRoom to load image
    super.load();
      }

  keyPressed() {
    if(key === ' ') {
      if(this.npc1.isInteracting(playerAvatar)) {
        this.npc1.continueInteraction();
      }
    }
  }
}
// nextroom = 3

class TechRoom extends PNGRoom {
  draw() {
    // this calls pngroom.draw()
    super.draw();

    // after going inside tech, draws arrow towards chinatown
    if(nextroom === 2){
      image(uparrow, 200, 50);
    }
    }

    load() {
    super.load();
    }

}

class Tech1Room extends PNGRoom {
  preload() {
    this.npc1 = new NPC("Ceo", width/3, height/2, 'assets/npc-ceo.png');
    this.npc1.addSingleInteraction("Hello, I\'m Richard! \n I\'m the manager of this divison.");
    this.npc1.addSingleInteraction("At WIREnet, we are proud to say that \n we really value diversity.");
    this.npc1.addSingleInteraction("Feel free to walk around \n and talk to everyone!");

    this.npc2 = new NPC("Tech1", width - 300, height/2 - 100, 'assets/npc-tech1.png');
    this.npc2.addSingleInteraction("Hello! I\'m Alan, \n I just started working here.");
    this.npc2.addSingleInteraction("I graduated summa cum laude \n just last year.");
    this.npc2.addSingleInteraction("I was also president and founder of \n the Asian Scholar Association.");
    this.npc2.addSingleInteraction("I\'m excited to see how \n I progress in the future!");
    
    this.hasSetup = false;
  }

  draw() {
    if( this.hasSetup === false ) {
      // setup NPC 1
      this.npc1.setup();
      this.npc1.setPromptLocation(0,-170);
      
      // setup NPC 2
      this.npc2.setup();
      this.npc2.setPromptLocation(0,-170);

      this.hasSetup = true; 
    }

    // this calls PNGRoom.draw()
    super.draw();

    // draw our NPCs
    drawSprite(this.npc1.sprite);
    drawSprite(this.npc2.sprite);

    this.npc1.displayInteractPrompt(playerAvatar);
    this.npc2.displayInteractPrompt(playerAvatar);
  }

  unload() {
    // reset NPC interaction to beginning when entering room
    this.npc1.resetInteraction();
    this.npc2.resetInteraction();
  }

  load() {
    // pass to PNGRoom to load image
    super.load();
  }

  keyPressed() {
    if(key === ' ') {
      if(this.npc1.isInteracting(playerAvatar)) {
        this.npc1.continueInteraction();
      }
      if(this.npc2.isInteracting(playerAvatar)) {
        this.npc2.continueInteraction();
      }
    }
  }
}

class Tech2Room extends PNGRoom {
  preload() {
    this.npc1 = new NPC("Tech2", 255, 330, 'assets/npc-tech2.png');
    this.npc1.addSingleInteraction("Hi, I'm Paul. \n Sorry I can\'t talk for long.");
    this.npc1.addSingleInteraction("I had to pick up more hours this month. \n My wife's nail salon job doesn\'t pay much.");

    this.npc2 = new NPC("Tech3", width - 500, height/2, 'assets/npc-tech3.png');
    this.npc2.addSingleInteraction("Are you visiting? \n Did you meet Alan at the front?");
    this.npc2.addSingleInteraction("I feel bad for that kid. \n That was me like 20 years ago,");
    this.npc2.addSingleInteraction("I\'ve never gotten anything \n more than a raise.");
    this.npc2.addSingleInteraction("People like us won\'t be \n CEO anytime soon.");

    this.npc3 = new NPC("Tech4", width- 255, 330, 'assets/npc-tech4.png');
    this.npc3.addSingleInteraction("Hi, I\'m Don, \n Sorry about Greg, he is a little jaded.");
    this.npc3.addSingleInteraction("We got hired the same season, \n but I believe there will be change!");
    this.npc3.addSingleInteraction("We just need to be grateful for \n the opportunities we have now.");
    
    this.hasSetup = false;
  }

  draw() {
    if( this.hasSetup === false ) {
      // setup NPC 1
      this.npc1.setup();
      this.npc1.setPromptLocation(0,-170);
      
      // setup NPC 2
      this.npc2.setup();
      this.npc2.setPromptLocation(0,-170);

      // setup NPC 3
      this.npc3.setup();
      this.npc3.setPromptLocation(0,-170)

      this.hasSetup = true; 
    }

    // this calls PNGRoom.draw()
    super.draw();

    // draw our NPCs
    drawSprite(this.npc1.sprite);
    drawSprite(this.npc2.sprite);
    drawSprite(this.npc3.sprite);

    this.npc1.displayInteractPrompt(playerAvatar);
    this.npc2.displayInteractPrompt(playerAvatar);
    this.npc3.displayInteractPrompt(playerAvatar);
  }

  unload() {
    // reset NPC interaction to beginning when entering room
    this.npc1.resetInteraction();
    this.npc2.resetInteraction();
    this.npc3.resetInteraction();
  }

  load() {
    // pass to PNGRoom to load image
    super.load();
  }

  keyPressed() {
    if(key === ' ') {
      if(this.npc1.isInteracting(playerAvatar)) {
        this.npc1.continueInteraction();
      }
      else if(this.npc2.isInteracting(playerAvatar)) {
        this.npc2.continueInteraction();
      }
      else if(this.npc3.isInteracting(playerAvatar)) {
        this.npc3.continueInteraction();
      }
    }
  }
}

class Tech3Room extends PNGRoom {
  preload() {
    this.npc1 = new NPC("Tech5", 255, height/2, 'assets/npc-tech5.png');
    this.npc1.addSingleInteraction("Hey, I'm Philip. \n Um...");
    this.npc1.addSingleInteraction("Can I ask you a question... \n as a woman?");
    this.npc1.addSingleInteraction("... \n Is the pay gap really real?");
    this.npc1.addSingleInteraction("Because Asian-Americans make more \n than white people on average.");
    this.npc1.addSingleInteraction("We work so hard... \n All minorities should be like us.");

    this.npc2 = new NPC("Tech6", width - 500, height/2, 'assets/npc-tech6.png');
    this.npc2.addSingleInteraction("Oh sorry, I was just thinking \n I\'m really lucky, ");
    this.npc2.addSingleInteraction("I was able to come here and go to college. \n That\'s how I got this job.");
    this.npc2.addSingleInteraction("I send a lot of my paycheck back \n home to support my parents.");
    this.npc2.addSingleInteraction("Do you do the same thing? \n It's the least I can do for them.");
    
    this.hasSetup = false;
  }

  draw() {
    if( this.hasSetup === false ) {
      // set up npc1
      this.npc1.setup();
      this.npc1.setPromptLocation(0,-170);
      
      // set up npc2
      this.npc2.setup();
      this.npc2.setPromptLocation(0,-170);

      this.hasSetup = true; 
    }

    // this calls pngroom.draw()
    super.draw();

    // draw npcs
    drawSprite(this.npc1.sprite);
    drawSprite(this.npc2.sprite);

    this.npc1.displayInteractPrompt(playerAvatar);
    this.npc2.displayInteractPrompt(playerAvatar);
  }

  unload() {
    // reset NPC interaction to beginning when entering room
    this.npc1.resetInteraction();
    this.npc2.resetInteraction();
  }

  load() {
    super.load();
  }

  keyPressed() {
    if(key === ' ') {
      if(this.npc1.isInteracting(playerAvatar)) {
        this.npc1.continueInteraction();
      }
      else if(this.npc2.isInteracting(playerAvatar)) {
        this.npc2.continueInteraction();
      }
    }
  }
}
// nextroom = 2

class ChinaRoom extends PNGRoom {
  preload() {
    this.npc1 = new NPC("Auntie", width/2 - 10, height/2 + 50, 'assets/npc-auntie.png');
    this.npc1.addSingleInteraction("Hello sweetie! \n It\'s been so long since I\'ve seen you!");
    this.npc1.addSingleInteraction("You look like you\'ve been eating a lot... \n Getting a little chubby?");
    this.npc1.addSingleInteraction("Your skin is so much darker too. \n I have some whitening soap for you.");
    this.npc1.addSingleInteraction("Do you have a boyfriend yet? \n Are you getting good grades?");
    this.npc1.addSingleInteraction("Have you seen Vivian recently? \n She\'s fat now.");
    this.npc1.addSingleInteraction("But you should be more like her, \n she has a boyfriend and a good job.");
    this.npc1.addSingleInteraction("Why does you Chinese sound so bad? \n You need to remember your roots...");
    this.npc1.addSingleInteraction("Oh you have to go? Okay sweetie, \n say hi to your mom and dad for me,");
    this.npc1.addSingleInteraction("you should come over for dinner! \n You need to eat more.");
    
    this.hasSetup = false;
  }

  draw() {
    if( this.hasSetup === false ) {
      // setup NPC 1
      this.npc1.setup();
      this.npc1.setPromptLocation(0,-170);

      this.hasSetup = true; 
    }

    // this calls PNGRoom.draw()
    super.draw();

    // draw NPC
    drawSprite(this.npc1.sprite);

    this.npc1.displayInteractPrompt(playerAvatar);

    // after conversation is over, draw arrow to home
    if(this.npc1.interactionIndex === 8){
      image(leftarrow, 20, height - 220);
    }
  }

  unload() {
    // reset NPC interaction to beginning when entering room
    this.npc1.resetInteraction();
  }

  load() {
    super.load();
  }

  keyPressed() {
    if(key === ' ') {
      if(this.npc1.isInteracting(playerAvatar)) {
        this.npc1.continueInteraction();
      }
    }
  }
}

class CinemaRoom extends PNGRoom {
  draw() {
    // this calls pngroom.draw()
    super.draw();

    // after going inside the cinema, draw arrow towards home
    if(nextroom === 4){
      image(leftarrow, 20, height - 220); 
    }
    // after going inside the home, draw arrow towards center
    else if(nextroom === 5){
      image(downarrow, 100, height - 150);
    }
  }

    load() {
    super.load();
    }
}

class LobbyRoom extends PNGRoom {
  draw() {
    // this calls pngroom.draw()
    super.draw();

    // draws instructions if player did not go to theater3 yet
    if(nextroom !== 4){
      push();
      rectMode(CENTER);
      fill('#E2A453');
      noStroke();
      rect(215, 720, 355, 90);
      fill('black'); 
      textSize(20);
      rectMode(CORNER);
      text('You got your tickets! \nFeel free to go into all of the \ntheaters and enjoy the shows!', 50, 685, 375);
      pop();
    }
  }
}
// nextroom = 4

class HomeRoom extends PNGRoom {
  draw() {
    // this calls pngroom.draw
    super.draw();

    // draws arrow to go back to center after going into the home
    if(nextroom === 5){
      image(rightarrow, width - 150, height - 250);
    }
  }

    load() {
    super.load();
    }

}

class InHomeRoom extends PNGRoom {
  preload() {
    this.npc1 = new NPC("Mom", 200, 500, 'assets/npc-mom.png');
    this.npc1.addSingleInteraction("I could\'t get groceries today, \n there was a protest on the road.");
    this.npc1.addSingleInteraction("It was scary, with so many people.  \n They were yelling so loud...");
    this.npc1.addSingleInteraction("Them making my life harder \n makes me want to disagree.");
    this.npc1.addSingleInteraction("Why do they need to do that? \n Why can\'t they just behave.");
    this.npc1.addSingleInteraction("Promise me you won't go to \n any of those gatherings.");
    this.npc1.addSingleInteraction("In China, protesters will \n often disappear.");
    this.npc1.addSingleInteraction("We can\'t have that \n happening to you.");


    this.npc2 = new NPC("Dad", width/2 - 80, height/2 - 65, 'assets/npc-dad.png');
    this.npc2.addSingleInteraction("Hey Alice, \n what\'s this on the TV?");
    this.npc2.addSingleInteraction("When we first moved here, \n we didn\'t have to do all this.");
    this.npc2.addSingleInteraction("... \n What do you mean that\'s not right?");
    this.npc2.addSingleInteraction("... \n What do you mean that\'s not right?");    
    this.hasSetup = false;
    
    this.screens = [];
    this.screens[0] = loadImage('assets/tvscreen-1.png');
    this.screens[1] = loadImage('assets/tvscreen-2.png');
    this.screens[2] = loadImage('assets/tvscreen-3.png');
    this.screens[3] = loadImage('assets/tvscreen-4.png');
    this.screens[4] = loadImage('assets/tvscreen-5.png');

    screeni = 0;
  }
 
  draw() {
    if( this.hasSetup === false ) {
      // load npc1
      this.npc1.setup();
      this.npc1.setPromptLocation(0,-170);
      
      // load npc2
      this.npc2.setup();
      this.npc2.setPromptLocation(0,-170);

      this.hasSetup = true; 
    }

    // this draws pngroom.draw()
    super.draw();

    // draw npcs
    drawSprite(this.npc1.sprite);
    drawSprite(this.npc2.sprite);

    this.npc1.displayInteractPrompt(playerAvatar);
    this.npc2.displayInteractPrompt(playerAvatar);

    // start game after first conversation with dad
    if(this.npc2.interactionIndex === 3){
      push();
      rectMode(CORNER);
      fill('#E2A453');
      noStroke();
      rect(750, 400, 385, 110);
      fill('black'); 
      textSize(20);
      text('Explain to your dad how he\'s wrong by clicking on the TV to change the channel to show different historical moments.', 760, 410, 375);
      image(this.screens[screeni], 737, 46);
      pop();
    }

    // add to dad npc conversation after game is finished
    if(screeni === 3){
      this.npc2.addSingleInteraction("... \n Wow, I forgot about most of these things.");
      this.npc2.addSingleInteraction("We overcame these things \n so that means they will too.");
      this.npc2.addSingleInteraction("Right? \n ... Oh.");

    }
  }

  unload() {
    this.npc1.resetInteraction();
    this.npc2.resetInteraction();
  }

  load() {
    super.load();
  }

  keyPressed() {
    if(key === ' ') {
      if(this.npc1.isInteracting(playerAvatar)) {
        this.npc1.continueInteraction();
      }
      if(this.npc2.isInteracting(playerAvatar)) {
        this.npc2.continueInteraction();
      }
    }
  }
}
// nextroom = 5

// from "Done" clickable on CenterRoom after InHomeRoom
// EndScreen draws fan
class EndScreen extends PNGRoom{
  preload() {
    fan = loadImage('assets/fan/fan-01.png');
  }

  draw() {
    // calls PNGRoom.draw()
    super.draw();

    imageMode(CENTER);
    image(fan, 284, 424, 380.1, 242.9);
    }

    load() {
    super.load();
    }

}