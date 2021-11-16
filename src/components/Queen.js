import Piece from "./Piece";
import checkDiagonalAndStraigt from "./checkDiagonalAndStraigt";

class Queen extends Piece{
  constructor(type, posX, posY, isWhite){
    super(type, posX, posY, isWhite);
  }

  getLegalMoves(board){
    let legalMoves = [];
    checkDiagonalAndStraigt(1, 0, board, legalMoves, this.pos.x, this.pos.y, this.isWhite)
    checkDiagonalAndStraigt(-1, 0, board, legalMoves, this.pos.x, this.pos.y, this.isWhite)
    checkDiagonalAndStraigt(0, 1, board, legalMoves, this.pos.x, this.pos.y, this.isWhite)
    checkDiagonalAndStraigt(0, -1, board, legalMoves, this.pos.x, this.pos.y, this.isWhite)
    checkDiagonalAndStraigt(1, 1, board, legalMoves, this.pos.x, this.pos.y, this.isWhite)
    checkDiagonalAndStraigt(-1, 1, board, legalMoves, this.pos.x, this.pos.y, this.isWhite)
    checkDiagonalAndStraigt(1, -1, board, legalMoves, this.pos.x, this.pos.y, this.isWhite)
    checkDiagonalAndStraigt(-1, -1, board, legalMoves, this.pos.x, this.pos.y, this.isWhite)
    return legalMoves;
  }
}

export default Queen;