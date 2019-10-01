import { State } from '../game';
import { clamp } from './math';

const GAME_WIDTH = parseInt(process.env.GAME_WIDTH!);
const GAME_HEIGHT = parseInt(process.env.GAME_HEIGHT!);

export const getNeighbours = (idx: number, width: number, size: number) =>
  [
    idx - width, // north
    idx - width + 1, // northeast
    idx + 1, // east
    idx + 1 + width, // southeast
    idx + width, // south
    idx - 1 + width, // southwest
    idx - 1, // west
    idx - 1 - width, // northwest
  ].filter(idx => clamp(idx, 0, size - 1) === idx);

export const populateLookup = (
  cells: number[],
  width: number,
  height: number,
): number[][] =>
  cells.map((_val, idx) => getNeighbours(idx, width, width * height));

console.time('populateLookup');
export const lookup = populateLookup(
  new Array(GAME_WIDTH * GAME_HEIGHT).fill(0),
  GAME_WIDTH,
  GAME_HEIGHT,
);
console.timeEnd('populateLookup');

export const getLiveNeighbourCount = (
  cells: { state: State }[],
  idx: number,
): number => lookup[idx].filter(idx => cells[idx].state === State.Live).length;
