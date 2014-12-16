define(["./utils", "./life", "./actions"], function(U, Life, A) {
  var canvas = document.getElementsByTagName("canvas")[0];
  var ctx = canvas.getContext("2d");

  function Board(rows, cols, seedFunction, updateFunction) {
    this.rows = rows;
    this.cols = cols;
    this.oldCells = U.create2DArray(this.rows, this.cols);
    this._cells = U.create2DArray(this.rows, this.cols, seedFunction);
    this.updateFunction = updateFunction;
    this.update();

  }

  Board.prototype.getRows = function() {
    return this.rows;
  };
  Board.prototype.getCols = function() {
    return this.cols;
  };

  Board.prototype.update = function () {
    /*
     * Compare the current cells array to the old one
     * redraw any differences and update the old array
     */
    var i,j;
    for(i = 0; i < this.rows ; i ++) {
    for(j = 0; j < this.cols ; j ++) {
      if (this.oldCells[i][j] !== this._cells[i][j]) {
        this.oldCells[i][j] = this._cells[i][j];
        this.drawCell(i*10, j*10, 10, 10, this._cells[i][j]);
      }
    }}
  };

  Board.prototype.drawCell = function(x,y,w,h, cell) {
    if(cell === null) {
      ctx.fillStyle="white";
      ctx.fillRect(x,y,w,h);
    } else {
      cell.draw(ctx, x, y, w, h);
    }
  };

  Board.prototype.setCell = function(row, col, cell) {
    this._cells[row][col] = cell;
  };

  Board.prototype.getCell = function(row, col) {
    /* Get the cell at the specified location, this supports
     * overflow and negative locations. */
    row = (row%this.rows+this.rows)%this.rows;
    col = (col%this.cols+this.cols)%this.cols;
    return this._cells[row][col];
  };

  Board.prototype.advanceState = function() {
    this.updateFunction(this);
    this.update(); // redraw
  };

  Board.prototype.resolveCollision = function (cells) {
    /*
     * Returns either a Cell (the survivor of a fight)
     * or A.BREED if breeding was done, and children need created.
     */
    function fight(cells) {
      var attacker = cells[U.randInt(cells.length)];
      var v_id = U.randInt(cells.length);
      var victim = cells[v_id];
      if(attacker === victim) {
        return;
      }
      victim.health -= attacker.getAttack();
      if (victim.health <=0 ) {
        cells.splice(v_id, 1);
      }

    }

    while(cells.length > 2) {
      fight(cells);
    }

    if(cells.length != 2)
      console.warn("More than 2 cells alive at invalid point in time.", cells.length);

    var a1 = cells[0].fightOrBreed(cells[1].getVisibleState());
    var a2 = cells[1].fightOrBreed(cells[0].getVisibleState());

    if (a1 == A.BREED && a2 == A.BREED) {
      return A.BREED;
    } else {
      while(cells.length > 1) {
        fight(cells);
      }
      return cells[0];
    }

  };

  return Board;
});
