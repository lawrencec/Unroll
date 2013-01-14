var chai = require('chai'),
    fs = require('fs'),
    sinonChai = require('sinon-chai'),
    sinon = require('sinon'),
    unroll = require('../index.js');


chai.use(sinonChai);

var expect = chai.expect;

describe('outputs test title correctly', function() {
  var testTitle = 'The #entity jumped over the #thing.';

  it('when correctly called', function(done) {

    var stub = sinon.stub(global, 'it', function(title, fn) {
      expect(title).to.equal('The "cat" jumped over the "moon".');

    });

    unroll(testTitle,
      function(done, testArgs) {

      },

      [
        ['entity', 'thing'],
        ['cat', 'moon']
      ]
    );
    expect(stub.called);
    stub.restore();
    done();
  });
});

describe('calls the test function', function() {
  var testTitle = 'The #entity jumped over the #thing.';

  it('with unrolled test arguments correctly', function(done) {

    var stub = sinon.stub(global, 'it', function(title, fn) {
      expect(fn).to.be.a.function;
      fn();
    });

    unroll(testTitle,
            function(done, testArgs) {
              expect(arguments.length).to.equal(2);
              expect(testArgs).to.exist;
              expect(Object.keys(testArgs).length).to.equal(2);
              expect(Object.keys(testArgs).join(',')).to.equal('entity,thing');
              expect(testArgs['entity']).to.equal('cat');
              expect(testArgs['thing']).to.equal('moon');
            },

            [
              ['entity', 'thing'],
              ['cat', 'moon']
            ]
    );
    expect(stub.called);
    stub.restore();
    done();
  });
});

describe('throws exception when incorrectly called', function() {
  var testTitle = 'The #entity jumped over the #thing.',
      spy;

  beforeEach(function() {
    spy = sinon.spy(unroll);
  });

  afterEach(function(done) {
    spy.reset();
    done();
  });

  it('with mismatched unroll key/title values', function(done) {
    var error = '';

    try {
      unroll(testTitle,
        function(done, testArgs) {},
        [
          ['incorrect', 'stuff'],
          ['bar', 'moon']
        ]
      );
    }
    catch (e) {
      error = e.toString();
    }

    expect(spy.called);
    expect(spy.threw());
    expect(error).to.equal(
      'Error: title not expanded as incorrect args passed in'
    );

    done();
  });

  it('with mismatched number of unroll key/title values', function(done) {
    var error = '';

    try {
      unroll(testTitle,
        function(done, testArgs) {},
        [
          ['incorrect', 'stuff'],
          ['cat']
        ]
      );
    }
    catch (e) {
      error = e.toString();
    }

    expect(spy.called);
    expect(spy.threw());
    expect(error).to.equal(
      'Error: mismatched number of unroll values passed in'
    );

    done();
  });

  it('with keys that are not of String type', function(done) {
    var error = '';

    try {
      unroll(testTitle,
          function(done, testArgs) {},
          [
            ['incorrect', {}],
            ['cat', 'dog']
          ]
      );
    }
    catch (e) {
      error = e.toString();
    }

    expect(spy.called);
    expect(spy.threw());
    expect(error).to.equal('' +
      'Error: Incorrect type for arg:"[object Object]"  - must be a string'
    );

    done();
  });
});
