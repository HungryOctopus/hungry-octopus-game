const octopus = new Image();
octopus.src = './images/full_octo_swim.png';

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
    this.frame = 0;
  }

  runLogic() {
    this.speedX += this.accelerationX;
    this.speedY += this.accelerationY;

    let resistance = 0.02;

    this.speedY /= 1 + resistance;
    this.speedX /= 1 + resistance;

    this.x += this.speedX;
    this.y += this.speedY;

    // hard limits: end of the canvas

    //const playerTop = this.y + this.height / 2;
    //const canvasHeight = this.game.canvas.height; // 500
    //const playerBottom = this.y - this.height / 2;

    const ground = this.game.canvas.height - 130; // 370

    if (this.y >= ground) {
      this.y = ground;
    }

    if (this.x <= 0) {
      this.x = 0;
    }

    if (this.x >= this.game.canvas.width - this.width / 2) {
      this.x = this.game.canvas.width - this.width / 2;
    }

    if (this.y <= this.height / 2) {
      this.y = this.height / 2;
    }
  }

  paint() {
    const context = this.game.context;
    context.save();

    const accelerationX = this.accelerationX;
    const accelereationY = this.accelerationY;

    context.drawImage(
      octopus,
      this.accelerationX || this.accelerationY // if the player is moving (acceleration X and Y are truthy)
        ? 30 + 160 * Math.round(this.frame / 10) // animated frames
        : 30 + 160 * 4, // if not, fixed image 4
      this.accelerationX >= 0 ? 0 : 160, // if the player is going to the right, the first row of the image full octo swim should be shown. Otherwise the second row (+160px)
      155, //width
      160, //height
      this.x - this.width / 5,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    context.restore();
    this.frame++;
    this.frame %= 50; 
  }
}
