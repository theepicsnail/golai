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

  return Board;
});
