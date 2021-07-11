class Item {
  constructor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
  }

  runLogic() {
    //responsible for the logic movements of the items
    this.x--;
    this.y++;
  }

  paint() {
    //responsible for painting the items on the screen
    this.game.context.fillRect(this.x, this.y, 25, 25); // items are squares for now, later to be replaced with images
  }
}

/* let x = 100;
let y = 100;

setInterval(() => {
  context.clearRect(0, 0, canvasElement.width, canvasElement.height);
  y++;
  context.fillStyle = 'red';
  context.fillRect(x, y, 20, 20);
}, 1000 / 60);
 */
