import Board from "./board.js"
import Piece from "./piece.js";
import "./style.css"

const board = new Board();
const wk = new Piece()
board.createBoard();
board.setPiece(
  wk.createPiece("k", 0, 0, false)
)

board.setPiece(
  wk.createPiece("k", 4, 7, true)
)