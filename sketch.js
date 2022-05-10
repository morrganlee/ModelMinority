/***********************************************************************************
  Your Model Minority
  by Morgan Lee

  Uses the p5.2DAdventure.js class by Scott Kidall
  
------------------------------------------------------------------------------------
	To use:
	Add this line to the index.html

  <script src="p5.2DAdventure.js"></script>
***********************************************************************************/

//--- TEMPLATE STUFF: Don't change

// adventure manager global  
var adventureManager;

// p5.play
var playerAvatar;

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects

// keycods for W-A-S-D
const W_KEY = 87;
const S_KEY = 83;
const D_KEY = 68;
const A_KEY = 65;

//-- MODIFY THIS for different speeds
var speed = 7;

//--- Your globals would go here
// 0 = down | 1 = up | 2 = left | 3 = right
var direction = 0;
var front;
var back;
var side;

var screeni;
var numSignsCollected;

// fan animation
var fan = [];
// var fani = 0;
// var fanbounce = 1;

// arrows
var uparrow;
var downarrow;
var rightarrow;
var leftarrow;

// Allocate Adventure Manager with states table and interaction tables
function preload() {
  //--- TEMPLATE STUFF: Don't change
  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');
  //---

  uparrow = loadImage('assets/arrows/up.png');
  downarrow = loadImage('assets/arrows/down.png');
  rightarrow = loadImage('assets/arrows/right.png');
  leftarrow = loadImage('assets/arrows/left.png');
}

// Setup the adventure manager
function setup() {
  createCanvas(1280, 800);
  background('#F8F5F2');

  //--- TEMPLATE STUFF: Don't change
  // setup the clickables = this will allocate the array
  clickables = clickablesManager.setup();
  //---

  // MODIFY THIS: change to initial position
  playerAvatar = new Avatar("Player", 200, 500); // 200, 500
   
  // MODIFY THIS: to make your avatar go faster or slower
  playerAvatar.setMaxSpeed(20);

  // MODIFY THIS: add your filenames here, right now our moving animation and standing animation are the same
  playerAvatar.sprite.addAnimation('front', 'assets/frontstill-01.png', 'assets/frontstill-06.png');
  playerAvatar.sprite.addAnimation('front-walking', 'assets/front-01.png', 'assets/front-03.png');
  playerAvatar.sprite.addAnimation('back', 'assets/backstill-01.png', 'assets/backstill-06.png');
  playerAvatar.sprite.addAnimation('back-walking', 'assets/back-01.png', 'assets/back-03.png');
  playerAvatar.sprite.addAnimation('side', 'assets/sidestill-01.png', 'assets/sidestill-06.png');
  playerAvatar.sprite.addAnimation('sideL', 'assets/sidestillL-01.png', 'assets/sidestillL-06.png');
  playerAvatar.sprite.addAnimation('side-walking', 'assets/side-01.png', 'assets/side-04.png');

  //--- TEMPLATE STUFF: Don't change
  // use this to track movement from toom to room in adventureManager.draw()
  adventureManager.setPlayerSprite(playerAvatar.sprite);

  // this is optional but will manage turning visibility of buttons on/off
  // based on the state name in the clickableLayout
  adventureManager.setClickableManager(clickablesManager);

    // This will load the images, go through state and interation tables, etc
  adventureManager.setup();

  // call OUR function to setup additional information about the p5.clickables
  // that are not in the array 
  setupClickables(); 
  //--

  // load adobe font
  textFont('roc-grotesk-bold');
  textFont('roc-grotesk');

  // frameRate(20);

  // NEW: LINE FOR DEBUGGING
  // adventureManager.changeState("Tech");
}

// Adventure manager handles it all!
function draw() {

  //--- TEMPLATE STUFF: Don't change
  // draws background rooms and handles movement from one to another
  adventureManager.draw();

  // draw the p5.clickables, in front of the mazes but behind the sprites 
  clickablesManager.draw();
  //---

  //--- MODIFY THESE CONDITONALS
  // No avatar for Splash screen or Instructions screen
  if( adventureManager.getStateName() !== "Splash") {
      
    //--- TEMPLATE STUFF: Don't change    
    // responds to keydowns
    checkMovement();
    checkMovementAdvanced();
    checkDirection();

    // this is a function of p5.play, not of this sketch
    drawSprite(playerAvatar.sprite);
    //--
  } 

  avatarReset()

  // keyPressed() {
  //   if(key === "x"){

  //   }
  // }
}

