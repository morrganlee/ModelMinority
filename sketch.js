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

//tester subclass
var auntie;
var tech2;
var tech3;
var tech4;
var tech5;
var tech6;
var mom;
var dad;
var protest;
var activist;

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects

// keycods for W-A-S-D
const W_KEY = 87;
const S_KEY = 83;
const D_KEY = 68;
const A_KEY = 65;

//---

//-- MODIFY THIS for different speeds
var speed = 5;

//--- Your globals would go here
// 0 = down | 1 = up | 2 = left | 3 = right
var direction = 0;
var front;
var back;
var side;


// Allocate Adventure Manager with states table and interaction tables
function preload() {
  //--- TEMPLATE STUFF: Don't change
  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');
  //---

  // direction avatar
  front = loadImage('assets/frontstill-01.png');
  back = loadImage('assets/backstill-01.png');
  side = loadImage('assets/sidestill-01.png');

  // npc placeholders
  auntie = loadImage('assets/npc-auntie.png');
  tech2 = loadImage('assets/npc-tech2.png');
  tech3 = loadImage('assets/npc-tech3.png');
  tech4 = loadImage('assets/npc-tech4.png');
  tech5 = loadImage('assets/npc-tech5.png');
  tech6 = loadImage('assets/npc-tech6.png');
  mom = loadImage('assets/npc-mom.png');
  dad = loadImage('assets/npc-dad.png');
  activist = loadImage('assets/npc-activist.png');
  protest = loadImage('assets/npc-protest.png');

}

// Setup the adventure manager
function setup() {
  createCanvas(1280, 800);

  //--- TEMPLATE STUFF: Don't change
  // setup the clickables = this will allocate the array
  clickables = clickablesManager.setup();
  //---

  // MODIFY THIS: change to initial position
  playerAvatar = new Avatar("Player", 200, 450);
   
  // MODIFY THIS: to make your avatar go faster or slower
  playerAvatar.setMaxSpeed(20);

  // MODIFY THIS: add your filenames here, right now our moving animation and standing animation are the same
  playerAvatar.sprite.addImage('front', front);
  playerAvatar.sprite.addAnimation('front-walking', 'assets/front-01.png', 'assets/front-03.png');
  playerAvatar.sprite.addImage('back', back);
  playerAvatar.sprite.addAnimation('back-walking', 'assets/back-01.png', 'assets/back-02.png');
  playerAvatar.sprite.addImage('side', side);
  playerAvatar.sprite.addAnimation('side-walking', 'assets/side-01.png', 'assets/side-02.png');

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
  textFont('roc-grotesk');

  // NEW: line for debugging
  adventureManager.changeState("Tech1");
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

    // this is a function of p5.play, not of this sketch
    drawSprite(playerAvatar.sprite);
    //--
  } 

  avatarReset()
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

// Matt's code:
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
    playerAvatar.sprite.velocity.x = -speed;
  }
  else {
    checkDirection();
    playerAvatar.sprite.velocity.x = 0;
  }


  if(keyIsDown(DOWN_ARROW) || keyIsDown(S_KEY)) {
    playerAvatar.sprite.mirrorX(1);
    playerAvatar.sprite.changeAnimation('front-walking');
    direction = 0;
    playerAvatar.sprite.velocity.y = speed;

  }
  else if(keyIsDown(UP_ARROW) || keyIsDown(W_KEY)) {
    playerAvatar.sprite.mirrorX(1);
    playerAvatar.sprite.changeAnimation('back-walking');
    direction = 1;
    playerAvatar.sprite.velocity.y = -speed;
  }
  else {
    playerAvatar.sprite.velocity.y = 0;
  }
}

function checkDirection() {
  if (direction === 0 ) {
    playerAvatar.sprite.changeImage(front);
  } else if (direction === 1 ) {
    playerAvatar.sprite.changeImage(back);
  } else {
    playerAvatar.sprite.changeImage(side);
  } 
}

// end of matt's code

//-- MODIFY THIS: this is an example of how I structured my code. You may
// want to do it differently
function mouseReleased() {
  if( adventureManager.getStateName() === "Splash") {
    adventureManager.changeState("Instructions");
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
    clickables[i].textColor = "#CA2B30";
    clickables[i].textSize = 30;
    clickables[i].width = 100;
  }
}
//--

