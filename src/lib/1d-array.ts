import { State } from '../game';

export const getNeighbours = (
  cells: { state: State; x: number; y: number }[],
  idx: number,
  width: number,
  height: number,
  mode = 8,
) => {
  return [
    idx - width, // north
    idx - width + 1, // northeast
    idx + 1, // east
    idx + 1 + width, // southeast
    idx + width, // south
    idx - 1 + width, // southwest
    idx - 1, // west
    idx - 1 - width, // northwest
  ].filter(idx => cells[idx] != null && cells[idx].state === State.Live).length;
};
