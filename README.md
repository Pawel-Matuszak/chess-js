# chess-js

## Description
Website where you can play chess on a JavaScript chessboard. All moves are validated before they are played which means that user cannot play a move that would be illegal in normal chess game. 
Goal of this project was to write vanilla JavaScript (ES6) application.

Website: https://pawel-matuszak.github.io/chess-js

## Features
* __Castling__ - both sides can castle kingside or queenside only if it is legal
* __Threat map for both colors__ - highlights squares controlled by player’s pieces
* __Previous and next move navigation__ - used to navigate moves history
* __Restart__ - restart the game by putting pieces on their initial squares and clearing moves history
* __Player vs AI__ - play as white vs AI making random moves
* __AI vs AI__ - both sides are making random legal moves
* __Moves history panel__ - displays all the moves that where played in the current game. Selecting a move will set the board to a position when this move was played
* __Get PGN__ - show and copy PGN (format which records moves of the game) 

## Gallery
>![chess board](/src/images/s.PNG)
