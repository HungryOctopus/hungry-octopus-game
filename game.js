const oceanBackground = new Image();
oceanBackground.src = './images/ocean-background.png';

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    //this.screens = screens;
    //this.loop();
  }

  start() {
    const ground = this.canvas.height - 130; // the octopus is on the ground
    this.score = 100;
    this.enableControls();
    this.player = new Player(this, 100, ground);
    this.items = [];
    this.addItem();
    this.loop();
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
      }
    });
  }

  addItem() {
    const itemX = Math.random() * this.canvas.width; // position of the items is generated randomly
    const itemY = Math.random() * this.canvas.height;
    const item = new Item(this, itemX, itemY);
    this.items.push(item);
  }

  // collision detection
  checkCollisionBetweenPlayerAndItems() {
    const player = this.player;
    this.items.forEach((item, index) => {
      if (item.checkIntersection(this.player)) {
        this.items.splice(index, 1); // remove the item
        this.score += 10;
      }
    });
  }

  loop() {
    window.requestAnimationFrame(() => {
      this.runLogic();
      this.paint();
      this.loop();
    });
  }

  runLogic() {
    if (Math.random() < 0.02) {
      this.addItem();
    }
    // execute runLogic method for all elements bound to the game objet: player and items
    this.player.runLogic();
    this.checkCollisionBetweenPlayerAndItems(); //collision detection
    this.items.forEach((item) => {
      item.runLogic();
    }); // run the logic for every item in the array items

    this.collectGarbage(); // makes the items disappear that we don't use anymore for performance reasons
  }

  collectGarbage() {
    const ground = this.canvas.height - 130; // const ground so the items are destroyed as soon as they touch the ground
    this.items.forEach((item, index) => {
      if (item.x < 0 || item.y > ground) {
        this.items.splice(index, 1); //mutates the array. 1 -> the number of elements
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

  paint() {
    // executes paint method for all elements bound to the game object
    this.clearScreen(); //first clear the screen
    this.paintBackground(); //then paint the background
    this.player.paint(); // paint the player
    this.items.forEach((item) => {
      item.paint(); // and paint each items
    });
    this.paintScore();
  }

  paintBackground() {
    this.context.drawImage(oceanBackground, 0, 0, 1000, 500);
  }
}
