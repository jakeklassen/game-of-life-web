import { getResolution } from './lib/screen';

const seed = (arr: number[][], rows = 0, cols = 0) =>
  (arr[Math.floor(Math.random() * rows)][Math.floor(Math.random() * cols)] =
    State.Live);

const GAME_WIDTH = 320;
const GAME_HEIGHT = 180;

const canvas = document.createElement('canvas') as HTMLCanvasElement;
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

enum State {
  Dead = 0,
  Live = 1,
}

const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
ctx.imageSmoothingEnabled = false;

(document.querySelector('#container') as Element).appendChild(canvas);

const resize = () => {
  // Scale canvas to fit window while maintaining 16x9
  const { innerWidth, innerHeight } = window;
  const { width, height, factor } = getResolution(
    innerWidth,
    innerHeight,
    GAME_WIDTH,
    GAME_HEIGHT,
  );

  canvas.style.transform = `scale(${factor})`;
  canvas.style.left = `${innerWidth / 2 - canvas.width / 2}px`;
  canvas.style.top = `${innerHeight / 2 - canvas.height / 2}px`;
};

resize();

window.addEventListener('resize', resize);

// Store adjacent lookup positions
const directions = [
  { x: -1, y: -1 }, // top left
  { x: -1, y: 0 }, // left
  { x: -1, y: 1 }, // bottom left
  { x: 0, y: -1 }, // top
  { x: 0, y: 1 }, // bottom
  { x: 1, y: -1 }, // top right
  { x: 1, y: 0 }, // right
  { x: 1, y: 1 }, // bottom right
];

const cells = Array.from({ length: GAME_HEIGHT }, () =>
  new Array(GAME_WIDTH).fill(0),
);
const next = Array.from({ length: GAME_HEIGHT }, () =>
  new Array(GAME_WIDTH).fill(0),
);

for (let i = 0; i < 5500; ++i) {
  seed(cells, GAME_HEIGHT, GAME_WIDTH);
}

let dt = 0;
let last = performance.now();
const fps = 10;
const step = 1 / fps;

console.log("Conway's Game of Life");

function frame(hrt: DOMHighResTimeStamp) {
  requestAnimationFrame(frame);

  dt += (hrt - last) / 1000;

  if (dt > step) {
    dt = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';

    for (let y = 0; y < cells.length; ++y) {
      for (let x = 0; x < cells[y].length; ++x) {
        const cell = cells[y][x];

        const liveNeighbourCount = directions
          .map(dir => (cells[y + dir.y] ? cells[y + dir.y][x + dir.x] || 0 : 0))
          .filter(value => value === State.Live).length;

        /**
         * Any live cell with fewer than two live neighbours dies, as if by underpopulation.
         * Any live cell with two or three live neighbours lives on to the next generation.
         * Any live cell with more than three live neighbours dies, as if by overpopulation.
         * Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
         */

        // Write to `next` state
        if (cell === State.Dead) {
          if (liveNeighbourCount === 3) {
            next[y][x] = 1;
          }
        } else if (cell === State.Live) {
          if (liveNeighbourCount < 2 || liveNeighbourCount > 3) {
            next[y][x] = 0;
          }
        }
      }
    }

    // Assign next state and draw
    for (let y = 0; y < next.length; ++y) {
      for (let x = 0; x < next[y].length; ++x) {
        cells[y][x] = next[y][x];

        if (cells[y][x] === State.Live) {
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }

  last = hrt;
}

requestAnimationFrame(frame);
