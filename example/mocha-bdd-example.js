var chai = require('chai'),
    sinonChai = require('sinon-chai'),
    unroll = require('../index.js');

chai.use(sinonChai);
unroll.use(it);

var expect = chai.expect;

describe('maximum of two numbers', function() {

  it('is performed correctly', function(done) {

    expect(Math.max(3, 5)).to.be.equal(5);
    expect(Math.max(7, 0)).to.be.equal(7);
    done();
  });
});

describe('maximum of two numbers', function() {
  unroll('maximum of #a and #b is #c',
    function(done, testArgs) {
      expect(
        Math.max(testArgs.a, testArgs.b)
      ).to.be.equal(testArgs.c);
      done();
    },

    [
      ['a', 'b', 'c'],
      [ 3,   5,   5 ],
      [ 7,   0,   7 ] // change last parameter to 0 to see failure
    ]
  );
});
