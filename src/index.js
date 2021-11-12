import Board from "./board.js"
import Piece from "./piece.js";
import "./style.css"

const board = new Board();
const wk = new Piece("k", 0, 0, true)
const bk = new Piece("k", 4, 7, false)
const wr = new Piece("r", 5, 7, true)

board.createBoard();

board.setPiece(
  wk.createPiece()
)

board.setPiece(
  bk.createPiece()
)

board.setPiece(
  wr.createPiece()
)