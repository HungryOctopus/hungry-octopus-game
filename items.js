const jellyfish = new Image();
jellyfish.src = './images/jellyfish.png';

const plasticbottle = new Image();
plasticbottle.src = './images/plasticbottle.png';

class Item {
  constructor(game, x, y, width, height, speedX, speedY, image, itemScore) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speedX = speedX;
    this.speedY = speedY;
    this.image = image;
    this.itemScore = itemScore;
  }

  checkIntersection(player) {
    return (
      // if right edge of player is over left edge of item
      player.x + player.width / 2 >= this.x - this.width / 2 &&
      // if left edge of player is below right edge of item
      player.x - player.width / 2 <= this.x + this.width / 2 &&
      // if bottom edge of player is over top edge of item
      player.y + player.height / 2 >= this.y - this.height / 2 &&
      // if top edge of player is below bottom edge of item
      player.y - player.height / 2 <= this.y + this.height / 2
    );
  }

  runLogic() {
    //responsible for the logic movements of the items
    // Math.cos, Math.sin, Math.tan
    // const speedX = this.game.current;
    this.x += this.speedX;
    this.y += this.speedY;
  }

  paint() {
    //responsible for painting the items on the screen
    const context = this.game.context;
    context.save();

    // this.game.context.fillRect(this.x, this.y, 25, 25); // items are squares for now, later to be replaced with images

    context.drawImage(
      this.image,
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    context.restore();
  }
}

class Food extends Item {
  constructor(game, x, y) {
    super(game, x, y, 20, 20, -1, 1, jellyfish, 10);
  }

  runLogic() {
    super.runLogic();
    if (Math.random() < (this.speedY > 0 ? 0.05 : 0.05)) {
      this.speedY *= -1;
    }
  }
}

class Trash extends Item {
  constructor(game, x, y) {
    super(game, x, y, 20, 45, -1, 1, plasticbottle, -20);
  }
}
