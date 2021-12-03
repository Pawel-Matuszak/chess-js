class MoveGenerator{
  constructor(isWhite, gameController){
    this.isWhite = isWhite;
    this.gameController = gameController
  }

  playRandomMove(board){
    if(this.gameController.currentGameStatus !== this.gameController.gameStatus.active) return false;
    
    let all = board.getAllLegalMoves();
    if(this.isWhite && this.gameController.whiteToMove){
      let randomMove = all.white[Math.floor(Math.random() * (all.white.length))];

      if(all.white.length>0){
        randomMove.piece.move(randomMove.x, randomMove.y, board)
      }

    }else{
      let randomMove = all.black[Math.floor(Math.random() * (all.black.length))];
      
      if(all.black.length>0){
        randomMove.piece.move(randomMove.x, randomMove.y, board)
      }
    }
  }
}

export default MoveGenerator;