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
    this.player = new Player(this, 100, this.canvas.height / 2);
    this.items = [];
    this.addItem();
    this.loop();
  }

  addItem() {
    const itemX = Math.random() * this.canvas.width; // position of the items is generated randomly
    const itemY = Math.random() * this.canvas.height;
    const anItem = new Item(this, itemX, itemY);
    this.items.push(anItem);
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
    this.items.forEach((item) => {
      item.runLogic();
    }); // run the logic for every item in the array items
    this.collectGarbage(); // makes the items disappear that we don't use anymore for performance reasons
  }

  collectGarbage() {
    const ground = this.canvas.height - 150; // const ground so the items are destroyed as soon as they touch the ground
    this.items.forEach((item, index) => {
      if (item.x < 0 || item.y > ground) {
        this.items.splice(index, 1); //mutates the array. 1 -> the number of elements
      }
    });
  }

  clearScreen() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // function to clear the screen
  }

  paint() {
    // executes paint method for all elements bound to the game object
    this.clearScreen(); //first clear the screen
    this.paintBackground(); //then paint the background
    this.player.paint(); // paint the player
    this.items.forEach((item) => {
      item.paint();
    }); // and paint each items
  }

  paintBackground() {
    this.context.drawImage(oceanBackground, 0, 0, 1000, 500);
  }
}
