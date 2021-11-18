import Piece from "./Piece";

class King extends Piece{
  constructor(type, posX, posY, isWhite){
    super(type, posX, posY, isWhite);
    // this.enemySquares = []
    this.castle = false;
    this.castleLong = false;
    this.rooks = [];
  }

    //danger
    //save the squares attacked by enemy* pieces in the array**
    //*white if king is black and black if white
    //**like getLegalMoves
    //////////////////////////////////////////////
    //funciton calculateSquaresControlledByEnemy in Piece class returning array of [x,y] squares
    //here we have to check if the square king is trying to go is one of the returned by calculateSquaresControlledByEnemy
    //if true we return and draw board as it was;
    //////////////////////////////////////////////
    //king is forced to move if is in check
    //this.inCheck

  getLegalMoves(board){
    let legalMoves = []
    //save valid squares 
    //loop through the board
    for (let i = 0; i < board.board.length; i++) {
      for (let j = 0; j < board.board[i].length; j++) {
        //find the squares that the king could move to
        if((j<=this.pos.x+1 && j>=this.pos.x-1) &&
        (i>=this.pos.y-1 && i<=this.pos.y+1)){
          if(!(i==this.pos.y && j==this.pos.x)){
            //if the square is empty or if the piece on this square is opposite color
            //add sqare to legal squares
            if(board.board[i][j]==="-"){
              legalMoves.push({
                x: j, 
                y: i, 
                isEmpty: true,
                isAlly: undefined
              });
            }else{
              legalMoves.push({
                x: j, 
                y: i, 
                isEmpty: false,
                isAlly: (board.board[i][j].isWhite==this.isWhite) ? true : false
              });
            }
          }
        }
      }
    }
    
    if(this.isWhite){
      this.enemySquares = board.controlledSquares.black;
    }else{
      this.enemySquares = board.controlledSquares.white;
    }
    //calculate set difference to make sure king cant run into check
    // legalMoves = legalMoves.filter(({ x: x1, y: y1 }) => !this.enemySquares.some(({ x: x2, y: y2}) => (x2 === x1 && y2 === y1)));

    this.castleValidation(board);
    
    if(this.castle){
      //add castling to valid moves
      legalMoves.push({
        x: this.pos.x+2,
        y: this.pos.y,
        isEmpty: true,
        castle: {long: false, rook: this.rooks[1]},
      })
    }
    if(this.castleLong){
      legalMoves.push({
        x: this.pos.x-2,
        y: this.pos.y,
        isEmpty: true,
        castle: {long: true, rook: this.rooks[0]},
      })
    }
    
    return legalMoves;
  }
  
  castleValidation(board){
    this.castle = true;
    this.castleLong = true;

    if(this.wasMoved){
      this.castle = false;
      this.castleLong = false;
      return;
    }

    //when pieces are in the way
    if(board.board[this.pos.y][this.pos.x+1]!=="-" ||
      board.board[this.pos.y][this.pos.x+2]!=="-"){
        this.castle = false;
    }
    if(board.board[this.pos.y][this.pos.x-1]!=="-" ||
      board.board[this.pos.y][this.pos.x-2]!=="-" ||
      board.board[this.pos.y][this.pos.x-3]!=="-"){
        this.castleLong = false;
    }
    if(!this.castleLong && !this.castle) return;

    //when one of the rooks was moved
    if(this.gameController){
      if(this.isWhite){
        this.rooks = this.gameController.findRooks(board).white
      }else{
        this.rooks = this.gameController.findRooks(board).black
      }
      if(this.rooks[0].wasMoved){
        this.castleLong = false;
      }
      if(this.rooks[1].wasMoved){
        this.castle = false;
      }
    }
    if(!this.castleLong && !this.castle) return;

    //if the squares are not controlled by enemy
    this.enemySquares.forEach(({x,y})=>{
      if(y==this.pos.y && (
        x==this.pos.x+1 ||
        x==this.pos.x+2
      )){
          this.castle = false;
      }
      if(y==this.pos.y && (
        x==this.pos.x-1 ||
        x==this.pos.x-2 ||
        x==this.pos.x-3
      )){
          this.castleLong = false;
      }
    })
  }

  //changes position on the screen
  move(posX, posY, board){
    this.legalMoves = this.getLegalMoves(board);
    
    //check if a move is legal
    this.legalMoves.forEach(({x,y,isEmpty, isAlly, castle}) => {
      if(posX==x && posY==y){
        if(isAlly) return;
        console.log(castle);
        this.gameController.moveValidation(x,y,isEmpty,board,this,castle);
      }
    });
    board.drawPieces();

    console.log(this.castle + " " + this.castleLong);

  }
}

export default King;