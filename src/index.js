import Board from "./components/Board.js"
import GameController from "./components/GameController.js";
import "./style.css"

const gameController = new GameController();
gameController.init();
const board = new Board(gameController);
board.createBoard();
// board.readFEN("7k/3r4/8/8/8/8/8/R3K2R")
// board.readFEN("8/R2r3k/8/8/8/8/8/4K1R1")
// board.readFEN("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1")

//opening
// board.readFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")
board.readFEN("rnbqkbnr/pppppppp/8/8/2B5/8/PPPPPQPP/RNBQKBNR b KQkq e3 0 1")

//test queen checks
// board.readFEN("rnbqkbnr/pp2pppp/3p4/2p5/2PPP3/5N2/PP3PPP/RNBQKB1R")


//TODO

//saving previous moves
