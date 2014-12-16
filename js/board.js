define(["./utils"], function(U) {
  var canvas = document.getElementsByTagName("canvas")[0];
  var ctx = canvas.getContext("2d");

  function Board(rows, cols, seedFunction, updateFunction) {
    this.rows = rows;
    this.cols = cols;
    this.dirty = [];
    this._cells = U.create2DArray(this.rows, this.cols, seedFunction);
    this.updateFunction = updateFunction;
    this.updateAll();
  }

  Board.prototype.getRows = function() {
    return this.rows;
  };
  Board.prototype.getCols = function() {
    return this.cols;
  };

  Board.prototype.updateAll = function () {
    /*
     * Redraw all cells.
     */
    this.dirty.length = 0;
    var i,j;
    for(i = 0; i < this.rows ; i ++) {
    for(j = 0; j < this.cols ; j ++) {
      this.drawCell(i*10, j*10, 10, 10, this._cells[i][j]);
    }}
  };

  Board.prototype.updateDirty = function () {
    /*
     * Redraw only dirty cells.
     */
    var i;
    for(i = this.dirty.length-1; i >=0 ; --i) {
      var tmp = this.dirty[i];
      this.drawCell(tmp[0]*10, tmp[1]*10, 10, 10, this._cells[tmp[0]][tmp[1]]);
    }
  }

  Board.prototype.drawCell = function(x,y,w,h, cell) {
    if(cell === null) {
      ctx.fillStyle="white";
      ctx.fillRect(x,y,w,h);
    } else {
      cell.draw(ctx, x, y, w, h);
    }
  };

  Board.prototype.setCell = function(row, col, cell) {
    row = (row%this.rows+this.rows)%this.rows;
    col = (col%this.cols+this.cols)%this.cols;
    if (cell != this._cells[row][col]) {
      this._cells[row][col] = cell;
      this.dirty.push([row,col])
    }
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
    this.updateDirty(); // redraw
  };

  return Board;
});
