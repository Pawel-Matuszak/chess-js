import Board from "./components/Board.js"
import GameController from "./components/GameController.js";
import King from "./components/King.js";
import Piece from "./components/Piece.js";
import "./style.css"

const gameController = new GameController();
const board = new Board(gameController);
board.createBoard();
// board.readFEN("8/8/8/3r4/8/8/8/8")

//opening
board.readFEN("rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R")

//test queen checks
// board.readFEN("rnbqkbnr/pp2pppp/3p4/2p5/2PPP3/5N2/PP3PPP/RNBQKB1R")


//TODO

//game loop
//make check mechanic
  //make a move if king is in check
  //test if after a move king is still in check
  
//saving previous moves
