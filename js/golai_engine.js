define(['./life'], function(Life) {
  return {
    seedFunction: function(){ return Math.random() < 0.5 ? new Life() : null; },
  };
});
