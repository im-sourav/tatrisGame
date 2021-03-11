// The Object pieces
class Piece {
  constructor(tetromino, color, border) {
    this.tetromino = tetromino;
    this.color = color;
    this.border = border;

    this.tetrominoN = 0; // We start for the first pattern
    this.activeTetromino = this.tetromino[this.tetrominoN];

    // We need to controle the piece
    this.x = 3;
    this.y = -2;
  }

  // fill function
  fill(color, border) {
    for (r = 0; r < this.activeTetromino.length; r++) {
      for (c = 0; c < this.activeTetromino.length; c++) {
        // we draw only occupied squares
        if (this.activeTetromino[r][c]) {
          drawSquare(this.x + c, this.y + r, color, border);
        }
      }
    }
  }

  // Draw a piece to board
  draw() {
    this.fill(this.color, this.border);
  }

  // unDraw the piece to board
  unDraw() {
    drawBoard();
  }

  // Move down the piece
  moveDown() {
    if (!this.collision(0, 1, this.activeTetromino)) {
      this.unDraw();
      this.y++;
      this.draw();
      dropStart = Date.now();
    } else {
      // generate new piece
      p.lock();
      p = randomPiece();
      randomNPiece();
    }
  }

  // Move the piece Right
  moveRight() {
    if (!this.collision(1, 0, this.activeTetromino)) {
      this.unDraw();
      this.x++;
      this.draw();
      dropStart = Date.now();
    }
  }

  // Move the piece left
  moveLeft() {
    if (!this.collision(-1, 0, this.activeTetromino)) {
      this.unDraw();
      this.x--;
      this.draw();
      dropStart = Date.now();
    }
  }

  // Rotate the piece
  rotate() {
    let nextPattern = this.tetromino[
      (this.tetrominoN + 1) % this.tetromino.length
    ];
    let kick = 0;
    if (this.collision(0, 0, nextPattern)) {
      if (this.x > col / 2) {
        // it's the right wall
        kick = -1;
      } else {
        // it's the left wall
        kick = 1;
      }
    }
    if (!this.collision(kick, 0, nextPattern)) {
      this.unDraw();
      this.x += kick;
      this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
      this.activeTetromino = this.tetromino[this.tetrominoN];
      this.draw();
    }
    dropStart = Date.now();
  }

  // lock the piece
  lock() {
    for (r = 0; r < this.activeTetromino.length; r++) {
      for (c = 0; c < this.activeTetromino.length; c++) {
        // we skip the white square
        if (!this.activeTetromino[r][c]) {
          continue;
        }
        // piece to lock on top then game over
        if (this.y + r < 0) {
          alert("game over!");
          // stop request animation frame
          gameOver = true;
          break;
        }
        // we lock the piece
        board[this.y + r][this.x + c] = this.color;
      }
    }
    // remove full rows
    for (r = 0; r < row; r++) {
      let fullRow = true;
      for (c = 0; c < col; c++) {
        fullRow = fullRow && board[r][c] != bg;
      }
      if (fullRow) {
        // if the row is full
        // we move sown all the rows above it
        for (let y = r; y > 1; y--) {
          for (c = 0; c < col; c++) {
            board[y][c] = board[y - 1][c];
          }
        }
        // change all piece color
        const newRandomColorForAll = randomColor();
        for (let ro = 0; ro < row; ro++) {
          for (let co = 0; co < col; co++) {
            if (board[ro][co] != bg) {
              board[ro][co] = newRandomColorForAll;
            }
          }
        }

        // the top row board[0][...] has no row avobe it
        for (c = 0; c < col; c++) {
          board[0][c] = bg;
        }
        // increment the score
        score += 10;
        time += 10;
      }
    }
    drawBoard();
  }

  // collision function

  collision(x, y, piece) {
    for (r = 0; r < piece.length; r++) {
      for (c = 0; c < piece.length; c++) {
        // if the square is empty, we skip it
        if (!piece[r][c]) {
          continue;
        }
        // coordinates of the piece after movement
        let newX = this.x + c + x;
        let newY = this.y + r + y;

        // corditions
        if (newX < 0 || newX >= col || newY >= row) {
          return true;
        }

        // skip newY < 0 ; board [-1] crush the game
        if (newY < 0) {
          continue;
        }
        // chack if there is a locked piece alrady in place

        if (board[newY][newX] != bg) {
          return true;
        }
      }
    }
    return false;
  }
}

function Ndraw(piece, color, bdr) {
  let pieceN = piece[0];
  for (r = 0; r < piece[0].length; r++) {
    for (c = 0; c < piece[0].length; c++) {
      // we draw only occupied squares
      if (pieceN[r][c]) {
        drawNpiece(c, r, color, bdr); // for show next piece
      }
    }
  }
}
