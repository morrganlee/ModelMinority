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
  // adventureManager.changeState("Street3");
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
    // define class varibles here, load images or anything else
    this.npc1 = new NPC("Auntie", width/2 - 10, height/2 + 50, 'assets/npc-auntie.png');
    this.npc1.addSingleInteraction("Hello sweetie!");
    this.npc1.addSingleInteraction("It\'s been so long since I\'ve seen you!");
    this.npc1.addSingleInteraction("You look like you\'ve been eating a lot...");
    this.npc1.addSingleInteraction("Getting a little chubby are we?");
    this.npc1.addSingleInteraction("Your skin is so much darker too.");
    this.npc1.addSingleInteraction("Do you have a boyfriend yet?");
    this.npc1.addSingleInteraction("Are you getting good grades?");
    this.npc1.addSingleInteraction("Have you seen Vivian? She\'s fat now.");
    this.npc1.addSingleInteraction("But you should be more like her,");
    this.npc1.addSingleInteraction("she has a boyfriend and a good job.");
    this.npc1.addSingleInteraction("Why does you Chinese sound so bad?");
    this.npc1.addSingleInteraction("You need to remember your roots...");
    this.npc1.addSingleInteraction("Oh you have to go? Okay sweetie,");
    this.npc1.addSingleInteraction("Say hi to your mom and dad for me,");
    this.npc1.addSingleInteraction("you should come over for dinner!");
    this.npc1.addSingleInteraction("You need to eat more.");
    
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
    this.npc1.addSingleInteraction("Hello, I\'m Richard!");
    this.npc1.addSingleInteraction("I\'m the manager of this divison.");
    this.npc1.addSingleInteraction("At WIREnet, we value diversity.");
    this.npc1.addSingleInteraction("Feel free to walk around and talk to everyone!");

    this.npc2 = new NPC("Tech1", width - 400, height/2, 'assets/npc-tech1.png');
    this.npc2.addSingleInteraction("Hello! I\'m Alan, I just started working here.");
    this.npc2.addSingleInteraction("I graduated summa cum laude last year.");
    this.npc2.addSingleInteraction("I was also president of the Asian Scholar Association.");
    this.npc2.addSingleInteraction("I\'m excited to see how I progress in the future!");
    
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
    // define class varibles here, load images or anything else
    this.npc1 = new NPC("Tech2", 255, 330, 'assets/npc-tech2.png');
    this.npc1.addSingleInteraction("Hi, I'm Paul.");
    this.npc1.addSingleInteraction("Sorry I can\'t talk for long.");
    this.npc1.addSingleInteraction("I had to pick up more hours this month.");
    this.npc1.addSingleInteraction("My wife's nail salon job doesn\'t pay much.");

    this.npc2 = new NPC("Tech3", width - 500, height/2, 'assets/npc-tech3.png');
    this.npc2.addSingleInteraction("Are you visiting?");
    this.npc2.addSingleInteraction("Did you meet Alan at the front?");
    this.npc2.addSingleInteraction("I feel bad for that kid.");
    this.npc2.addSingleInteraction("That was me like 20 years ago,");
    this.npc2.addSingleInteraction("I\'ve never gotten anything more than a raise.");
    this.npc2.addSingleInteraction("People like us won\'t be CEO anytime soon.");

    this.npc3 = new NPC("Tech4", width- 255, 330, 'assets/npc-tech4.png');
    this.npc3.addSingleInteraction("Hi, I\'m Don,");
    this.npc3.addSingleInteraction("Sorry about Greg, he is a little jaded.");
    this.npc3.addSingleInteraction("I believe there will be change!");
    this.npc3.addSingleInteraction("We just need to be grateful for");
    this.npc3.addSingleInteraction("the opportunities we have now.");
    
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
    // define class varibles here, load images or anything else
    this.npc1 = new NPC("Tech5", 255, 330, 'assets/npc-tech5.png');
    this.npc1.addSingleInteraction("Hey, I'm Philip.");
    this.npc1.addSingleInteraction("Can I ask you a question... as a woman?");
    this.npc1.addSingleInteraction("Is the pay gap really real?");
    this.npc1.addSingleInteraction("Because Asian-Americans make more");
    this.npc1.addSingleInteraction("than white people on average.");
    this.npc1.addSingleInteraction("We work so hard...");
    this.npc1.addSingleInteraction("All minorities should be like us.");

    this.npc2 = new NPC("Tech6", width - 500, height/2, 'assets/npc-tech6.png');
    this.npc2.addSingleInteraction("I\'m really lucky,");
    this.npc2.addSingleInteraction("I was able to come here and go to college");
    this.npc2.addSingleInteraction("that\'s how I got this job.");
    this.npc2.addSingleInteraction("I send a lot of my paycheck back");
    this.npc2.addSingleInteraction("home to support my family.");
    
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
      else if(this.npc2.isInteracting(playerAvatar)) {
        this.npc2.continueInteraction();
      }
    }
  }
}

