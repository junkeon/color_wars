import { Client } from "boardgame.io/react";
import { ColorWarBoard } from "./components/Board";
import { ColorWar } from "./scripts/Game";

const App = Client({
  game: ColorWar,
  board: ColorWarBoard,
});

export default App;