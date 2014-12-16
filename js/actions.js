define([], function() {
  var NEXTID = 0;
  return {
    NONE: NEXTID++,
    UP: NEXTID++,
    DOWN: NEXTID++,
    LEFT: NEXTID++,
    RIGHT: NEXTID++,

    FIGHT: NEXTID++,
    BREED: NEXTID++
  };
});
