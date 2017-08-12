var unroll = require('../../index.js');

unroll.use(it);

describe('[jest bdd] maximum of two numbers (without unroll)', function () {
  it('is performed correctly', function (done) {
    expect(Math.max(3, 5)).toBe(5);
    expect(Math.max(7, 0)).toBe(7);
    done();
  });
});

describe('[jest bdd] maximum of two numbers (unrolled)', function () {
  unroll('maximum of #a and #b is #c',
    function (done, testArgs) {
      expect(
        Math.max(testArgs.a, testArgs.b)
      ).toBe(testArgs.c);
      done();
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
  unroll('calculates the maximum of #b and #a',
    function (done, testArgs) {
      expect(
        Math.max(testArgs.a, testArgs.b)
      ).toBe(testArgs.c);
      done();
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
  unroll('calculates the maximum of #b and #a (non-callback style)',
    function (testArgs) {
      expect(
        Math.max(testArgs.a, testArgs.b)
      ).toBe(testArgs.c);
    },

    [
      ['a', 'b', 'c'],
      [3, 5, 5],
      [7, 0, 7]
      /* change last entry to [7, 0, 0] to see failure */
    ]
  );

  describe('[jest bdd] async/await tests (unrolled)', function () {
    unroll('calculates the maximum of #b and #a',
      async function (testArgs) {
        const testPromise = Promise.resolve(Math.max(testArgs.a, testArgs.b));
        const result = await testPromise;
        expect(result).toBe(testArgs.c);
        return testPromise;
      },
      [
        ['a', 'b', 'c'],
        [3, 5, 5],
        [7, 0, 7]
        /* change last entry to [7, 0, 0] to see failure */
      ]
    );

    unroll('passes errors correctly when the maximum of #b and #a is not equal to #c',
      async function () {
        const testPromise = Promise.reject(new Error('Uh-oh'));
        try {
          await testPromise;
        } catch (err) {
          expect(err.message).toBe('Uh-oh');
        }
      },
      [
        ['a', 'b', 'c'],
        [3, 5, 3],
        [7, 0, 0]
      ]
    );
  });
});
