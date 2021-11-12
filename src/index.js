import Board from "./components/board.js"
import Piece from "./components/piece.js";
import "./style.css"

const board = new Board();
board.createBoard();

// const wk = new Piece("K", 4, 7, true)
// wk.createPiece(board);

board.readFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")