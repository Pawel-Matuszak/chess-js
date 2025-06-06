import Piece from "./Piece";
import Queen from "./Queen";

class Pawn extends Piece{
  constructor(type, posX, posY, isWhite){
    super(type, posX, posY, isWhite);
    this.value = 1;
  }

  //return all moves
  getLegalMoves(board){
    let allMoves = [];
    let offset = (this.isWhite) ? 1 : -1;

    //piece promotion
    if((this.isWhite && this.pos.y==0) || (!this.isWhite && this.pos.y==7)){
      //new Piece(this.pos.x, this.pos.y ...)
      let type = (this.isWhite) ? "Q" : "q";
      let newPiece = new Queen(type, this.pos.x, this.pos.y, this.isWhite);
      newPiece.createPiece(board);
      if(this.pieceDiv){
        this.pieceDiv.remove()
      }
      return allMoves;
    }

    //captures
    let directions = [this.pos.x-1, this.pos.x+1];
    directions.forEach(dir => {
      if(board.board[this.pos.y-offset][dir]){
        //if en passant is avaliable
        if(board.gameController.enPassantTargetSquare && board.gameController.enPassantTargetSquare!=="-"){
          //if this piece can capture en passant
          if(board.gameController.enPassantTargetSquare.x === dir && board.gameController.enPassantTargetSquare.y === this.pos.y-offset){
            let target = board.board[board.gameController.enPassantTargetSquare.y+offset][board.gameController.enPassantTargetSquare.x];
            if(target!=="-" && target.isWhite!==this.isWhite){
              allMoves.push({
                x: dir, 
                y: this.pos.y-offset, 
                isEmpty: true,
                isAlly: false,
                enPassant: true
              })
            }
          }
        }
        //else
        if(board.board[this.pos.y-offset][dir]!=="-"){
          allMoves.push({
            x: dir, 
            y: this.pos.y-offset, 
            isEmpty: false,
            isAlly: (board.board[this.pos.y-offset][dir].isWhite==this.isWhite) ? true : false
          })
        }else{
          allMoves.push({
            x: dir, 
            y: this.pos.y-offset, 
            isEmpty: true,
            isAlly: true
          })
        }
      }
    });
    
    //forward movement
    if(board.board[this.pos.y-offset][this.pos.x]=="-"){
      
      allMoves.push({
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
          allMoves.push({
            x: this.pos.x, 
            y: this.pos.y-offset, 
            isEmpty: true
          })
        }

      }
    }

    return allMoves;
  }
}

export default Pawn;