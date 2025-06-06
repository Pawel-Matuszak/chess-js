import { Game } from 'js-chess-engine'

class AI{
  constructor(level=2, gameController){
    this.level = level;
    this.gameController = gameController
  }

  play(board){
    if(this.gameController.currentGameStatus !== this.gameController.gameStatus.active) return false;
    
    const game = new Game(board.getFEN());
    const aiMove = game.aiMove(this.level);
    const from = Object.keys(aiMove)[0];
    const to = Object.values(aiMove)[0];

    const fromX = from.charCodeAt(0) - 65;
    const fromY = 8 - parseInt(from[1]);

    const toX = to.charCodeAt(0) - 65;
    const toY = 8 - parseInt(to[1]);

    const piece = board.board[fromY][fromX];
    if(piece !== "-"){
      piece.move(toX, toY, board);
    }
  }
}

export default AI; 