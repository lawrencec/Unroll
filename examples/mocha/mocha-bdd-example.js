var chai = require('chai');
var unroll = require('../../index.js');
var expect = chai.expect;

unroll.use(it);

describe('[mocha bdd] maximum of two numbers (without unroll)', function () {
  it('is performed correctly', function (done) {
    expect(Math.max(3, 5)).to.be.equal(5);
    expect(Math.max(7, 0)).to.be.equal(7);
    done();
  });
});

describe('[mocha bdd] maximum of two numbers (unrolled)', function () {
  unroll('maximum of #a and #b is #c',
    function (done, testArgs) {
      expect(
        Math.max(testArgs.a, testArgs.b)
      ).to.be.equal(testArgs.c);
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
      ).to.be.equal(testArgs.c);
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
  unroll('calculates the maximum of #b and #a (non-callback async)',
    function (testArgs) {
      expect(
        Math.max(testArgs.a, testArgs.b)
      ).to.be.equal(testArgs.c);
    },

    [
      ['a', 'b', 'c'],
      [3, 5, 5],
      [7, 0, 7]
      /* change last entry to [7, 0, 0] to see failure */
    ]
  );

  describe('[mocha bdd] async/await tests (unrolled)', function () {
    unroll('calculates the maximum of #b and #a',
      async function (testArgs) {
        const testPromise = Promise.resolve(Math.max(testArgs.a, testArgs.b));
        const result = await testPromise;
        expect(result).to.be.equal(testArgs.c);
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
          expect(err.message).to.be.equal('Uh-oh');
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