//-- MODIFY THIS:
// tint when mouse is over
clickableButtonHover = function () {
  this.textcolor = "#7FB069";
  this.noTint = false;
  this.tint = "#F8F5F2";
}

//-- MODIFY THIS:
// color a light gray if off
clickableButtonOnOutside = function () {
  // backto our gray color
  this.textcolor = "#7FB069";
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
class InstructionsScreen extends PNGRoom {
  preload() {
    // define class varibles here, load images or anything else
    this.npc1 = new NPC("MomInstruction", width/3, 450, 'assets/npc-mom.png');
    this.npc1.addSingleInteraction("Why don\'t you visit home?");
    this.npc1.addSingleInteraction("Do you not love us?");
    this.npc1.addSingleInteraction("Keep moving. Why are you just standing here.");

    // setup flag, seto false
    this.hasSetup = false;
  }

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
    // load sprites from advanced avatar class
    // this.door = new StaticSprite("Door", 900, 700, 'assets/door.png');
    //MAKE SURE TO PUT CODE IN CHECK OVERLAPS
    
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our code adter this
  draw() {
    // this calls PNGRoom.draw()
    
    super.draw();

    // Add your code here
    image(auntie, width/2, height/3, 100, 324);
  }
}

class Tech1Room extends PNGRoom {
  preload() {
    // define class varibles here, load images or anything else
    this.npc1 = new NPC("Ceo", width/3, height/2, 'assets/npc-ceo.png');
    this.npc1.addSingleInteraction("Hello, I\'m Richard!");
    this.npc1.addSingleInteraction("I\'m the manager of this divison.");
    this.npc1.addSingleInteraction("At WIREnet, we value diversity.");
    this.npc1.addSingleInteraction("Feel free to walk around and talk to everyone!");

    this.npc2 = new NPC("Tech1", width - 400, height/2, 'assets/npc-tech1.png');
    // this.npc2.addStandingAnimation('assets/sun1.png', 'assets/sun3.png');
    this.npc2.addSingleInteraction("Hello! I\'m Alan, I just started working here.");
    this.npc2.addSingleInteraction("I graduated suma cum laude last year.");
    this.npc2.addSingleInteraction("I was also president of my campus' Asian Scholar Association.");
    this.npc2.addSingleInteraction("I\'m excited to see how I progress in a few years!");
    
    //this.npc2.setupQuest("Star", "Thanks! This is just what I needed", "I didn't ask for that!");

    
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
      this.npc1.setPromptLocation(0,-100);
      
      // setup NPC 2
      this.npc2.setup();
      this.npc2.setPromptLocation(0,-100);

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
    // define class varibles here, load images or anything else
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our code adter this
  draw() {
    // this calls PNGRoom.draw()
    super.draw();

    // Add your code here
    image(tech2, width/3, height/2);
    image(tech3, width - 500, height/2);
    image(tech4, width/2, height/2);
  }
}

class Tech3Room extends PNGRoom {
  preload() {
    // define class varibles here, load images or anything else
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our code adter this
  draw() {
    // this calls PNGRoom.draw()
    super.draw();

    // Add your code here
    image(tech5, width/3, height/2);
    image(tech6, width - 500, height/2);
  }
}

class InHomeRoom extends PNGRoom {
  preload() {
    // define class varibles here, load images or anything else
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our code adter this
  draw() {
    // this calls PNGRoom.draw()
    super.draw();

    // Add your code here
    image(mom, width/3, height/3);
    image(dad, width/2, height/3);
  }
}

class ProtestRoom extends PNGRoom {
  preload() {
    // define class varibles here, load images or anything else
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our code adter this
  draw() {
    // this calls PNGRoom.draw()
    super.draw();

    // Add your code here
    imageMode(CENTER);
    image(protest, width/2, height - 330);
    image(activist, width - 200, height/3);
  }
}

//-- MODIFY THIS: for your own classes
// (1) copy this code block below
// (2) paste after //-- done copy
// (3) Change name of TemplateScreen to something more descriptive, e.g. "PuzzleRoom"
// (4) Add that name to the adventureStates.csv file for the classname for that appropriate room
class TemplateScreen extends PNGRoom {
  preload() {
    // define class varibles here, load images or anything else
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our code adter this
  draw() {
    // this calls PNGRoom.draw()
    super.draw();

    // Add your code here
  }
}
//-- done copy

