const jellyfish = new Image();
jellyfish.src = './images/jellyfish.png';

const plasticbottle = new Image();
plasticbottle.src = './images/plasticbottle.png';

class Item {
  constructor(game, x, y, width, height) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
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
    this.x--;
    this.y++;
  }

  paint() {
    //responsible for painting the items on the screen
    const context = this.game.context;
    context.save();

    // this.game.context.fillRect(this.x, this.y, 25, 25); // items are squares for now, later to be replaced with images

    context.drawImage(
      jellyfish,
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    context.restore();
  }
}

class Trash extends Item {
  constructor(game, x, y, width, height) {
    super(game, x, y, 25, 45); // do these values for width and height change anything?
  }

  runLogic() {
    super.runLogic();
    //responsible for the logic movements of the items
    this.x--;
    this.y++;
  }

  paint() {
    super.paint();
    context.save();
    context.drawImage(
      plasticbottle,
      this.x - this.width / 2,
      this.y - this.height / 2,
      20, // these values should be changed
      35
    );

    //context.fillStyle = 'red';
    //this.game.context.fillRect(this.x, this.y, 40, 40);
    context.restore();
  }
}
