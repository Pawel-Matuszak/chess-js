import Piece from "./Piece";
import Queen from "./Queen";

class Pawn extends Piece{
  constructor(type, posX, posY, isWhite){
    super(type, posX, posY, isWhite);
    this.value = 1;
  }

  getLegalMoves(board){
    let legalMoves = [];
    let offset = (this.isWhite) ? 1 : -1;

    if((this.isWhite && this.pos.y==0) || (!this.isWhite && this.pos.y==7)){
      //new Piece(this.pos.x, this.pos.y ...)
      let type = (this.isWhite) ? "Q" : "q";
      let newPiece = new Queen(type, this.pos.x, this.pos.y, this.isWhite);
      newPiece.createPiece(board);
      if(this.pieceDiv){
        this.pieceDiv.remove()
      }
      return legalMoves;
    }

    //captures
    let square = board.board[this.pos.y-offset][this.pos.x-1]
    if(square){
      if(square!=="-"){
        legalMoves.push({
          x: this.pos.x-1, 
          y: this.pos.y-offset, 
          isEmpty: false,
          isAlly: (square.isWhite==this.isWhite) ? true : false
        })
      }else{
        legalMoves.push({
          x: this.pos.x-1, 
          y: this.pos.y-offset, 
          isEmpty: true,
          isAlly: true
        })
      }
    }
    square = board.board[this.pos.y-offset][this.pos.x+1]
    if(square){
      if(square!=="-"){
        legalMoves.push({
          x: this.pos.x+1, 
          y: this.pos.y-offset, 
          isEmpty: false,
          isAlly: (square.isWhite==this.isWhite) ? true : false
        })
      }else{
        legalMoves.push({
          x: this.pos.x+1, 
          y: this.pos.y-offset, 
          isEmpty: true,
          isAlly: true
        })
      }

    }

    //EN PASANT
    //is possible when some enemy pawn is controlling board.enPassantTargetSquare

    //forward movement
    if(board.board[this.pos.y-offset][this.pos.x]=="-"){
      
      legalMoves.push({
        x: this.pos.x, 
        y: this.pos.y-offset, 
        isEmpty: true
      })
      
      //when the first square is empty check if the the piece was moved before
      if(this.pos.y==6 && this.isWhite) offset = 2;
      if(this.pos.y==1 && !this.isWhite) offset = -2;
      
      //and if that square is empty
      if(board.board[this.pos.y-offset]){
        if(board.board[this.pos.y-offset][this.pos.x]=="-" && !this.wasMoved){
          legalMoves.push({
            x: this.pos.x, 
            y: this.pos.y-offset, 
            isEmpty: true
          })
        }

      }
    }
    



    return legalMoves;
  }
}

export default Pawn;