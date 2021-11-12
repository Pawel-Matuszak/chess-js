import Board from "./board.js"
import Piece from "./piece.js";
import "./style.css"

const board = new Board();
board.createBoard();

const wk = new Piece("k", 4, 7, true)
wk.createPiece(board);