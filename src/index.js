import Board from "./components/Board.js"
import King from "./components/King.js";
import Piece from "./components/Piece.js";
import "./style.css"

const board = new Board();
board.createBoard();
// board.readFEN("8/8/8/3r4/8/8/8/8")

//opening
// board.readFEN("rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R")

//test queen checks
board.readFEN("rnbqkbnr/pp2pppp/3p4/2p5/2PPP3/5N2/PP3PPP/RNBQKB1R")


//TODO

//make check mechanic
//color controlled squares array
  //if piece is ally add it with isAlly

//game loop
//saving previous moves
