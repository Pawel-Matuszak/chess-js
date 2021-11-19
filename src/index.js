import Board from "./components/Board.js"
import GameController from "./components/GameController.js";
import "./style.css"

const gameController = new GameController();
gameController.init();
const board = new Board(gameController);
board.createBoard();
// board.readFEN("7k/8/8/8/8/8/8/R3K2R")

//opening
board.readFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")

//test queen checks
// board.readFEN("rnbqkbnr/pp2pppp/3p4/2p5/2PPP3/5N2/PP3PPP/RNBQKB1R")


//TODO

//if the king is in check and cant move its mate
//if the king is not in check and nothing can move its stealmate
//game loop
//saving previous moves
