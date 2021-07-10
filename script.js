// these 2 lines are always needed: The canvas is initially blank. To display something, a script first needs to access the rendering context and draw on it. The <canvas> element has a method called getContext(), used to obtain the rendering context and its drawing functions. getContext() takes one parameter, the type of context. For 2D graphics, such as those we will cover on this course, we specify “2d” to get a CanvasRenderingContext2D.
// The first line in the script retrieves the node in the DOM representing the <canvas> element by calling the document.getElementById() method. Once you have the element node, you can access the drawing context using its getContext() method.

const canvasElement = document.querySelector('canvas');
const context = canvasElement.getContext('2d');

const screenStartElement = document.getElementById('screen-start');
const screenPlayingElement = document.getElementById('screen-playing');
const screenGameOverElement = document.getElementById('screen-game-over');

const screenElements = {
  start: screenStartElement,
  playing: screenPlayingElement,
  gameOver: screenGameOverElement
};

const game = new Game(canvasElement, screenElements);

const startButton = screenStartElement.querySelector('button');
const tryAgainButton = screenGameOverElement.querySelector('button');

startButton.addEventListener('click', () => {
  game.start();
});

tryAgainButton.addEventListener('click', () => {
  game.start();
});
