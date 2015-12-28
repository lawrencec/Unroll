Unroll [![Build Status](https://drone.io/github.com/lawrencec/Unroll/status.png)](https://drone.io/github.com/lawrencec/Unroll/latest)
======

A helper tool (for browser and node tests) to easily iterate through test data against a single test method with output about each test iteration and its parameters. Or in other words a helper method to parameterize your tests.

It is an attempt to provide similar behaviour to the [Unroll annotation]
(https://spockframework.github.io/spock/docs/1.0/data_driven_testing.html#_method_unrolling) from [Spock](https://code.google.com/p/spock/).

Unroll works by decorating the testing library function so it works with any testing library e.g  [Jasmine](https://jasmine.github.io/), [Mocha](http://visionmedia.github.com/mocha/), [Tape](https://github.com/substack/tape), [AVA](https://github.com/sindresorhus/ava). The example directory has working examples of each.


## Install

    npm install unroll

## Usage

Include `unroll` in your test file and configure.

	var unroll = require('unroll');
	unroll.use(it); // specify test library function here.

Instead of calling the testing library function e.g `it` or `test`, call `unroll` with three arguments:

- name of the test with parameterized names
- test function
- data table of parameters to pass to tests.

Note the use of `#` character to prefix parameter name and the additional argument `testArgs` from which to reference the arguments.

      ```
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


## Examples

The following example is the same shown in example/mocha-bdd-example.js file. It can be run using Mocha eg:

    mocha -R spec ./mocha-bdd-example.js


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

      unroll.use(it);
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


The examples directory has examples for Mocha's tdd, bdd and qunit interfaces in both js and coffeescript flavours.

Use mocha arguments to specify the interface and coffeescript if required:

bdd javascript

    mocha -R spec example/mocha-bdd-example.js

tdd javascript

    mocha -R spec -u tdd example/mocha-tdd-example.js

qunit javascript

    mocha -R spec -u qunit example/mocha-qunit-example.js

bdd coffeescript

    mocha -R spec --compilers coffee:coffee-script example/mocha-bdd-example.coffee

tdd coffeescript

    mocha -R spec -u tdd --compilers coffee:coffee-script example/mocha-tdd-example.coffee

qunit coffeescript

    mocha -R spec -u qunit --compilers coffee:coffee-script example/mocha-qunit-example.coffee



## Tests

Tests can be run, from the project root directory, via:

    npm test

A coverage report can be generated in target/lcov-report/index.html via:
	
    npm run coverage

Browser tests can be run via karma (install the dev dependencies first):

    karma start test/conf/karma.conf.js


