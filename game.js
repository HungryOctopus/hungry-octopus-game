const oceanBackground = new Image();
oceanBackground.src = './images/ocean-background.png';

class Game {
  constructor(canvas, screens) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.running = false; // to set the game over function
    this.enableControls();
    this.screens = screens;
    //this.loop();
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
    this.lastItemCreationTimestamp = 0; // to avoid the items to be to near to each other
    this.itemCreationInterval = 3000; // 3 seconds between the creation of 2 items
    this.score = 100;
    this.enableControls();
    this.player = new Player(this, 100, ground);
    this.foodArray = [];
    this.trashArray = [];
    this.addFood();
    this.addTrash();
    this.loop();
    this.displayScreen('playing');

    //    this.current = (3 * Math.PI) / 4; // 135deg
  }

  enableControls() {
    window.addEventListener('keydown', (event) => {
      // to enable the control of the octopus via the keyboard
      const key = event.key;
      switch (key) {
        case 'ArrowUp':
          this.player.y -= 10;
          break;
        case 'ArrowDown':
          this.player.y += 10;
          break;
        case 'ArrowLeft':
          this.player.x -= 10;
          break;
        case 'ArrowRight':
          this.player.x += 10;
          break;
        case 'a':
          this.player.y -= 40;
          break;
      }
    });
  }

  addFood() {
    const foodX = Math.random() * this.canvas.width; // position of the items is generated randomly
    const foodY = Math.random() * this.canvas.height;
    const food = new Food(this, foodX, foodY);
    this.foodArray.push(food);
  }

  addTrash() {
    const trashX = Math.random() * this.canvas.width; // position of the items is generated randomly
    const trashY = Math.random() * this.canvas.height;
    const trash = new Trash(this, trashX, trashY, 40, 40);
    this.trashArray.push(trash);
  }

  // collision detection
  checkCollisions() {
    const player = this.player;
    this.foodArray.forEach((item, index) => {
      if (item.checkIntersection(this.player)) {
        this.foodArray.splice(index, 1); // remove the item
        this.score += 10;
      }
    });
    this.trashArray.forEach((trash, index) => {
      if (trash.checkIntersection(this.player)) {
        this.trashArray.splice(index, 1); // remove the trash
        this.score -= 20;
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
      this.addFood(); // then create an item
      this.lastItemCreationTimestamp = currentTimestamp; // and set the last item creation timestamp to the current timestamp
    }
    if (Math.random() < 0.01) {
      this.addTrash();
    }
    // execute runLogic method for all elements bound to the game objet: player and items
    this.player.runLogic();
    this.checkCollisions(); //collision detection
    this.foodArray.forEach((item) => {
      item.runLogic();
    });
    this.trashArray.forEach((trash) => {
      trash.runLogic();
    }); // run the logic for every item in the array items

    this.collectGarbage(); // makes the items disappear that we don't use anymore for performance reasons
    if (this.score < 0) {
      // if the score is below 0, the game freezes
      this.running = false;
      this.lost = true;
      this.displayScreen('gameOver');
    }
  }

  collectGarbage() {
    const ground = this.canvas.height - 130; // const ground so the items are destroyed as soon as they touch the ground
    this.foodArray.forEach((item, index) => {
      if (item.x < 0 || item.y > ground) {
        this.foodArray.splice(index, 1); //mutates the array. 1 -> the number of elements
      }
    });
    this.trashArray.forEach((trash, index) => {
      if (trash.x < 0 || trash.y > ground) {
        this.trashArray.splice(index, 1); //mutates the array. 1 -> the number of elements
      }
    });
  }

  clearScreen() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // function to clear the screen
  }

  paintScore() {
    this.context.font = '24px sans-serif';
    this.context.fillText(`Score: ${this.score}`, 450, 50);
  }

  paintGameOver() {
    this.context.font = '75px sans-serif';
    this.context.fillText(`GAME OVER`, 250, 350);
  }

  paint() {
    // executes paint method for all elements bound to the game object
    this.clearScreen(); //first clear the screen
    if (this.running) {
      this.paintBackground(); //then paint the background
      this.player.paint(); // paint the player
      this.foodArray.forEach((item) => {
        item.paint(); // paint each items
      });
      this.trashArray.forEach((trash) => {
        trash.paint(); // and paint each trash
      });
      this.paintScore();
    }
  }
  /*     if (this.lost) {
      this.paintGameOver();
    }
  } */
  // we don't need it since we have the different screens

  paintBackground() {
    this.context.drawImage(oceanBackground, 0, 0, 1000, 500);
  }
}
