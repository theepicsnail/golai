require(['./board', './life', './golai_engine'], function(Board, Life, Engine) {
  Math.seedrandom("");

  function seedFunction(row, col) {
    if(Math.random() < 0.5){
      return new Life();
    }
    return null;
  }

  var b = new Board(10,10, Engine.seedFunction, Engine.updateFunction);
  b.advanceState();
  window.b = b;
  n = setInterval(b.advanceState.bind(b), 200);
  window.stop = function() {
    clearInterval(n);
  };
});
