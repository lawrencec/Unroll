var unroll = require('../../index.js');
var test = require('ava');

unroll.use(test);

test(
  '[ava] maximum of two numbers is performed correctly (without unroll)',
  function(t) {
    t.plan(2);
    t.is(Math.max(3, 5), 5);
    t.is(Math.max(7, 0), 7);
  }
);

unroll(
  '[ava] maximum of #a and #b is #c (unrolled)',
  function(t, testArgs) {
    t.plan(1);
    t.is(Math.max(testArgs.a, testArgs.b), testArgs.c);
  },
  [
    ['a', 'b', 'c'],
    [3, 5, 5],
    [7, 0, 7]
    /* change last entry to [7, 0, 0] to see failure */
  ]
);

/*
 * The parameters in the title are out of sequence with the passed parameters.
 */
unroll(
  '[ava] calculates the maximum of #b and #a (unrolled)',
  function(t, testArgs) {
    t.plan(1);
    t.is(Math.max(testArgs.a, testArgs.b), testArgs.c);
  },
  [
    ['a', 'b', 'c'],
    [3, 5, 5],
    [7, 0, 7]/* change last entry to [7, 0, 0] to see failure */
  ]
);

unroll.use(test.cb);

unroll(
  '[ava] maximum of #a and #b is #c (unrolled as callback)',
  function(t, testArgs) {
    t.plan(1);
    t.is(Math.max(testArgs.a, testArgs.b), testArgs.c);
    t.end();
  },
  [
    ['a', 'b', 'c'],
    [3, 5, 5],
    [7, 0, 7]
    /* change last entry to [7, 0, 0] to see failure */
  ]
);
