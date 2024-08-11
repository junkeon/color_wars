import {
  getPlayerCells,
  getPossibleMoves,
  initializeCell,
  selectCell,
} from "./functions";

const BOARD_SIZE = 5;

export const ColorWar = {
  setup: () => ({
    boardSize: BOARD_SIZE,
    cells: Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0)),
  }),

  phases: {
    init: {
      moves: { initializeCell },
      start: true,
      endIf: ({ G }) => {
        const cells = getPlayerCells(G, "1");
        return cells.length === 1;
      },
      next: "spread",
    },
    spread: {
      moves: { selectCell },
    },
  },

  turn: {
    minMoves: 1,
    maxMoves: 1,
  },

  endIf: ({ G, ctx }) => {
    const playerID = ctx.currentPlayer;
    const cells = getPlayerCells(G, playerID);
    if (cells.length === 0 && ctx.turn > 2) {
      return { winner: playerID === "1" ? "0" : "1" };
    }
  },

  ai: {
    enumerate: getPossibleMoves,
  },
};
