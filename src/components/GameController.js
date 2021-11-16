import Board from "./Board";

class GameController{
  constructor(board){
    this.boardRef = board;
    this.inCheck = {
      white: false,
      black: false,
    }
    //check if check after making attempt to move*
    // *changing turn from one color to other
    // *makeMove function as a gameController f
  }

  makeMove(x,y, isEmpty, board){
    //copy from Piece.move
  }
}