function keyPressed() {
  adventureManager.keyPressed();
}

//--- TEMPLATE STUFF: Don't change 
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
//--

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

//-- MODIFY THIS: this is an example of how I structured my code. You may
// want to do it differently
function mouseReleased() {
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

//--- TEMPLATE STUFF: Don't change 
function setupClickables() {
  // All clickables to have same effects
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;
    clickables[i].onPress = clickableButtonPressed;
    clickables[i].textFont = "roc-grotesk";
    clickables[i].textColor = "#CA2B30"; // red
    clickables[i].textSize = 30;
    clickables[i].width = 110;
    // clickables[i].stroke = 100;
  }
}
//--

//-- MODIFY THIS:
// tint when mouse is over
clickableButtonHover = function () {
  this.textcolor = "#7FB069";
  this.noTint = false;
  this.tint = "#F8F5F2";
  this.stroke = "#CA2B30"; // red
}

//-- MODIFY THIS:
// color a light gray if off
clickableButtonOnOutside = function () {
  // backto our gray color
  this.textcolor = "#7FB069";
  this.stroke = "black"; // black
}

//--- TEMPLATE STUFF: Don't change 
clickableButtonPressed = function() {
  // these clickables are ones that change your state
  // so they route to the adventure manager to do this
  adventureManager.clickablePressed(this.name); 
}
//

function avatarReset(){

}



//-------------- SUBCLASSES / YOUR DRAW CODE CAN GO HERE ---------------//

//-- MODIFY THIS:
// Change for your own instructions screen

// Instructions screen has a backgrounnd image, loaded from the adventureStates table
// It is sublcassed from PNGRoom, which means all the loading, unloading and drawing of that
// class can be used. We call super() to call the super class's function as needed

class SplashScreen extends PNGRoom {
  preload() {
    fan[0] = loadImage('assets/fan/fan-01.png');
    fan[1] = loadImage('assets/fan/fan-02.png');
    fan[2] = loadImage('assets/fan/fan-03.png');
    fan[3] = loadImage('assets/fan/fan-04.png');
    fan[4] = loadImage('assets/fan/fan-05.png');
    fan[5] = loadImage('assets/fan/fan-06.png');
    fan[6] = loadImage('assets/fan/fan-07.png');
    fan[7] = loadImage('assets/fan/fan-08.png');
    fan[8] = loadImage('assets/fan/fan-09.png');
    fan[9] = loadImage('assets/fan/fan-10.png');
    fan[10] = loadImage('assets/fan/fan-11.png');
    fan[11] = loadImage('assets/fan/fan-12.png');
  }

  draw() {
    super.draw();

    image(fan[0], 124, 294, 380.1, 242.9);
    
    // while(fani > 13 || fani >= 0){
    //   if(fani < 11){
    //     fani ++;
    //   }
    //   else if(fani > 12 && fani >= 0){
    //     fani --;
    //   }
    // }
  }
}

class InstructionsScreen extends PNGRoom {
  preload() {
    // define class varibles here, load images or anything else
    this.npc1 = new NPC("MomInstruction", width/3, 450, 'assets/npc-mom.png');
    this.npc1.addSingleInteraction("Why don\'t you visit home? \n Do you not love us?");
    this.npc1.addSingleInteraction("Keep moving. \n Why are you just standing.");

    // setup flag, seto false
    this.hasSetup = false;
  }

  draw() {
    if( this.hasSetup === false ) {
      this.npc1.setup();
      this.npc1.setPromptLocation(0,-175);

      this.hasSetup = true; 

      if(this.npc1.interactionIndex === 1){
        image(rightarrow, width/2, height/2);
      }
    }

    super.draw();

    drawSprite(this.npc1.sprite);

    this.npc1.displayInteractPrompt(playerAvatar);
    }

