const checkDiagonalAndStraigt = (i=0, j=0, board, legalMovesArray, posX, posY, isWhite) =>{
  //when is out of border
  if(posY-(i)<0) return;
  if(posY-(i)>7) return;
  if(posX-(j)<0) return;
  if(posX-(j)>7) return;
  //when ally piece is in the way
  if(board.board[posY-(i)][posX-(j)].isWhite===isWhite) return;

  //when enemy piece is in the way
  if(board.board[posY-(i)][posX-(j)]!=="-" && board.board[posY-(i)][posX-(j)].isWhite!==isWhite){
    legalMovesArray.push({
      x: posX-(j),
      y: posY-(i),
      isEmpty: false,
    })
    return;
  }else{
    //add another avaliable square
    legalMovesArray.push({
      x: posX-(j),
      y: posY-(i),
      isEmpty: true,
    })

    //for diagonal
    if(i!==0 && j!==0){
      if(i>0 && j>0){
        checkDiagonalAndStraigt(i+1, j+1, board, legalMovesArray, posX, posY, isWhite);
      }else if(i<0 && j<0){
        checkDiagonalAndStraigt(i-1, j-1, board, legalMovesArray, posX, posY, isWhite);
      }else if(i>0 && j<0){
        checkDiagonalAndStraigt(i+1, j-1, board, legalMovesArray, posX, posY, isWhite);
      }else if(i<0 && j>0){
        checkDiagonalAndStraigt(i-1, j+1, board, legalMovesArray, posX, posY, isWhite);
      }

    //for straight lines
    }else if(i<0){
      checkDiagonalAndStraigt(i-1, 0, board, legalMovesArray, posX, posY, isWhite);
    }else if(i>0){
      checkDiagonalAndStraigt(i+1, 0, board, legalMovesArray, posX, posY, isWhite);
    }else if(j>0){
      checkDiagonalAndStraigt(0, j+1, board, legalMovesArray, posX, posY, isWhite);
    }else if(j<0){
      checkDiagonalAndStraigt(0, j-1, board, legalMovesArray, posX, posY, isWhite);
    }
  }
}

export default checkDiagonalAndStraigt