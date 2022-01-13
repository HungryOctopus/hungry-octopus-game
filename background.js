const imageLayers = [];

for (let i = 1; i <= 6; i++) {
  imageLayers.push(`./images/background-layers/${i}.png`);
}

const backgroundLayers = imageLayers.map((url) => {
  const image = new Image();
  image.src = url;
  return image;
});

class Background {
  constructor(game) {
    this.game = game;
    this.x = 0;
    this.speed = 2;
  }

  runLogic() {
    this.x += this.speed;
  }

  paint() {
    const context = this.game.context;
    const $canvas = context.canvas;

    const width = $canvas.width * 2;
    const height = $canvas.height;

    const distance = this.game.player.x + this.x;

    for (let i = 0; i < backgroundLayers.length; i++) {
      const layer = backgroundLayers[i];
      const outset = ((distance * i) / 6) % width;
      context.drawImage(layer, -outset, 0, width, height);
      context.drawImage(layer, -outset + width, 0, width, height);
    }
  }
}
