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
    this.difficulty = 2;
  }

  // SVG icons for buttons
  static ICONS = {
    PREV: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`,
    NEXT: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`,
    BACK: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`,
    DOWNLOAD: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
    THREAT_MAP: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h7v7H3z"/><path d="M14 3h7v7h-7z"/><path d="M14 14h7v7h-7z"/><path d="M3 14h7v7H3z"/></svg>`,
    PLAY: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
    USER: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    ROBOT: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`
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

  //used for creating user interface
  //type sould be valid tag name
  //returns html element
  createHTMLElement({type, className, textContent = ""}){
    let element = document.createElement(type);
    element.innerHTML = textContent;
    element.setAttribute("class", className);
    return element;
  }

  showInGameUI(show){
    if(show){
      this.inGameWrapper.style.display = "flex";
      this.preGameWrapper.style.display = "none";
    }else{
      this.inGameWrapper.style.display = "none";
      this.preGameWrapper.style.display = "flex";
    }
  }

  init(board, gameController){
    this.wrapper = document.createElement("div");
    this.wrapper.setAttribute("class", "wrapper");
    
    
    this.board = board;
    this.gameController = gameController;
    this.currentMove = gameController.halfmoveCount;

    // --- PRE-GAME CONTROLS ---
    this.preGameWrapper = this.createHTMLElement({type: "div", className: "pre-game-wrapper"});
    const preGameTitle = this.createHTMLElement({type: "h2", className: "pre-game-title", textContent: "Choose a game mode"});
    // this.buttons["play"] = this.createHTMLElement({type: "button", className: "play-btn", textContent: UserInterface.ICONS.PLAY + "Solo"});
    this.buttons["ai"] = this.createHTMLElement({type: "button", className: "ai-btn", textContent: UserInterface.ICONS.USER + " vs " + UserInterface.ICONS.ROBOT});
    this.buttons["cvsc"] = this.createHTMLElement({type: "button", className: "cvsc-btn", textContent: UserInterface.ICONS.ROBOT + " vs " + UserInterface.ICONS.ROBOT});
    
    const difficultyWrapper = this.createHTMLElement({type: "div", className: "difficulty-wrapper"});
    const difficultyLabel = this.createHTMLElement({type: "label", className: "difficulty-label", textContent: `AI difficulty: ${Number(this.difficulty) + 1}`});
    const difficultySlider = this.createHTMLElement({type: "input", className: "difficulty-slider"});
    difficultySlider.type = "range";
    difficultySlider.min = 0;
    difficultySlider.max = 3;
    difficultySlider.value = this.difficulty;
    difficultySlider.addEventListener("input", (e) => {
      this.difficulty = e.target.value;
      difficultyLabel.textContent = `AI difficulty: ${Number(this.difficulty) + 1}`;
    });

    difficultyWrapper.append(difficultyLabel, difficultySlider);
    this.preGameWrapper.append(preGameTitle, difficultyWrapper, this.buttons["ai"], this.buttons["cvsc"]);

    // --- IN-GAME CONTROLS ---
    this.inGameWrapper = this.createHTMLElement({type: "div", className: "in-game-wrapper"});
    this.inGameWrapper.style.display = "none"; // Hidden by default

    // Create button groups
    this.buttonWrapper = this.createHTMLElement({type: "div", className: "button-wrapper"});
    this.navGroup = this.createHTMLElement({type: "div", className: "button-group nav-group"});
    this.threatGroup = this.createHTMLElement({type: "div", className: "button-group threat-group"});
    
    // PGN Button
    this.pgnBtn = this.createHTMLElement({type:"button", className: "pgnBtn", textContent: UserInterface.ICONS.DOWNLOAD + " PGN"})

    this.pgnModalWrapper = this.createHTMLElement({type: "div", className: "pgnModalWrapper"})
    this.pgnModalWrapper.style.display = "none";

    this.pgnModal = this.createHTMLElement({type: "div", className: "pgnModal", textContent: "PGN"})
    this.pgnExit = this.createHTMLElement({type: "div", className: "pgnExit", textContent: "<i class='fas fa-times'></i>"})
    this.pgnText = this.createHTMLElement({type: "textarea", className: "pgnText", textContent: ""})
    this.pgnText.disabled = true;
    this.pgnCopy = this.createHTMLElement({type: "button", className: "pgnCopy", textContent: "Copy"})

    // Create buttons with icons
    this.buttons["toggleWhiteCS"] = this.createHTMLElement({type: "button", className: "icon-button", textContent: UserInterface.ICONS.THREAT_MAP + " White"})
    this.buttons["toggleBlackCS"] = this.createHTMLElement({type: "button", className: "icon-button", textContent: UserInterface.ICONS.THREAT_MAP + " Black"})
    this.buttons["previous"] = this.createHTMLElement({type: "button", className: "icon-button history-btn", textContent: UserInterface.ICONS.PREV})
    this.buttons["next"] = this.createHTMLElement({type: "button", className: "icon-button history-btn", textContent: UserInterface.ICONS.NEXT})
    this.buttons["mainMenu"] = this.createHTMLElement({type: "button", className: "main-menu-btn", textContent: UserInterface.ICONS.BACK + "Main Menu"});
    
    this.inGameDifficulty = this.createHTMLElement({type: "div", className: "in-game-difficulty"});
    
    this.movesList.setAttribute("class", "moves-list");
    this.movesList.innerHTML = "<div class='move-list-header'></div>";

    const startGame = (mode) => {
        this.gameController.computerActive = false;
        this.gameController.playVsAiActive = false;

        if (mode === 'vsAI') {
            this.gameController.playVsAiActive = true;
        } else if (mode === 'AIvsAI') {
            this.gameController.computerActive = true;
        }

        this.showInGameUI(true);
        this.gameController.init("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", this.board);
        
        if (mode === 'vsAI') this.gameController.playVsAI(this.difficulty);
        if (mode === 'AIvsAI') this.gameController.playAIvsAI(this.difficulty);
        this.inGameDifficulty.textContent = `Difficulty: ${Number(this.difficulty) + 1}`;
    };

    // --- EVENT LISTENERS ---
    // this.buttons["play"].addEventListener("click", () => startGame('human'));
    this.buttons["ai"].addEventListener("click", () => startGame('vsAI'));
    this.buttons["cvsc"].addEventListener("click", () => startGame('AIvsAI'));

    this.buttons["mainMenu"].addEventListener("click", () => {
        this.showInGameUI(false);
        this.gameController.currentGameStatus = this.gameController.gameStatus.paused;
        this.gameController.movesHistory = [];
        this.gameController.movesHistory.length = 0;
        this.gameController.endAIvsAI();
        this.gameController.endVsAI();
        this.movesList.innerHTML = "<div class='move-list-header'></div>";
    });

    this.buttons["toggleWhiteCS"].addEventListener("click", ()=>{
      board.removeControlledSquares();
      this.showCsW = !this.showCsW;
      this.showCsB = false;
      this.buttons["toggleWhiteCS"].style.background = "none";
      this.buttons["toggleBlackCS"].style.background = "none";

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
      this.buttons["toggleWhiteCS"].style.background = "none";
      this.buttons["toggleBlackCS"].style.background = "none";

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

    // Group buttons
    this.navGroup.append(this.buttons["previous"], this.buttons["next"]);
    this.threatGroup.append(this.buttons["toggleWhiteCS"], this.buttons["toggleBlackCS"]);
    
    this.buttonWrapper.append(this.threatGroup);

    this.pgnModal.append(this.pgnText, this.pgnExit, this.pgnCopy);
    this.pgnModalWrapper.append(this.pgnModal);

    this.inGameTopWrapper = this.createHTMLElement({type: "div", className: "inGameTopWrapper"})
    this.inGameTopWrapper.append(this.buttons["mainMenu"], this.inGameDifficulty)

    this.inGameWrapper.append(this.inGameTopWrapper, this.movesList,this.navGroup, this.buttonWrapper, this.pgnBtn, this.pgnModalWrapper);
    this.wrapper.append(this.preGameWrapper, this.inGameWrapper);
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