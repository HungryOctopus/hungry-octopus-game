const oceanBackground = new Image();
oceanBackground.src = './images/ocean-parallax.png';
let oceanBackgroundX = 0;
let oceanBackground2X = 1920;
let oceanBackgroundY = 0;

let bubblesAudio = new Audio('./sound/bubbles.mp3');
let eatingAudio = new Audio('./sound/eating.mp3');
let screamAudio = new Audio('./sound/scream.mp3');

class Game {
  constructor(canvas, screens) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.running = false; // to set the game over function
    this.enableControls();
    this.screens = screens;
    this.background = new Background(this);
  }

  displayScreen(name) {
    const screenThatShouldBeDisplayed = this.screens[name];
    const screensThatShouldBeHidden = Object.values(this.screens).filter(
      (screen) => screen !== screenThatShouldBeDisplayed
    );
    screenThatShouldBeDisplayed.style.display = '';
    for (const screen of screensThatShouldBeHidden)
      screen.style.display = 'none';
  }

  start() {
    if (this.running) {
      return;
    }
    const ground = this.canvas.height - 130; // the octopus is on the ground
    this.running = true; // game doesn't run before the start
    this.lastItemCreationTimestamp = 0; // to avoid the items to be too near to each other
    this.itemCreationInterval = 2000; // 2 seconds between the creation of 2 items
    this.beginningTime = Date.now(); // time where the game has begun
    this.score = 100;
    this.enableControls();
    this.player = new Player(this, 100, ground);
    this.jellyfishArray = [];
    this.fishArray = [];
    this.trashArray = [];
    this.loop();
    this.displayScreen('playing');
  }

  enableControls() {
    window.addEventListener('keydown', (event) => {
      // to enable the control of the octopus via the keyboard
      const key = event.key;
      switch (key) {
        case 'ArrowUp':
          event.preventDefault(); // to prevent the browser to scroll
          this.player.accelerationY = -0.1;
          break;
        case 'ArrowDown':
          event.preventDefault();
          this.player.accelerationY = +0.1;
          break;
        case 'ArrowLeft':
          event.preventDefault();
          this.player.accelerationX = -0.1;
          break;
        case 'ArrowRight':
          event.preventDefault();
          this.player.accelerationX = +0.1;
          break;
        case ' ':
          event.preventDefault();
          this.player.speedY -= 1;
          break;
      }
    });
    window.addEventListener('keyup', (event) => {
      const key = event.key;
      switch (key) {
        case 'ArrowUp':
        case 'ArrowDown':
          this.player.accelerationY = 0;
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          this.player.accelerationX = 0;
          break;
      }
    });
  }

  addJellyfish() {
    const jellyfishX = this.canvas.width;
    const jellyfishY = Math.random() * this.canvas.height; // position of the items is generated randomly but comes from the right
    const jellyfish = new Jellyfish(this, jellyfishX, jellyfishY);
    this.jellyfishArray.push(jellyfish);
  }

  addFish() {
    const fishX = 30;
    const fishY = Math.random() * this.canvas.height; // position of the fish is generated randomly but comes from the left
    const fish = new Fish(this, fishX, fishY, 40, 40);
    this.fishArray.push(fish);
  }

  addTrash() {
    const trashX = Math.random() * this.canvas.width; // position of the trash is generated randomly but comes from the top
    const trashY = 0;
    const trash = new Trash(this, trashX, trashY, 40, 40);
    this.trashArray.push(trash);
  }

  // collision detection
  checkCollisions() {
    const player = this.player;
    this.jellyfishArray.forEach((item, index) => {
      if (item.checkIntersection(this.player)) {
        this.jellyfishArray.splice(index, 1); // remove the item
        this.score += 10;
        bubblesAudio.play();
      }
    });
    this.fishArray.forEach((item, index) => {
      if (item.checkIntersection(this.player)) {
        this.fishArray.splice(index, 1); // remove the item
        this.score += 30; 
        eatingAudio.play();
      }
    });

    this.trashArray.forEach((trash, index) => {
      if (trash.checkIntersection(this.player)) {
        this.trashArray.splice(index, 1); // remove the trash
        this.score -= 20;
        screamAudio.play();
      }
    });
  }

  loop() {
    this.runLogic();
    this.paint();
    if (this.running) {
      // condition to the loop: if game over, it stops
      window.requestAnimationFrame(() => {
        this.loop();
      });
    }
  }

  runLogic() {
    const currentTimestamp = Date.now();
    if (
      currentTimestamp - this.lastItemCreationTimestamp >
      this.itemCreationInterval // if the last time we created an item is more than 3 seconds ago
    ) {
      this.addJellyfish(); // then create an item
      this.lastItemCreationTimestamp = currentTimestamp; // and set the last item creation timestamp to the current timestamp
      this.itemCreationInterval++;
    }

    if (Math.random() < 0.001) {
      this.addFish();
    }

    if (Math.random() < 0.01) {
      this.addTrash();
    }
    //  execute runLogic method for all elements bound to the game objet: player and items
    this.player.runLogic();
    this.checkCollisions(); //collision detection
    this.jellyfishArray.forEach((item) => {
      item.runLogic();
    });
    this.fishArray.forEach((item) => {
      item.runLogic();
    });
    this.trashArray.forEach((trash) => {
      trash.runLogic();
    }); // run the logic for every item in the array items
    this.background.runLogic();

    this.collectGarbage(); // makes the items disappear that we don't use anymore for performance reasons
    if (this.score <= 0) {
      this.lose();
    }
  }

  lose() {
    // what happens when the score gets below 0
    this.running = false;
    this.displayScreen('gameOver');
  }

  collectGarbage() {
    // for the items that are not visible anymore on screen
    const ground = this.canvas.height - 130; // const ground so the items are destroyed as soon as they touch the ground
    this.jellyfishArray.forEach((item, index) => {
      if (
        item.x < 0 ||
        item.x > this.canvas.width ||
        item.y > ground ||
        item.y < 0
      ) {
        this.jellyfishArray.splice(index, 1); //mutates the array. 1 -> the number of elements
      }
    });
    this.fishArray.forEach((item, index) => {
      if (
        item.x < 0 ||
        item.x > this.canvas.width ||
        item.y > ground ||
        item.y < 0
      ) {
        this.fishArray.splice(index, 1); //mutates the array. 1 -> the number of elements
      }
    });
    this.trashArray.forEach((item, index) => {
      if (
        item.x < 0 ||
        item.x > this.canvas.width ||
        item.y > ground ||
        item.y < 0
      ) {
        this.trashArray.splice(index, 1); //mutates the array. 1 -> the number of elements
      }
    });
  }

  clearScreen() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // function to clear the screen
  }

  paintScore() {
    let scoreContainer = document.getElementById('score');
    scoreContainer.innerHTML = `Score: ${game.score}`;

    // let pointsJellyfishContainer = document.getElementById('pointsJellyfish');
    //  pointsJellyfishContainer.innerHTML = `Jellyfish: ${this.items.itemScore}`; <-- what should be written there?
  }

  paint() {
    // executes paint method for all elements bound to the game object
    this.clearScreen(); //first clear the screen
    if (this.running) {
      this.background.paint();
      // this.paintBackground(); //then paint the background
      // this.horizontalScrolling();
      this.player.paint(); // paint the player
      this.jellyfishArray.forEach((item) => {
        item.paint(); // paint each items
      });
      this.fishArray.forEach((item) => {
        item.paint(); // paint each items
      });
      this.trashArray.forEach((trash) => {
        trash.paint(); // and paint each trash
      });
      this.paintScore();
    }
  }
}
