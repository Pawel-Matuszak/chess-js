import Piece from "./Piece";

class Knight extends Piece{
  constructor(type, posX, posY, isWhite){
    super(type, posX, posY, isWhite);
  }

  getLegalMoves(board){
    let legalMoves = [];
    
    if(board.board[this.pos.y+2]){
      legalMoves.push({x: this.pos.x-1, y: this.pos.y+2})
      legalMoves.push({x: this.pos.x+1, y: this.pos.y+2})
    }

    if(board.board[this.pos.y-2]){
      legalMoves.push({x: this.pos.x-1, y: this.pos.y-2})
      legalMoves.push({x: this.pos.x+1, y: this.pos.y-2})
    }

    if(board.board[this.pos.y+1]){
      legalMoves.push({x: this.pos.x+2, y: this.pos.y+1})
      legalMoves.push({x: this.pos.x-2, y: this.pos.y+1})
    }

    if(board.board[this.pos.y-1]){
      legalMoves.push({x: this.pos.x+2, y: this.pos.y-1})
      legalMoves.push({x: this.pos.x-2, y: this.pos.y-1})
    }

    //filter illegal moves and squares taken by ally pieces
    legalMoves = legalMoves.filter(e=>{
      if(board.board[e.y, e.x]){
        if(board.board[e.y][e.x]==="-" || board.board[e.y][e.x].isWhite!==this.isWhite){
          return e;
        }
      }
    });

    //check for enemy pieces
    legalMoves = legalMoves.map(({x,y})=>{
      let isEmpty = (board.board[y][x]!=="-" && board.board[y][x].isWhite!==this.isWhite) ? false : true;
      return {x,y, isEmpty}
    })

    return legalMoves;
  }
}

export default Knight;