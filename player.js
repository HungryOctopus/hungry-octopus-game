const octopus = new Image();
octopus.src = './images/octoplayer-alone.png';

class Player {
  constructor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 80;
    this.speedX = 0;
    this.speedY = 0;
    this.accelerationX = 0;
    this.accelerationY = 0;
  }

  runLogic() {
    this.speedX += this.accelerationX;
    this.speedY += this.accelerationY;

    const resistance = 0.05;

    if (this.speedX > 0) {
      this.speedX -= resistance;
    } else if (this.speedX < 0) {
      this.speedX += resistance;
    }

    if (this.speedY > 0) {
      this.speedY -= resistance;
    } else if (this.speedY < 0) {
      this.speedY += resistance;
    }

    this.x += this.speedX;
    this.y += this.speedY;
  }

  paint() {
    const context = this.game.context;
    context.save();
    context.drawImage(
      octopus,
      this.x - this.width / 5,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    context.restore();
  }
}
