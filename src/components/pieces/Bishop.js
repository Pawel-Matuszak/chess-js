import Piece from "./Piece";
import checkDiagonalAndStraigt from "../helpers/checkDiagonalAndStraigt";

class Bishop extends Piece{
  constructor(type, posX, posY, isWhite){
    super(type, posX, posY, isWhite);
    this.value = 3;
  }

  getLegalMoves(board){
    let legalMoves = [];

    checkDiagonalAndStraigt(1, 1, board, legalMoves, this.pos.x, this.pos.y, this.isWhite)
    checkDiagonalAndStraigt(-1, 1, board, legalMoves, this.pos.x, this.pos.y, this.isWhite)
    checkDiagonalAndStraigt(1, -1, board, legalMoves, this.pos.x, this.pos.y, this.isWhite)
    checkDiagonalAndStraigt(-1, -1, board, legalMoves, this.pos.x, this.pos.y, this.isWhite)

    return legalMoves;
  }
}

export default Bishop;