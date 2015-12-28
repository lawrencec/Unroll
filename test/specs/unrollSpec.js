var chai = chai || require('chai');
var sinon = sinon || require('sinon');
var unroll = unroll || require('../../lib/unroll.js');

if (typeof window === 'undefined') {
  var sinonChai = require('sinon-chai');
  chai.use(sinonChai);
}
var expect = chai.expect;

describe('unroll()', function() {
  describe('outputs test title correctly', function() {
    var testTitle = 'The #entity jumped over the #thing.';
    var sandbox;
    var spy;

    beforeEach(function() {
      sandbox = sinon.sandbox.create();
      spy = sandbox.spy(function() {});
      unroll.use(spy);
    });

    afterEach(function() {
      sandbox.restore();
    });

    it('when correctly called with string values', function(done) {
      unroll(testTitle,
        function() {

        },
        [
          ['entity', 'thing'],
          ['cat', 'moon']
        ]
      );
      expect(spy.callCount).to.equal(1);
      expect(spy.firstCall.args[0])
            .to
            .equal('The "cat" jumped over the "moon".');
      done();
    });

    it('when correctly called with object values', function(done) {
      var testTitle = 'The #entity jumped over the #thing.';
      unroll(testTitle,
        function() {},
        [
          ['entity', 'thing'],
          ['cat', {}]
        ]
      );
      expect(spy.callCount).to.equal(1);
      expect(spy.firstCall.args[0])
            .to
            .equal('The "cat" jumped over the [object Object].');
      done();
    });

    it('when correctly called with array values', function(done) {
      var testTitle = 'The #entity jumped over the #thing.';
      unroll(testTitle,
        function() {},
        [
          ['entity', 'thing'],
          ['cat', [1]]
        ]
      );
      expect(spy.callCount).to.equal(1);
      expect(spy.firstCall.args[0])
            .to
            .equal('The "cat" jumped over the [object Array].');
      done();
    });

    it('when correctly called with number values', function(done) {
      var testTitle = 'The #entity jumped over the moon #times times.';
      unroll(testTitle,
        function() {},
        [
          ['entity', 'times'],
          ['cat', 6]
        ]
      );
      expect(spy.callCount).to.equal(1);
      expect(spy.firstCall.args[0])
          .to
          .equal('The "cat" jumped over the moon 6 times.');
      done();
    });
  });

  describe('calls the test function', function() {
    var testTitle = 'The #entity jumped over the #thing.';

    it('with unrolled test arguments correctly', function(done) {
      var dummyContainer = {
        it: function() {}
      };
      var stub = sinon.stub(dummyContainer, 'it', function(title, fn) {
        expect(fn).to.be.a('function');
        fn();
      });
      unroll.use(stub);
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
    var testTitle = 'The #entity jumped over the #thing.';
    var spy;

    beforeEach(function() {
      unroll.grammar = null;
      unroll.use(it);
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
          function() {},
          [
            ['incorrect', 'stuff'],
            ['bar', 'moon']
          ]
        );
      } catch (e) {
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
          function() {},
          [
            ['incorrect', 'stuff'],
            ['cat']
          ]
        );
      } catch (e) {
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
            function() {},
          [
              ['incorrect', {}],
              ['cat', 'dog']
          ]
        );
      } catch (e) {
        error = e.toString();
      }

      expect(spy.called);
      expect(spy.threw());
      expect(error).to.equal(
        'Error: Incorrect type for arg:"[object Object]"  - must be a string'
      );

      done();
    });
  });

  describe('.use()', function() {
    beforeEach(function() {
      unroll.use(null);
    });
    var testTitle = 'The #entity jumped over the #thing.';

    it('must return the correct specified grammar', function() {
      var grammar = unroll.use(function() {});
      expect(grammar).to.be.a('function');
    });

    it('should use throw error if no grammar specified', function() {
      var error = '';
      try {
        unroll(testTitle,
          function() {},
          [
            ['entity', 'thing'],
            ['cat', {}]
          ]
        );
      } catch (e) {
        error = e.toString();
      }

      expect(error).to.equal(
        'Error: No grammar specified: Use unroll.use() to specify test function'
      );
    });
  });
});
