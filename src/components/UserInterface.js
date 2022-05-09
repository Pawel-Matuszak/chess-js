class UserInterface{
  constructor(){
    this.buttons = {};
    this.showCsB = false;
    this.showCsW = false;
    this.gameController = null;
    this.board = null;
    this.histPos = 0;
    this.movesList = document.createElement("div");
    this.currentMove = 0;
  }

  handlePrevious(movesHistory, board){
    if(this.currentMove<=1) return;
    movesHistory.mapToId();
    this.currentMove--
    this.board.removePieces();
    this.board.readFEN(movesHistory.movesMap[this.currentMove].pos);

    this.handleHighlight(board);
  }

  handleNext(movesHistory, board){
    if(this.currentMove>movesHistory.length-2) return;
    movesHistory.mapToId();
    this.currentMove++
    this.board.removePieces();
    // if(this.histPos<0) this.histPos *=-1;
    this.board.readFEN(movesHistory.movesMap[this.currentMove].pos);
    
    this.handleHighlight(board);
  }

  handleHighlight(board){
    if(this.showCsW){
      board.getControlledSquares();
      board.showControlledSquares(true);
    }else if(this.showCsB){
      board.getControlledSquares();
      board.showControlledSquares(false);
    }
    
    this.updateCurrentMove()
    for (const e of document.querySelectorAll(".move-highlight")) {
      e.remove()
    }
  }

  init(board, gameController){
    this.wrapper = document.createElement("div");
    this.wrapper.setAttribute("class", "wrapper");
    this.buttonWrapper = document.createElement("div");
    this.buttonWrapper.setAttribute("class", "button-wrapper");

    this.pgnBtn = document.createElement("button");
    this.pgnBtn.setAttribute("class", "pgnBtn");
    this.pgnBtn.innerText = "Download PGN";

    this.pgnModalWrapper = document.createElement("div");
    this.pgnModalWrapper.setAttribute("class", "pgnModalWrapper");
    this.pgnModalWrapper.style.display = "none";

    this.pgnModal = document.createElement("div");
    this.pgnModal.setAttribute("class", "pgnModal");
    this.pgnModal.innerHTML = "<p>PGN</p>";

    this.pgnExit = document.createElement("div");
    this.pgnExit.setAttribute("class", "pgnExit");
    this.pgnExit.innerHTML = "<i class='fas fa-times'></i>";

    this.pgnText = document.createElement("textarea");
    this.pgnText.setAttribute("class", "pgnText");
    this.pgnText.disabled = true;

    this.pgnCopy = document.createElement("button");
    this.pgnCopy.setAttribute("class", "pgnCopy");
    this.pgnCopy.innerHTML = "Copy";

    this.board = board;
    this.gameController = gameController;
    this.currentMove = gameController.halfmoveCount;
    //create buttons for hilighting squares controlled by each color
    this.buttons["toggleWhiteCS"] = document.createElement("button");
    this.buttons["toggleWhiteCS"].innerText = "White threat map";
    this.buttons["toggleBlackCS"] = document.createElement("button");
    this.buttons["toggleBlackCS"].innerText = "Black threat map";
    this.buttons["previous"] = document.createElement("button");
    this.buttons["previous"].innerText = "Previous move";
    this.buttons["previous"].setAttribute("class", "history-btn");
    this.buttons["next"] = document.createElement("button");
    this.buttons["next"].innerText = "Next move";
    this.buttons["next"].setAttribute("class", "history-btn");
    this.buttons["restart"] = document.createElement("button");
    this.buttons["restart"].innerText = "Restart";
    this.buttons["restart"].setAttribute("class", "restart-btn");
    this.buttons["cvsc"] = document.createElement("button");
    this.buttons["cvsc"].innerText = "Computer vs Computer";
    this.buttons["cvsc"].setAttribute("class", "cvsc-btn");

    this.movesList.setAttribute("class", "moves-list");
    this.movesList.innerHTML = "<div class='move-list-header'></div>";

    this.buttons["toggleWhiteCS"].addEventListener("click", ()=>{
      board.removeControlledSquares();
      this.showCsW = !this.showCsW;
      this.showCsB = false;
      this.buttons["toggleWhiteCS"].style.background = "rgba(24, 99, 161, 0.9)";
      this.buttons["toggleBlackCS"].style.background = "rgba(24, 99, 161, 0.9)";

      if(this.showCsW){
        this.buttons["toggleWhiteCS"].style.background = "rgba(15, 67, 109, 0.9)";
        board.getControlledSquares();
        board.showControlledSquares(true);
      }
    })

    this.buttons["toggleBlackCS"].addEventListener("click", ()=>{
      board.removeControlledSquares();
      this.showCsB = !this.showCsB;
      this.showCsW = false;
      this.buttons["toggleWhiteCS"].style.background = "rgba(24, 99, 161, 0.9)";
      this.buttons["toggleBlackCS"].style.background = "rgba(24, 99, 161, 0.9)";

      if(this.showCsB){
        this.buttons["toggleBlackCS"].style.background = "rgba(15, 67, 109, 0.9)";
        board.getControlledSquares();
        board.showControlledSquares(false);
      }
    })

    this.buttons["previous"].addEventListener("click", ()=>{
      this.handlePrevious(this.gameController.movesHistory, board)
    });

    this.buttons["next"].addEventListener("click", ()=>{
      this.handleNext(this.gameController.movesHistory, board)
    });

    this.buttons["restart"].addEventListener("click", ()=>{
      this.gameController.init("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", this.board);
    });

    this.buttons["cvsc"].addEventListener("click", ()=>{
      this.gameController.computerActive = !this.gameController.computerActive;
      this.gameController.play();
      this.buttons["cvsc"].style.background = (this.gameController.computerActive) ? "rgba(15, 67, 109, 0.9)" : "rgba(24, 99, 161, 0.9)";
    });

    this.pgnBtn.addEventListener("click", ()=>{
      this.pgnText.value = board.getPGN();
      this.pgnModalWrapper.style.display = "inline-block";
    })

    this.pgnExit.addEventListener("click", ()=>{
      this.pgnModalWrapper.style.display = "none";
    })

    this.pgnCopy.addEventListener("click", ()=>{
      navigator.clipboard.writeText(this.pgnText.value);
    })

    for (const btn of Object.keys(this.buttons)) {
      this.buttonWrapper.append(this.buttons[btn])
    }

    this.pgnModal.append(this.pgnText, this.pgnExit, this.pgnCopy);
    this.pgnModalWrapper.append(this.pgnModal);
    this.wrapper.append(this.buttonWrapper, this.movesList, this.pgnBtn, this.pgnModalWrapper);
    document.querySelector(".container").append(this.wrapper)
    
  }

  updateMoves(movesHistory){
    this.movesList.innerHTML = "<div class='move-list-header'></div>";
    
    //map moves to ids
    this.gameController.movesHistory.mapToId();
    //display moves
    for (let i = 1; i < movesHistory.length; i++) {
      let move = movesHistory.movesMap[i];
      if(!move.move) return;
      let divMove = document.createElement("div");
      divMove.setAttribute("class", "move");
      this.movesList.appendChild(divMove);

      divMove.addEventListener("click", ()=>{
        this.board.removePieces();
        this.board.readFEN(move.pos);
        this.currentMove = Array.prototype.indexOf.call(divMove.parentNode.children, divMove);
        this.updateCurrentMove();
        this.handleHighlight(this.board);
      })
      divMove.innerHTML = (i%2==1) ? Math.ceil(i/2) +"."+ move.move : move.move;

    }
  }
  
  updateCurrentMove(){
    this.movesList.childNodes.forEach((child, i)=>{
      if(child.classList[0]=="move"){
        child.style.background = "none"
      };
    })
    this.movesList.childNodes[this.currentMove].style.background = "rgba(27, 83, 129, 0.4)"
  }
}

export default UserInterface;