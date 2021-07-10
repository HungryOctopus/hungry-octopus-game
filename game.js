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
    setInterval(() => {});
    this.paint();
  }

  paint() {
    this.paintBackground();
    //this.context.fillRect(100, 100, 200, 200);
  }

  paintBackground() {
    this.context.drawImage(oceanBackground, 0, 0, 1000, 500);
  }
}
