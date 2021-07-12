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
    this.lastItemCreationTimestamp = 0; // to avoid the items to be to near to each other
    this.itemCreationInterval = 3000; // 3 seconds between the creation of 2 items
    this.score = 100;
    this.enableControls();
    this.player = new Player(this, 100, ground);
    this.items = [];
    this.trashArray = [];
    this.addItem();
    this.addTrash();
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
        case 'a':
          this.player.y -= 40;
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

  addTrash() {
    const trashX = Math.random() * this.canvas.width; // position of the items is generated randomly
    const trashY = Math.random() * this.canvas.height;
    const trash = new Trash(this, trashX, trashY, 40, 40);
    this.trashArray.push(trash);
  }

  // collision detection
  checkCollisions() {
    const player = this.player;
    this.items.forEach((item, index) => {
      if (item.checkIntersection(this.player)) {
        this.items.splice(index, 1); // remove the item
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
    window.requestAnimationFrame(() => {
      this.loop();
    });
  }

  runLogic() {
    const currentTimestamp = Date.now();
    if (
      currentTimestamp - this.lastItemCreationTimestamp >
      this.itemCreationInterval // if the last time we created an item is more than 3 seconds ago
    ) {
      this.addItem(); // then create an item
      this.lastItemCreationTimestamp = currentTimestamp; // and set the last item creation timestamp to the current timestamp
    }
    if (Math.random() < 0.01) {
      this.addTrash();
    }
    // execute runLogic method for all elements bound to the game objet: player and items
    this.player.runLogic();
    this.checkCollisions(); //collision detection
    this.items.forEach((item) => {
      item.runLogic();
    });
    this.trashArray.forEach((trash) => {
      trash.runLogic();
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

  paint() {
    // executes paint method for all elements bound to the game object
    this.clearScreen(); //first clear the screen
    this.paintBackground(); //then paint the background
    this.player.paint(); // paint the player
    this.items.forEach((item) => {
      item.paint(); // paint each items
    });
    this.trashArray.forEach((trash) => {
      trash.paint(); // and paint each trash
    });
    this.paintScore();
  }

  paintBackground() {
    this.context.drawImage(oceanBackground, 0, 0, 1000, 500);
  }
}
