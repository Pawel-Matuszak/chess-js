import Piece from "./Piece";

class Bishop extends Piece{
  constructor(type, posX, posY, isWhite){
    super(type, posX, posY, isWhite);
  }

  getLegalMoves(board){
    let legalMoves = [];

    return legalMoves;
  }
}

export default Bishop;