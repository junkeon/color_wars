import { Client } from "boardgame.io/react";
import { TicTacToeBoard } from "./components/Board";
import { TicTacToe } from "./scripts/Game";

const App = Client({
  game: TicTacToe,
  board: TicTacToeBoard,
});

export default App;