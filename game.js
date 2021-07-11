const oceanBackground = new Image();
oceanBackground.src = './images/ocean-background.png';

class Game {
  constructor(canvas, screens) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.screens = screens;
    //this.loop();
  }

  start() {
    this.player = new Player(this, 100, this.canvas.height / 2);
    this.loop();
    this.items = [];
  }

  loop() {
    window.requestAnimationFrame(() => {
      this.runLogic;
      this.paint();
      this.loop();
    });
  }

  runLogic() {
    // execute runLogic method for all elements bound to the game objet: player and items
    this.player.runLogic();
  }

  clearScreen() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // function to clear the screen
  }

  paint() {
    // executes paint method for all elements bound to the game object
    this.clearScreen(); //first clear the screen
    this.paintBackground(); //then paint background
    this.player.paint(); //and player
  }

  paintBackground() {
    this.context.drawImage(oceanBackground, 0, 0, 1000, 500);
  }
}
