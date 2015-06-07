var chai = chai || require('chai'),
    sinon = sinon || require('sinon'),
    unroll = unroll || require('../../lib/unroll.js');

if (typeof window === 'undefined') {
  sinonChai = require('sinon-chai');
  chai.use(sinonChai);
}
var expect = chai.expect;

describe('unroll()', function() {
  describe('outputs test title correctly', function() {
    var testTitle = 'The #entity jumped over the #thing.',
        spy;

    beforeEach(function() {
      unroll.grammar = function() {};
      spy = sinon.spy(unroll, 'grammar');
    });

    afterEach(function() {
      unroll.grammar.restore();
      delete unroll.grammar;
    });

    it('when correctly called with string values', function(done) {
      unroll(testTitle,
        function(done, testArgs) {

        },
        [
          ['entity', 'thing'],
          ['cat', 'moon']
        ]
      );
      expect(spy.callCount).to.equal(1);
      expect(spy.firstCall.args[0]).to.equal('The "cat" jumped over the "moon".');
      done();
    });

    it('when correctly called with object values', function(done) {
      var testTitle = 'The #entity jumped over the #thing.';
      unroll(testTitle,
          function(done, testArgs) {},
          [
            ['entity', 'thing'],
            ['cat', {}]
          ]
      );
      expect(spy.callCount).to.equal(1);
      expect(spy.firstCall.args[0]).to.equal('The "cat" jumped over the [object Object].');
      done();
    });

    it('when correctly called with array values', function(done) {
      var testTitle = 'The #entity jumped over the #thing.';
      unroll(testTitle,
          function(done, testArgs) {

          },

          [
            ['entity' ,   'thing'],
            ['cat'    ,   [1]]
          ]
      );
      expect(spy.callCount).to.equal(1);
      expect(spy.firstCall.args[0]).to.equal('The "cat" jumped over the [object Array].');
      done();
    });

    it('when correctly called with number values', function(done) {
      var testTitle = 'The #entity jumped over the moon #times times.';
      unroll(testTitle,
          function(done, testArgs) {

          },

          [
            ['entity' ,   'times'],
            ['cat'    ,   6]
          ]
      );
      expect(spy.callCount).to.equal(1);
      expect(spy.firstCall.args[0]).to.equal('The "cat" jumped over the moon 6 times.');
      done();
    });
  });

  describe('calls the test function', function() {
    var testTitle = 'The #entity jumped over the #thing.';

    it('with unrolled test arguments correctly', function(done) {
      var theGlobal = typeof window !== 'undefined'
        ? window
        : global;

      var stub = sinon.stub(theGlobal, 'it', function(title, fn) {
        expect(fn).to.be.a('function');
        fn();
      });

      unroll(testTitle,
              function(done, testArgs) {
                expect(arguments.length).to.equal(2);
                expect(testArgs).to.be.an('object');
                expect(Object.keys(testArgs).length).to.equal(2);
                expect(Object.keys(testArgs).join(',')).to.equal('entity,thing');
                expect(testArgs.entity).to.equal('cat');
                expect(testArgs.thing).to.equal('moon');
              },

              [
                ['entity', 'thing'],
                ['cat', 'moon']
              ]
      );
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

  describe('.use()', function() {
      var testTitle = 'The #entity jumped over the #thing.';


    it('must return the correct specified grammar', function () {
      var theGlobal = typeof window !== 'undefined'
        ? window
        : global;
      theGlobal.test = function() {};
      var grammar = unroll.use('tdd');
      expect(grammar).to.be.a('function');
      grammar = unroll.use('bdd');
      expect(grammar).to.be.a('function');
      grammar = unroll.use('qunit');
      expect(grammar).to.be.a('function');
      grammar = unroll.use('unknown');
      expect(grammar).to.be.a('null');
      theGlobal.test = null;
    });

    it('should use bdd if no grammar specified', function() {
      var spy = sinon.spy(unroll, 'use');
      unroll.grammar = null;
      unroll(testTitle,
          function(done, testArgs) {

          },

          [
            ['entity', 'thing'],
            ['cat', {}]
          ]
      );
      expect(spy.callCount).to.equal(1);
      expect(spy.firstCall.args[0]).to.equal('bdd');
      unroll.use.restore();
      spy.reset();
    });
  });
});