class InHomeRoom extends PNGRoom {
  preload() {
    // define class varibles here, load images or anything else
    this.npc1 = new NPC("Mom", 200, 500, 'assets/npc-mom.png');
    this.npc1.addSingleInteraction("I could\'t get groceries today");
    this.npc1.addSingleInteraction("There was a protest on the road.");
    this.npc1.addSingleInteraction("It was scary, so many people.");
    this.npc1.addSingleInteraction("They were yelling so loud...");
    this.npc1.addSingleInteraction("making my life harder.");
    this.npc1.addSingleInteraction("Why do they need to do that?");
    this.npc1.addSingleInteraction("Why can\'t they just behave.");

    this.npc2 = new NPC("Dad", width/2, height/3, 'assets/npc-dad.png');
    this.npc2.addSingleInteraction("What\'s this on the TV?");
    this.npc2.addSingleInteraction("When we first moved here,");
    this.npc2.addSingleInteraction("we didn\'t have to do all this.");
    this.npc2.addSingleInteraction("What do you mean that\'s not right?");
    
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

    // start game
    if(this.npc2.interactionIndex === 3){
        drawHomeGrabbables();
    }
  }

  drawHomeGrabbables(){

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

class ProtestRoom extends PNGRoom {
  preload() {
    // define class varibles here, load images or anything else
    this.npc1 = new NPC("Activist", width-200, 330, 'assets/npc-activist.png');
    this.npc1.addSingleInteraction("Hi! Did you just get here?");
    this.npc1.addSingleInteraction("My name is Jackie, nice to meet you.");
    this.npc1.addSingleInteraction("Thanks for bringing all these signs!");
    this.npc1.addSingleInteraction("It is so amazing to see everyone here,");
    this.npc1.addSingleInteraction("I\'m so tired of hearing how we have");
    this.npc1.addSingleInteraction("to be quiet and listen to every rule.");
    this.npc1.addSingleInteraction("Today\'s protest is to call for more");
    this.npc1.addSingleInteraction("detailed race questions on the census.");
    this.npc1.addSingleInteraction("This will help us break the model-");
    this.npc1.addSingleInteraction("minority myth, so that\'s why you\'ll");
    this.npc1.addSingleInteraction("see other signs here.");
    this.npc1.addSingleInteraction("Hope to see you around!");

    this.npc2 = new NPC("Protest", width/3, height-250, 'assets/npc-protest.png');
    this.npc2.addSingleInteraction("STOP ASIAN HATE");
    this.npc2.addSingleInteraction("WE WANT A MORE DETAILED CENSUS");
    this.npc2.addSingleInteraction("NOT YOUR MODEL MINORITY");
    this.npc2.addSingleInteraction("YELLOW PERIL FOR BLACK LIVES");
    this.npc2.addSingleInteraction("WE ARE NOT ALL THE SAME");
    
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
      else if(this.npc2.isInteracting(playerAvatar)) {
        this.npc2.continueInteraction();
      }
    }
  }
  //   image(protest, width/2, height - 330);
  //   image(activist, width - 200, height/3);
  // }
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

