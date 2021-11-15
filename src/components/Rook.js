import Piece from "./Piece";

class Rook extends Piece{
  constructor(type, posX, posY, isWhite){
    super(type, posX, posY, isWhite);
  }

  getLegalMoves(board){
    let legalMoves = [];
    
    const checkVert = (i=0, j=0) =>{
      //when is out of border
      if(this.pos.y-(i)<0) return;
      if(this.pos.y-(i)>7) return;
      if(this.pos.x-(j)<0) return;
      if(this.pos.x-(j)>7) return;
      //when ally piece is in the way
      if(board.board[this.pos.y-(i)][this.pos.x-(j)].isWhite===this.isWhite) return;

      //when enemy piece is in the way
      if(board.board[this.pos.y-(i)][this.pos.x-(j)]!=="-" && board.board[this.pos.y-(i)][this.pos.x-(j)].isWhite!==this.isWhite){
        console.log("A");
        legalMoves.push({
          x: this.pos.x-(j),
          y: this.pos.y-(i),
          isEmpty: false,
        })
      return;
      }else{
        legalMoves.push({
          x: this.pos.x-(j),
          y: this.pos.y-(i),
          isEmpty: true,
        })

        if(i<0){
          checkVert(i-1, 0);

        }else if(i>0){
          checkVert(i+1, 0);

        }else if(j>0){
          checkVert(0, j+1);

        }else if(j<0){
          checkVert(0, j-1);

        }
      }
    }
    checkVert(1, 0)
    checkVert(-1, 0)
    checkVert(0, 1)
    checkVert(0, -1)

    return legalMoves;
  }
}

export default Rook;