    // custom code here to do stuff upon exiting room
    unload() {
    }

    // custom code here to do stuff upon entering room
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

class ChinaRoom extends PNGRoom {
  preload() {
    // define class varibles here, load images or anything else
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
    
    // setup flag, seto false
    this.hasSetup = false;
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our code adter this
  draw() {
    // Idea is to call the npc1.setup() function ONE time, so we use this kind of flag
    if( this.hasSetup === false ) {
      // setup NPC 1
      this.npc1.setup();
      this.npc1.setPromptLocation(0,-170);

      this.hasSetup = true; 
    }

    // this calls PNGRoom.draw()
    super.draw();

    // draw our NPCs
    drawSprite(this.npc1.sprite);

    // When you have multiple NPCs, you can add them to an array and have a function 
    // iterate through it to call this function for each more concisely.
    this.npc1.displayInteractPrompt(playerAvatar);
  }

  // custom code here to do stuff upon exiting room
  unload() {
    // reset NPC interaction to beginning when entering room
    this.npc1.resetInteraction();
  }

  // custom code here to do stuff upon entering room
  load() {
    // pass to PNGRoom to load image
    super.load();
    
    // Add custom code here for unloading
  }

  keyPressed() {
    if(key === ' ') {
      if(this.npc1.isInteracting(playerAvatar)) {
        this.npc1.continueInteraction();
      }
    }
  }
}

class Tech1Room extends PNGRoom {
  preload() {
    // define class varibles here, load images or anything else
    this.npc1 = new NPC("Ceo", width/3, height/2, 'assets/npc-ceo.png');
    this.npc1.addSingleInteraction("Hello, I\'m Richard! \n I\'m the manager of this divison.");
    this.npc1.addSingleInteraction("At WIREnet, we are proud to say that \n we really value diversity.");
    this.npc1.addSingleInteraction("Feel free to walk around \n and talk to everyone!");

    this.npc2 = new NPC("Tech1", width - 300, height/2 - 100, 'assets/npc-tech1.png');
    this.npc2.addSingleInteraction("Hello! I\'m Alan, \n I just started working here.");
    this.npc2.addSingleInteraction("I graduated summa cum laude \n just last year.");
    this.npc2.addSingleInteraction("I was also president and founder of \n the Asian Scholar Association.");
    this.npc2.addSingleInteraction("I\'m excited to see how \n I progress in the future!");
    
    // setup flag, seto false
    this.hasSetup = false;
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our code adter this
  draw() {
    // Idea is to call the npc1.setup() function ONE time, so we use this kind of flag
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

    // When you have multiple NPCs, you can add them to an array and have a function 
    // iterate through it to call this function for each more concisely.
    this.npc1.displayInteractPrompt(playerAvatar);
    this.npc2.displayInteractPrompt(playerAvatar);
  }

  // custom code here to do stuff upon exiting room
  unload() {
    // reset NPC interaction to beginning when entering room
    this.npc1.resetInteraction();
    this.npc2.resetInteraction();
  }

  // custom code here to do stuff upon entering room
  load() {
    // pass to PNGRoom to load image
    super.load();
    
    // Add custom code here for unloading
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

    // When you have multiple NPCs, you can add them to an array and have a function 
    // iterate through it to call this function for each more concisely.
    this.npc1.displayInteractPrompt(playerAvatar);
    this.npc2.displayInteractPrompt(playerAvatar);
    this.npc3.displayInteractPrompt(playerAvatar);
  }

  // custom code here to do stuff upon exiting room
  unload() {
    // reset NPC interaction to beginning when entering room
    this.npc1.resetInteraction();
    this.npc2.resetInteraction();
    this.npc3.resetInteraction();
  }

  // custom code here to do stuff upon entering room
  load() {
    // pass to PNGRoom to load image
    super.load();
    
    // Add custom code here for unloading
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
    this.npc1 = new NPC("Tech5", 255, 330, 'assets/npc-tech5.png');
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
      this.npc1.setup();
      this.npc1.setPromptLocation(0,-170);
      
      this.npc2.setup();
      this.npc2.setPromptLocation(0,-170);

      this.hasSetup = true; 
    }

    super.draw();

    drawSprite(this.npc1.sprite);
    drawSprite(this.npc2.sprite);

    this.npc1.displayInteractPrompt(playerAvatar);
    this.npc2.displayInteractPrompt(playerAvatar);
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
      else if(this.npc2.isInteracting(playerAvatar)) {
        this.npc2.continueInteraction();
      }
    }
  }
}

class InHomeRoom extends PNGRoom {
  preload() {
    this.npc1 = new NPC("Mom", 200, 500, 'assets/npc-mom.png');
    this.npc1.addSingleInteraction("I could\'t get groceries today, \n there was a protest on the road.");
    this.npc1.addSingleInteraction("It was scary, with so many people.  \n They were yelling so loud...");
    this.npc1.addSingleInteraction("Them making my life harder \n makes me want to disagree.");
    this.npc1.addSingleInteraction("Why do they need to do that? \n Why can\'t they just behave.");

    this.npc2 = new NPC("Dad", width/2 - 50, height/3, 'assets/npc-dad.png');
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
      this.npc1.setup();
      this.npc1.setPromptLocation(0,-170);
      
      this.npc2.setup();
      this.npc2.setPromptLocation(0,-170);

      this.hasSetup = true; 
    }

