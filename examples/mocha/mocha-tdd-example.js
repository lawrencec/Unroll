var chai = require('chai');
var unroll = require('../../index.js');
var expect = chai.expect;

unroll.use(test);

suite('[mocha tdd] maximum of two numbers (without unroll)', function () {
  test('is performed correctly', function (done) {
    expect(Math.max(3, 5)).to.be.equal(5);
    expect(Math.max(7, 0)).to.be.equal(7);
    done();
  });
});

suite('[mocha tdd] maximum of two numbers (unrolled)', function () {
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
});

suite('[mocha tdd] async/await tests (unrolled)', function () {
  unroll('calculates the maximum of #b and #a',
      async function (testArgs) {
        const testPromise = new Promise(function (resolve, reject) {
          setTimeout(function () {
            resolve(Math.max(testArgs.a, testArgs.b));
          }, 200);
        });

        const result = await testPromise;
        expect(result).to.be.equal(testArgs.c);
      },
    [
        ['a', 'b', 'c'],
        [3, 5, 5],
        [7, 0, 7]
        /* change last entry to [7, 0, 0] to see failure */
    ]
  );

  unroll('passes errors correctly when the maximum of #b and #a is not equal to #c',
      async function (testArgs) {
        const testPromise = new Promise(function (resolve, reject) {
          setTimeout(function () {
            reject('Uh-oh');
          }, 200);
        });

        return await testPromise
            .catch(function (err) {
              expect(err).to.be.equal('Uh-oh');
            });
      },
    [
        ['a', 'b', 'c'],
        [3, 5, 3],
        [7, 0, 0]
    ]
  );
});
