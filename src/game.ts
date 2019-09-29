import { getResolution } from './lib/screen';
import { getNeighbours } from './lib/1d-array';

const seed = (arr: Cell[]) => {
  const idx = Math.floor(Math.random() * arr.length);
  arr[idx].state = State.Live;

  return idx;
};

const GAME_WIDTH = 320;
const GAME_HEIGHT = 180;
const SEED_ITERATIONS = 1;

const canvas = document.createElement('canvas') as HTMLCanvasElement;
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

export enum State {
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

type Cell = {
  x: number;
  y: number;
  state: State;
};

const cells: Cell[] = [];
const next: Cell[] = [];

for (let y = 0; y < GAME_HEIGHT; ++y) {
  for (let x = 0; x < GAME_WIDTH; ++x) {
    cells.push({
      x,
      y,
      state: State.Dead,
    });

    next.push({
      x,
      y,
      state: State.Dead,
    });
  }
}

// for (let i = 0; i < SEED_ITERATIONS; ++i) {
//   rnd = seed(cells);
// }

let dt = 0;
let last = performance.now();
const fps = 10;
const step = 1 / fps;

console.log("Conway's Game of Life");

// for (const [idx, { state }] of cells.entries()) {
//   // console.log(gn(idx, GAME_WIDTH, GAME_HEIGHT));
//   console.log(idx);
// }

// function frame(hrt: DOMHighResTimeStamp) {
//   requestAnimationFrame(frame);

//   dt += (hrt - last) / 1000;

//   if (dt > step) {
//     dt = 0;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = 'white';

//     for (const [idx, cell] of cells.entries()) {
//       const liveNeighbourCount = getNeighbours(
//         cells,
//         idx,
//         GAME_WIDTH,
//         GAME_HEIGHT,
//       );

//       /**
//        * Any live cell with fewer than two live neighbours dies, as if by underpopulation.
//        * Any live cell with two or three live neighbours lives on to the next generation.
//        * Any live cell with more than three live neighbours dies, as if by overpopulation.
//        * Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
//        */

//       // Write to `next` state
//       if (cell.state === State.Dead) {
//         if (liveNeighbourCount === 3) {
//           next[idx].state = State.Live;
//         }
//       } else if (cell.state === State.Live) {
//         if (liveNeighbourCount < 2 || liveNeighbourCount > 3) {
//           next[idx].state = State.Dead;
//         }
//       }
//     }

//     // Assign next state and draw
//     for (const [idx, { x, y, state }] of next.entries()) {
//       cells[idx] = next[idx];

//       if (state === State.Live) {
//         ctx.fillRect(x, y, 1, 1);
//       }
//     }
//   }

//   last = hrt;
// }

// requestAnimationFrame(frame);

setInterval(() => {
  const rnd = Math.floor(Math.random() * GAME_HEIGHT * GAME_WIDTH);

  ctx.fillStyle = 'red';
  ctx.fillRect(cells[rnd].x, cells[rnd].y, 1, 1);
  ctx.fillStyle = 'white';
  getNeighbours(cells, rnd, GAME_WIDTH, GAME_HEIGHT).forEach(
    idx => cells[idx] && ctx.fillRect(cells[idx].x, cells[idx].y, 1, 1),
  );
}, 250);
