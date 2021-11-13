import Board from "./components/board.js"
import King from "./components/king.js";
import Piece from "./components/piece.js";
import "./style.css"

const board = new Board();
board.createBoard();
board.readFEN("8/8/8/8/8/8/8/8")
board.readFEN("rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R")

// const k = new King("K", 4, 3, true)
// k.createPiece(board);

// const b = new Piece("B", 4, 5, true)
// b.createPiece(board);

// const bb = new Piece("b", 3, 3, false)
// bb.createPiece(board);

// k.getLegalMoves(board)


// const wk = new Piece("K", 4, 7, true)
// wk.createPiece(board);/