    super.draw();

    drawSprite(this.npc1.sprite);
    drawSprite(this.npc2.sprite);

    this.npc1.displayInteractPrompt(playerAvatar);
    this.npc2.displayInteractPrompt(playerAvatar);

    // start game
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
    // this.npc2.addSingleInteraction("WE WANT A MORE DETAILED CENSUS");
    // this.npc2.addSingleInteraction("NOT YOUR MODEL MINORITY");
    // this.npc2.addSingleInteraction("YELLOW PERIL FOR BLACK LIVES");
    // this.npc2.addSingleInteraction("WE ARE NOT ALL THE SAME");
    
    // setup flag, seto false
    this.hasSetup = false;
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our code adter this
  draw() {
    // Idea is to call the npc1.setup() function ONE time, so we use this kind of flag
    if( this.hasSetup === false ) {
      // setup NPC 1
      this.npc1.setup();
      this.npc1.setPromptLocation(0,-225);
      
      // setup NPC 2
      this.npc2.setup();
      this.npc2.setPromptLocation(0,-250);

      this.hasSetup = true; 
    }

    // this calls PNGRoom.draw()
    super.draw();

    // draw our NPCs
    drawSprite(this.npc1.sprite);
    drawSprite(this.npc2.sprite);

    // When you have multiple NPCs, you can add them to an array and have a function 
    // iterate through it to call this function for each more concisely.
    this.npc1.displayInteractPrompt(playerAvatar);
    // this.npc2.displayInteractPrompt(playerAvatar);
  }

  // custom code here to do stuff upon exiting room
  unload() {
    // reset NPC interaction to beginning when entering room
    this.npc1.resetInteraction();
    // this.npc2.resetInteraction();
  }

  // custom code here to do stuff upon entering room
  load() {
    // pass to PNGRoom to load image
    super.load();
    
    // Add custom code here for unloading
  }

  keyPressed() {
    if(key === ' ') {
      if(this.npc1.isInteracting(playerAvatar)) {
        this.npc1.continueInteraction();
      }
      // else if(this.npc2.isInteracting(playerAvatar)) {
      //   this.npc2.continueInteraction();
      // }
    }
  }
  //   image(protest, width/2, height - 330);
  //   image(activist, width - 200, height/3);
  // }
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

    // signUsed = false;

