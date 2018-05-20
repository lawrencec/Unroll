Unroll [![Build Status](https://travis-ci.org/lawrencec/Unroll.svg?branch=master)](https://travis-ci.org/lawrencec/Unroll)[![Test Coverage](https://api.codeclimate.com/v1/badges/354f9071b3236f402f4e/test_coverage)](https://codeclimate.com/github/lawrencec/Unroll/test_coverage)
=====================================================================================================================================================================================================================================================================================

A helper tool (for browser and node tests) to easily iterate through test data against a single test method with output about each test iteration and its parameters. Or in other words a helper method to parameterize your tests.

It is an attempt to provide similar behaviour to the [Unroll annotation]
(https://spockframework.github.io/spock/docs/1.0/data_driven_testing.html#_method_unrolling) from [Spock](https://code.google.com/p/spock/).

Unroll works by decorating the testing library function so it works with any testing library e.g  [Jasmine](https://jasmine.github.io/), [Mocha](http://mochajs.org/), [Tape](https://github.com/substack/tape) and [AVA](https://github.com/sindresorhus/ava). The `examples` directory has working examples of each. See below for instructions on how to run them.


## Install

	$> npm install unroll

To run the unit tests or the examples:

	$> npm install

`npm run` commands expects `node_modules/.bin/` to be in `$PATH`.

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

The data table can also be specified using a template literal if nested arrays aren't your thing. For example the above can be written
like so when using template literals.

    ```
	describe('maximum of two numbers (unrolled)', function() {
        unroll('maximum of #a and #b is #c',
          function(done, testArgs) {
            expect(
              Math.max(testArgs['a'], testArgs['b'])
            ).to.be.equal(testArgs['c']);
            done();
          },
          `
            where:
            a   |   b   |   c
            3   |   5   |   5
            7   |   0   |   7
          `
        );
    });

Note, that objects and arrays need to be stringified first:

    ```
    unroll('The #thing was jumped over by #entity.',
        () => {},
        `
          where:
          entity                            |   thing
          cat                               |   moon
          1                                 |   2
          ${JSON.stringify({name: 'cat'})}  |   ${JSON.stringify({name: 'moon'})}
        `
      );

# Null and undefined values

To test for undefined null and undefined values, use the following syntax. This is because there is an error check to see
if all required values have been passed and values of null and undefined defeat that test. A replacement value is used to state
the intention but the actual value of null or undefined will be passed to the test.

    ```
    unroll('should be okay with id being #id', (done, testArgs) => {
        let object = { id: testArgs.id };
        expect(object.id).toEqual(testArgs.id);
        done();
    },
    `
        where:
        id
        ${Symbol.keyFor(unroll.NULL)}
        ${Symbol.keyFor(unroll.UNDEFINED)}
    `
    );
    and the array notation:

    unroll('should be okay with id being #id', (done, testArgs) => {
        let object = { id: testArgs.id };
        expect(object.id).toEqual(testArgs.id);
        done();
    },
    [
       ['id']
       [null],
       [undefined],
       [Unroll.NULL],
       [Unroll.UNDEFINED],
    ]


    ```

make

## Examples

The following example is the same shown in examples/mocha-bdd-example.js file. It can be run using Mocha eg:

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


      maximum of two numbers(unrolled)
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

Another way of using unroll can be

      unroll.use(it);
      describe('maximum of two numbers (unrolled)', function() {
        unroll('calculates the maximum of #b and #a',
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

Here the title parameters are out of sequence with the sequence of the testArgs passed.
The output for this type of usage would be something like:

      maximum of two numbers
        - calculates the maximum of 5 and 3
        - calculates the maximum of 0 and 7

      ✔ 2 tests complete (6ms)

and a failing test would show the following:

      maximum of two numbers (unrolled)
        ✓ calculates the maximum of 5 and 3
        1) calculates the maximum of 0 and 7


      ✖ 1 of 2 tests failed:

      1) maximum of two numbers (unrolled) calculates the maximum of 0 and 7 is 0:
         expected 7 to equal 0

The examples directory has examples for various testing frameworks. There are `npm run` commands to run each example or one can run all the examples with:

	$> npm run examples

### Mocha

Mocha's allows one use different interfaces e.g tdd, bdd and qunit. Run all the examples for each with:

	$> npm run example-mocha

### AVA

	$> npm run example-ava

### Tape

	$> npm run example-tape

### Jasmine

	$> npm run example-jasmine


## Tests

Tests can be run, from the project root directory, via:

    $> npm test

Browser tests can be run via karma (install the dev dependencies first):

    $> npm run test-browser

A coverage report can be generated in target/lcov-report/index.html via:

    $> npm run coverage

## Lint

Linting can be tested with:

	$> npm run lint


