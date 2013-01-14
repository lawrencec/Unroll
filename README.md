Unroll
======

A helper tool to easily iterate through test data against a test method with verbose output about each iteration.

It is an attempt to provide similar behaviour to the [Unroll annotation](http://docs.spockframework.org/en/latest/data_driven_testing.html#method-unrolling) from [Spock](https://code.google.com/p/spock/).

##Install

    npm install unroll

##Usage

I've only tested it with [ChaiJS](http://chaijs.com/) and [Mocha](http://visionmedia.github.com/mocha/) and primarily in bdd mode but it should support the other mocha's interfaces too eg tdd.

##Tests

Tests can be run, from the project root directory, via:

    npm test

##Example

The following example is the same shown in example/example.js file. It can be run using Mocha eg:

    mocha -R spec ./example.js


Using a similar example from the above spock unroll documentation, a simple test of testing maximum of two numbers eg:

    describe('maximum of two numbers', function() {

      it('is performed correctly', function(done) {
        expect(Math.max(3, 5)).to.be.equal(5);
        expect(Math.max(7, 0)).to.be.equal(7);
        done();
      });
  
    });

The test output would look like the following:


      maximum of two numbers
        ✓ is performed correctly 

      ✔ 1 test complete (4ms)

whilst a failing test would look like:

      maximum of two numbers
        1) is performed correctly


      ✖ 1 of 1 test failed:

      1) maximum of two numbers is performed correctly:
         expected 7 to equal 0


But using unroll(), like so:


    describe('maximum of two numbers (unrolled)', function() {
      unroll('maximum of #a and #b is #c',
        function(done, testArgs) {
          expect(
            Math.max(testArgs['a'], testArgs['b'])
          ).to.be.equal(testArgs['c']);
          done();
        },
        [
          ['a', 'b', 'c'],
          [ 3,   5,   5 ],
          [ 7,   0,   7 ]
        ]
      );
    });

would give an unrolled test output like:


      maximum of two numbers
        - maximum of 3 and 5 is 5
        - maximum of 7 and 0 is 7

      ✔ 2 tests complete (6ms)

and a failing test would show the following:

      maximum of two numbers (unrolled)
        ✓ maximum of 3 and 5 is 5 
        1) maximum of 7 and 0 is 0


      ✖ 1 of 2 tests failed:

      1) maximum of two numbers (unrolled) maximum of 7 and 0 is 0:
         expected 7 to equal 0

##Todo

- Probably more extensive tests.
- There is potential to remove the requirement for the testArgs parameter within the testFunc by providing the values as a global and the cleaning it up after each iteration. In fact this was how the initial code worked but mocha's global-leak checks run before the values can be cleaned up which make it flag global leak error.