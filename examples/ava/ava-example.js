var unroll = require('../../index.js');
var test = require('ava');

unroll.use(test);

test(
  '[ava] maximum of two numbers is performed correctly (without unroll)',
  function (t) {
    t.plan(2);
    t.is(Math.max(3, 5), 5);
    t.is(Math.max(7, 0), 7);
  }
);

unroll(
  '[ava] maximum of #a and #b is #c (unrolled)',
  function (t, testArgs) {
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
  function (t, testArgs) {
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
  function (t, testArgs) {
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

unroll.use(test);

unroll('[ava] async/await calculates the maximum of #b and #a',
  async function (t, testArgs) {
    const testPromise = Promise.resolve(Math.max(testArgs.a, testArgs.b));
    const result = await testPromise;
    t.is(result, testArgs.c);
    return testPromise;
  },
  [
    ['a', 'b', 'c'],
    [3, 5, 5],
    [7, 0, 7]
    /* change last entry to [7, 0, 0] to see failure */
  ]
);

unroll('[ava] async/await passes errors correctly when the maximum of #b and #a is not equal to #c',
  async function (t) {
    const testPromise = Promise.reject(new Error('Uh-oh'));
    try {
      await testPromise;
    } catch (err) {
      t.is(err.message, 'Uh-oh');
    }
  },
  [
    ['a', 'b', 'c'],
    [3, 5, 3],
    [7, 0, 0]
  ]
);