    // for(let i = 0; i< this.signs.length; i++) {
    //   if(this.signsCollected[i] = true){
    //     numSignsCollected ++;
    //   }
    //   else if(numSignsCollected = NaN){
    //     numSignsCollected = 0;
    //   }
    // }
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our code adter this
  draw() {
    // this calls PNGRoom.draw()
    super.draw();

    push();
    rectMode(CENTER);
    fill('#E2A453');
    noStroke();
    rect(955, 110, 355, 110);
    fill('black'); 
    textSize(20);
    rectMode(CORNER);
    text('Ready to join the protest? \nCollect all the signs on the \nstreet to bring to the crowd.', 805, 75, 375);
    pop();

    // Add your code here
    if(this.signsLoaded === false) {
      for(let i = 0; i < this.signs.length; i++ ) {
        this.signs[i].setup();
        // this.singsCollected[i] = false;
      }
      this.signLoaded = true;
    }

    for(let i = 0; i < this.signs.length; i++ ) {
      if(this.signsCollected[i] === false){
        drawSprite(this.signs[i].sprite);
      }
    }
    this.signLoaded = true;

    for( let i = 0; i < this.signs.length; i++ ) {
      if( playerAvatar.sprite.overlap(this.signs[i].sprite) ) {
        this.signsCollected[i] = true;;
      }
    }

    numSignsCollected = 0;
    push();
    fill('#E2A453');
    noStroke();
    rect(100, height - 200, 200, 90);
    fill('black');
    textSize(20);
    text('Signs collected:', 120, height - 180, 250);
    text(numSignsCollected + ' / 7', 120, height - 130);
    pop();
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

    // signUsed = false;
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our code adter this
  draw() {
    // this calls PNGRoom.draw()
    super.draw();

    // Add your code here
    if(this.signsLoaded === false) {
      for( let i = 0; i < this.signs.length; i++ ) {
        this.signs[i].setup();
      }
      this.signLoaded = true;
    }

    for(let i = 0; i < this.signs.length; i++ ) {
      if(this.signsCollected[i] === false){
        drawSprite(this.signs[i].sprite);
      }
    }
    this.signLoaded = true;

    for( let i = 0; i < this.signs.length; i++ ) {
      if( playerAvatar.sprite.overlap(this.signs[i].sprite) ) {
        // console.log("collision: " + i);
        this.signsCollected[i] = true;;
      }
    }
  }
}

// not sure if i want to include
// class ParkRoom extends PNGRoom {
//   preload() {
//     // define class varibles here, load images or anything else
//     this.npc1 = new NPC("Catcall", 700, 500, 'assets/npc-catcall.png');
//     this.npc1.addSingleInteraction("NI HAO \n LING LING");
//     this.npc1.addSingleInteraction("HEY \n ME SO HORNY");
//     this.npc1.addSingleInteraction("YOU LOOK LIKE MULAN \n YOU'RE SO HOT FOR AN ASIAN");
//     this.npc1.addSingleInteraction("COME CLOSER, \n I WONT HURT YOU");
    
//     this.hasSetup = false;
//   }
 
//   draw() {
//     if( this.hasSetup === false ) {
//       // setup NPC 1
//       this.npc1.setup();

//       this.hasSetup = true; 
//     }

//     // set to already interacting
//     this.npc1.isInteracting(playerAvatar) = true;

//     // this calls PNGRoom.draw()
//     super.draw();

//     // draw our NPCs
//     drawSprite(this.npc1.sprite);

//     // When you have multiple NPCs, you can add them to an array and have a function 
//     // iterate through it to call this function for each more concisely.
//     this.npc1.displayInteractPrompt(playerAvatar);

//     // this.npc2.interactionIndex === 3
//     // start game
//     if(this.npc2.interactionIndex === 3){
//       this.npc1.resetInteraction();
//     }
//   }

//   // custom code here to do stuff upon exiting room
//   unload() {
//     // reset NPC interaction to beginning when entering room
//     this.npc1.resetInteraction();
//   }

//   // custom code here to do stuff upon entering room
//   load() {
//     // pass to PNGRoom to load image
//     super.load();
    
//     // Add custom code here for unloading
//   }

//   keyPressed() {
//     if(key === ' ') {
//       if(this.npc1.isInteracting(playerAvatar)) {
//         this.npc1.continueInteraction();
//       }
//     }
//   }
// }

// class TemplateScreen extends PNGRoom {
//   preload() {
//   }

//   draw() {
//     super.draw();
//   }
// }