// eslint-disable-next-line no-use-before-define
var chai = chai || require('chai');
// eslint-disable-next-line no-use-before-define
var sinon = sinon || require('sinon');
// eslint-disable-next-line no-use-before-define
var unroll = unroll || require('../../lib/unroll.js');
var assert = chai.assert;
if (typeof window === 'undefined') {
  var sinonChai = require('sinon-chai');
  chai.use(sinonChai);
}

const testTitle = 'The #entity jumped over the #thing.';
let sandbox;
let testSpy;

const match = sinon.match;
beforeEach(function () {
  sandbox = sinon.sandbox.create();
  sinon.assert.expose(assert, { prefix: '' });
  testSpy = sandbox.spy(function () {});
  unroll.use(testSpy);
});

afterEach(function () {
  sandbox.restore();
});

// let testSpy;
//
// test.beforeEach(function () {
//   testSpy = spy();
//   unroll.use(testSpy);
// });
describe('unroll()', () => {
  describe('outputs test title correctly', () => {
    it('(array.notation) when called with falsy values or function ref', () => {
      unroll(
        testTitle,
        () => {},
        [
          ['entity', 'thing'],
          [undefined, 'moon'],
          [parseInt, 'planet']
        ]
      );
      assert.callCount(testSpy, 2);
      assert.calledWithExactly(testSpy, 'The "undefined" jumped over the "moon".', match.func);
      assert.calledWithExactly(testSpy, 'The "parseInt" jumped over the "planet".', match.func);
    });

    it('(array.notation) when called with string values', () => {
      unroll(
        testTitle,
        () => {},
        [
          ['entity', 'thing'],
          ['cat', 'moon'],
          ['dog', 'planet']
        ]
      );
      assert.callCount(testSpy, 2);
      assert.calledWithExactly(testSpy, 'The "cat" jumped over the "moon".', match.func);
      assert.calledWithExactly(testSpy, 'The "dog" jumped over the "planet".', match.func);
    });

    it('(array.notation) when called with string values, use $index', () => {
      unroll(
        '$index) ' + testTitle,
        () => {},
        [
          ['entity', 'thing'],
          ['cat', 'moon'],
          ['dog', 'planet']
        ]
      );
      assert.callCount(testSpy, 2);
      assert.calledWithExactly(testSpy, '1) The "cat" jumped over the "moon".', match.func);
      assert.calledWithExactly(testSpy, '2) The "dog" jumped over the "planet".', match.func);
    });

    it('(array.notation) when called with object values', () => {
      unroll(
        testTitle,
        () => {},
        [
          ['entity', 'thing'],
          ['cat', {isAnObject: true}],
          ['dog', 'planet']
        ]
      );
      assert.callCount(testSpy, 2);
      assert.calledWithExactly(testSpy, 'The "cat" jumped over the {"isAnObject":true}.', match.func);
      assert.calledWithExactly(testSpy, 'The "dog" jumped over the "planet".', match.func);
    });

    it('(array.notation) when called with object values, use $index', () => {
      unroll(
        '$index) ' + testTitle,
        () => {},
        [
          ['entity', 'thing'],
          ['cat', {isAnObject: true}],
          ['dog', 'planet']
        ]
      );
      assert.callCount(testSpy, 2);
      assert.calledWithExactly(testSpy, '1) The "cat" jumped over the {"isAnObject":true}.', match.func);
      assert.calledWithExactly(testSpy, '2) The "dog" jumped over the "planet".', match.func);
    });

    it('(array.notation) when called with object values and title references subkey', () => {
      unroll(
        'The #entity jumped over the #thing.name.',
        () => {},
        [
          ['entity', 'thing'],
          ['cat', {name: 'dog'}]
        ]
      );
      assert.callCount(testSpy, 1);
      assert.calledWithExactly(testSpy, 'The "cat" jumped over the "dog".', match.func);
    });

    it('(array.notation) when called with array values', () => {
      unroll(
        testTitle,
        () => {},
        [
          ['entity', 'thing'],
          ['cat', [1, 2]],
          ['dog', 'planet']
        ]
      );
      assert.callCount(testSpy, 2);
      assert.calledWithExactly(testSpy, 'The "cat" jumped over the [1,2].', match.func);
      assert.calledWithExactly(testSpy, 'The "dog" jumped over the "planet".', match.func);
    });

    it('(array.notation) when called with number values', () => {
      unroll(
        'The maximum value of #a and #b is #c.',
        () => {},
        [
          ['a', 'b', 'c'],
          [3, 5, 5],
          [0, 7, 7]
        ]
      );
      assert.callCount(testSpy, 2);
      assert.calledWith(testSpy, 'The maximum value of 3 and 5 is 5.', match.func);
      assert.calledWith(testSpy, 'The maximum value of 0 and 7 is 7.', match.func);
    });

    it('(array.notation) when called with incorrect sequence of testArgs in the title', () => {
      unroll('The #thing was jumped over by #entity.',
        () => {},
        [
          ['entity', 'thing'],
          ['cat', 'moon'],
          [1, 2],
          [{name: 'cat'}, {name: 'moon'}]
        ]
      );

      assert.callCount(testSpy, 3);
      assert.calledWithExactly(testSpy, 'The "moon" was jumped over by "cat".', match.func);
      assert.calledWithExactly(testSpy, 'The 2 was jumped over by 1.', match.func);
      assert.calledWithExactly(testSpy, 'The {"name":"moon"} was jumped over by {"name":"cat"}.', match.func);
    });

    it('(datatable.notation) when called with string values', () => {
      unroll(
        testTitle,
        () => {},
        `
          where:
          entity  |   thing
          cat     |   moon
          dog     |   planet
        `
      );
      assert.callCount(testSpy, 2);
      assert.calledWithExactly(testSpy, 'The "cat" jumped over the "moon".', match.func);
      assert.calledWithExactly(testSpy, 'The "dog" jumped over the "planet".', match.func);
    });

    it('(datatable.notation) when called with object values', () => {
      unroll(
        testTitle,
        () => {},
        `
          where:
          entity  |   thing
          cat     |   ${JSON.stringify({isAnObject: true})}
          dog     |   planet
        `
      );
      assert.callCount(testSpy, 2);
      assert.calledWithExactly(testSpy, 'The "cat" jumped over the {"isAnObject":true}.', match.func);
      assert.calledWithExactly(testSpy, 'The "dog" jumped over the "planet".', match.func);
    });

    it('(datatable.notation) when called with object values and title references subkey', () => {
      unroll(
        'The #entity jumped over the #thing.name.',
        () => {},
        `
          where:
          entity  |   thing
          cat     |   ${JSON.stringify({name: 'dog'})}
        `
      );
      assert.callCount(testSpy, 1);
      assert.calledWithExactly(testSpy, 'The "cat" jumped over the "dog".', match.func);
    });

    it('(datatable.notation) when called with array values', () => {
      unroll(
        testTitle,
        () => {},
        `
          where:
          entity  |   thing
          cat     |   ${JSON.stringify([1, 2])}
          dog     |   planet
        `
      );
      assert.callCount(testSpy, 2);
      assert.calledWithExactly(testSpy, 'The "cat" jumped over the [1,2].', match.func);
      assert.calledWithExactly(testSpy, 'The "dog" jumped over the "planet".', match.func);
    });

    it('(datatable.notation) when called with number values', () => {
      unroll(
        'The maximum value of #a and #b is #c.',
        () => {},
        ` 
          where:
          a | b | c
          3.2 | 5.3 | 5.3 
          7 | 0 | 7
        `
      );
      assert.callCount(testSpy, 2);
      assert.calledWithExactly(testSpy, 'The maximum value of 3.2 and 5.3 is 5.3.', match.func);
      assert.calledWithExactly(testSpy, 'The maximum value of 7 and 0 is 7.', match.func);
    });

    it('(datatable.notation) when called with incorrect sequence of testArgs in the title', () => {
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

      assert.callCount(testSpy, 3);
      assert.calledWithExactly(testSpy, 'The "moon" was jumped over by "cat".', match.func);
      assert.calledWithExactly(testSpy, 'The 2 was jumped over by 1.', match.func);
      assert.calledWithExactly(testSpy, 'The {"name":"moon"} was jumped over by {"name":"cat"}.', match.func);
    });
  });
});

describe('calls the test function', () => {
  let dummyContainer;

  beforeEach(() => {
    dummyContainer = {
      it: function (title, fn) {
        assert.equal(typeof fn, 'function');
        fn();
      }
    };
  });

  it(
    'when no unroll data is passed',
    () => {
      unroll.use(dummyContainer.it);
      const myRoutes = [
        ['entity', 'thing'],
        ['cat', 'baby']
      ];

      unroll(
        'The #entity jumped over the #thing.',
        async function (testArgs) {
          assert.equal(testArgs.entity, 'cat');
          assert.equal(testArgs.thing, 'baby');
          await 12;
        },
        myRoutes
      );
    }
  );

  it('(array.notation) with unrolled test arguments correctly when testFunc specifies a callback', () => {
    unroll.use(dummyContainer.it);

    const possibleTitles = [
      'The #entity jumped over the #thing.',
      'The #thing was jumped over by the #entity.',
      'The #entity jumped.',
      'The #thing was jumped over.',
      'There was a jump.',
      ''
    ];

    const possibleValues = [
      ['cat', 'moon'],
      [1, 2],
      [[1, 2, 3], [4, 5, 6]],
      [{name: 'cat', type: 'animal'}, {name: 'moon', type: 'object'}]
    ];

    possibleValues.forEach(function (value) {
      possibleTitles.forEach(
        function (title) {
          unroll(title,
            function (done, testArgs) {
              assert.equal(arguments.length, 2);
              assert.equal(typeof testArgs, 'object');
              assert.equal(Object.keys(testArgs).length, 2);
              assert.equal(Object.keys(testArgs).join(','), 'entity,thing');
              assert.equal(testArgs.entity, value[0]);
              assert.equal(testArgs.thing, value[1]);
            },
            [
              ['entity', 'thing'],
              value
            ]
          );
        }
      );
    });
  });

  it('(array.notation) with unrolled test arguments correctly when testFunc does not specify a callback', () => {
    unroll.use(dummyContainer.it);

    const possibleTitles = [
      'The #entity jumped over the #thing.',
      'The #thing was jumped over by the #entity.',
      'The #entity jumped.',
      'The #thing was jumped over.',
      'There was a jump.',
      ''
    ];

    const possibleValues = [
      ['cat', 'moon'],
      [1, 2],
      [[1, 2, 3], [4, 5, 6]],
      [{name: 'cat', type: 'animal'}, {name: 'moon', type: 'object'}]
    ];

    possibleValues.forEach(function (value) {
      possibleTitles.forEach(
        function (title) {
          unroll(title,
            function (testArgs) {
              assert.equal(arguments.length, 1);
              assert.equal(typeof testArgs, 'object');
              assert.equal(Object.keys(testArgs).length, 2);
              assert.equal(Object.keys(testArgs).join(','), 'entity,thing');
              assert.equal(testArgs.entity, value[0]);
              assert.equal(testArgs.thing, value[1]);
            },
            [
              ['entity', 'thing'],
              value
            ]
          );
        }
      );
    });
  });

  it(
    '(array.notation) and titles are unrolled correctly when unroll args are reused across testcases',
    () => {
      unroll.use(dummyContainer.it);
      const myRoutes = [
        ['entity', 'thing'],
        ['cat', 'baby']
      ];

      unroll(
        'The #entity jumped over the #thing.',
        function (done, testArgs) {
          assert.equal(testArgs.entity, 'cat');
          assert.equal(testArgs.thing, 'baby');
        },
        myRoutes
      );
      unroll(
        'The #entity jumped over the #thing.',
        function (done, testArgs) {
          assert.equal(testArgs.entity, 'cat');
          assert.equal(testArgs.thing, 'baby');
        },
        myRoutes
      );
    }
  );

  it(
    '(array.notation) and titles are unrolled correctly when test function is async',
    () => {
      unroll.use(dummyContainer.it);
      const myRoutes = [
        ['entity', 'thing'],
        ['cat', 'baby']
      ];

      unroll(
        'The #entity jumped over the #thing.',
        async function (testArgs) {
          assert.equal(testArgs.entity, 'cat');
          assert.equal(testArgs.thing, 'baby');
          await 12;
        },
        myRoutes
      );
    }
  );

  it(
    '(datatable.notation) values are unrolled correctly and keep type when a number',
    () => {
      unroll.use(dummyContainer.it);
      const myRoutes = `
        where:
        a  | b
        5  | 7.4
      `;

      unroll(
        '#a and #b.',
        function (testArgs) {
          assert.isNumber(testArgs.a);
          assert.isNumber(testArgs.b);
          assert.strictEqual(testArgs.a, 5);
          assert.strictEqual(testArgs.b, 7.4);
        },
        myRoutes
      );
    }
  );

  it(
    '(datatable.notation) values are unrolled correctly and keep type when a string',
    () => {
      unroll.use(dummyContainer.it);
      const myRoutes = `
        where:
        a     | b
        foo   | bar
      `;

      unroll(
        '#a and #b.',
        function (testArgs) {
          assert.isString(testArgs.a);
          assert.isString(testArgs.b);
          assert.strictEqual(testArgs.a, 'foo');
          assert.strictEqual(testArgs.b, 'bar');
        },
        myRoutes
      );
    }
  );

  it(
    '(datatable.notation) values are unrolled correctly and keep type when an array',
    () => {
      unroll.use(dummyContainer.it);
      const myRoutes = `
        where:
        a                             | b
        ${JSON.stringify(['foo'])}    | ${JSON.stringify(['bar'])}
      `;

      unroll(
        '#a and #b.',
        function (testArgs) {
          assert.isArray(testArgs.a);
          assert.isArray(testArgs.b);
          assert.deepEqual(testArgs.a, ['foo']);
          assert.deepEqual(testArgs.b, ['bar']);
        },
        myRoutes
      );
    }
  );

  it(
    '(datatable.notation) values are unrolled correctly and keep type when an object',
    () => {
      unroll.use(dummyContainer.it);
      const myRoutes = `
        where:
        a                             | b
        ${JSON.stringify({foo: 1})}    | ${JSON.stringify({bar: 2})}
      `;

      unroll(
        '#a and #b.',
        function (testArgs) {
          assert.isObject(testArgs.a);
          assert.isObject(testArgs.b);
          assert.deepEqual(testArgs.a, {foo: 1});
          assert.deepEqual(testArgs.b, {bar: 2});
        },
        myRoutes
      );
    }
  );

  it(
    '(datatable.notation) and titles are unrolled correctly when unroll args are reused across testcases',
    () => {
      unroll.use(dummyContainer.it);

      unroll(
        'The #entity jumped over the #thing.',
        function (done, testArgs) {
          assert.equal(testArgs.entity, 'cat');
          assert.equal(testArgs.thing, 'baby');
        },
        `
          where:
          entity  | thing
          cat     | baby
        `
      );
      unroll(
        'The #entity jumped over the #thing.',
        function (done, testArgs) {
          assert.equal(testArgs.entity, 'cat');
          assert.equal(testArgs.thing, 'baby');
        },
        `
          where:
          entity  | thing
          cat     | baby
        `
      );
    }
  );

  it(
    '(datatable.notation) and titles are unrolled correctly when test function is async',
    () => {
      unroll.use(dummyContainer.it);
      const myRoutes = `
        where:
        entity  | thing
        cat     | baby
      `;

      unroll(
        'The #entity jumped over the #thing.',
        async function (testArgs) {
          assert.equal(testArgs.entity, 'cat');
          assert.equal(testArgs.thing, 'baby');
          await 12;
        },
        myRoutes
      );
    }
  );
});

describe('throws exception', () => {
  it(
    'when data is not a string or an array',
    () => {
      const testTitle = 'The #entity jumped over the #thing.';

      let error = '';

      try {
        unroll(testTitle,
          () => {},
          {}
        );
      } catch (e) {
        error = e.toString();
      }

      assert.equal(error, 'Error: unroll data should be a String or an Array. See docs!');
    });
  it(
    '(array.notation) when incorrectly called with mismatched unroll key/title values',
    () => {
      const testTitle = 'The #entity jumped over the #thing.';

      let error = '';

      try {
        unroll(testTitle,
          () => {},
          [
            ['incorrect', 'stuff'],
            ['bar', 'moon']
          ]
        );
      } catch (e) {
        error = e.toString();
      }

      assert.equal(error, 'Error: title not expanded as incorrect args passed in');
    });

  it(
    '(array.notation) when incorrectly called with mismatched number of unroll key/title values',
    () => {
      let error = '';

      try {
        unroll(testTitle,
          function () {},
          [
            ['incorrect', 'stuff'],
            ['cat']
          ]
        );
      } catch (e) {
        error = e.toString();
      }

      assert.equal(error, 'Error: mismatched number of unroll values passed in');
    }
  );

  it(
    '(array.notation) when incorrectly called with keys that are not of String type',
    () => {
      let error = '';

      try {
        unroll(testTitle,
          function () {},
          [
            ['incorrect', {shouldNotBeAnObject: true}],
            ['cat', 'dog']
          ]
        );
      } catch (e) {
        error = e.toString();
      }

      assert.equal(error, 'Error: Incorrect type for arg:"{"shouldNotBeAnObject":true}" - must be a string');
    }
  );

  it(
    '(array.notation) when incorrectly called with incorrectly subkey references in title',
    () => {
      const testTitle = 'The #entity jumped over the #thing.INCORRECT.';
      let error = '';

      try {
        unroll(testTitle,
          function () {},
          [
            ['entity', 'thing'],
            ['cat', {name: 'dog'}]
          ]
        );
      } catch (e) {
        error = e.toString();
      }

      assert.equal(error, 'Error: INCORRECT not found in arg: {"name":"dog"}');
    }
  );

  it(
    '(array.notation) with unrolled values not wrapped in an array',
    () => {
      let error = '';

      try {
        unroll(testTitle,
          function () {},
          ['foo', 'baz'],
          ['x', 'y']
        );
      } catch (e) {
        error = e.toString();
      }

      assert.include(error, 'nested array');
    }
  );

  it(
    '(datatable.notation) when incorrectly called with mismatched unroll key/title values',
    () => {
      const testTitle = 'The #entity jumped over the #thing.';

      let error = '';

      try {
        unroll(testTitle,
          () => {},
          `
            where:
            incorrect | stuff
            bar       | moon
          `
        );
      } catch (e) {
        error = e.toString();
      }

      assert.equal(error, 'Error: title not expanded as incorrect args passed in');
    }
  );

  it(
    '(datatable.notation) when incorrectly called with mismatched number of unroll key/title values',
    () => {
      let error = '';

      try {
        unroll(testTitle,
          function () {},
          `
            where:
            incorrect | stuff,
            cat
          `
        );
      } catch (e) {
        error = e.toString();
      }

      assert.equal(error, 'Error: mismatched number of unroll values passed in');
    }
  );

  it(
    '(datatable.notation) when incorrectly called with keys that are not of String type',
    () => {
      let error = '';

      try {
        unroll(testTitle,
          function () {},
          `
            where:
            incorrect   | ${JSON.stringify({shouldNotBeAnObject: true})}
            cat         | dog
          `
        );
      } catch (e) {
        error = e.toString();
      }

      assert.equal(error, 'Error: Incorrect type for arg:"{"shouldNotBeAnObject":true}" - must be a string');
    }
  );

  it(
    '(datatables.notation) when incorrectly called with incorrectly subkey references in title',
    () => {
      const testTitle = 'The #entity jumped over the #thing.INCORRECT.';
      let error = '';

      try {
        unroll(testTitle,
          function () {},
          `
            where:
            entity  | thing
            cat     | ${JSON.stringify({name: 'dog'})}
          `
        );
      } catch (e) {
        error = e.toString();
      }

      assert.equal(error, 'Error: INCORRECT not found in arg: {"name":"dog"}');
    }
  );

  it(
    '(datatables.notation) when incorrectly called with data does not contain "where:" clause',
    () => {
      const testTitle = 'The #entity jumped over the #thing';
      let error = '';

      try {
        unroll(testTitle,
          function () {},
          `
            entity  | thing
            cat     | dog
          `
        );
      } catch (e) {
        error = e.toString();
      }

      // assert.equal(error.replace(/\/n/g, ''), 'Error: Incorrect value for arg:""\\n            entity  | thing\\n            cat     | dog\\n          "" - requires "where:');
      assert.equal(error.indexOf('Error: Incorrect value for arg:'), 0);
    }
  );
});

describe('use()', () => {
  it(
    'must return the correct specified grammar',
    function () {
      const grammar = unroll.use(function () {});
      assert.equal(typeof grammar, 'function');
    }
  );

  it(
    '(array.notation) should throw error if no grammar specified',
    () => {
      let error = '';
      try {
        unroll.use(null);
        unroll(testTitle,
          function () {},
          [
            ['entity', 'thing'],
            ['cat', {}]
          ]
        );
      } catch (e) {
        error = e.toString();
      }

      assert.equal(error, 'Error: No grammar specified: Use unroll.use() to specify test function');
    }
  );

  it(
    '(datatable.notation) should throw error if no grammar specified',
    () => {
      let error = '';
      try {
        unroll.use(null);
        unroll(testTitle,
          function () {},
          `
            where:
            entity  | thing
            cat     | {}
          `
        );
      } catch (e) {
        error = e.toString();
      }

      assert.equal(error, 'Error: No grammar specified: Use unroll.use() to specify test function');
    }
  );
});

describe('async() functions', () => {
  it(
    '(array.notation) are called correctly',
    () => {
      unroll.use(testSpy);
      const testTitle = 'The #entity jumped over the moon #times times.';
      unroll(testTitle,
        async function () {
          await 12;
        },
        [
          ['entity', 'times'],
          ['cat', 6]
        ]
      );
      assert.equal(testSpy.callCount, 1);
      assert.equal(testSpy.firstCall.args[0], 'The "cat" jumped over the moon 6 times.');
    }
  );

  it(
    '(datatable.notation) are called correctly',
    () => {
      unroll.use(testSpy);
      const testTitle = 'The #entity jumped over the moon #times times.';
      unroll(testTitle,
        async function (testArgs) {
          await 12;
        },
        `
          where:
          entity  | times
          cat     |  6
        `
      );
      assert.equal(testSpy.callCount, 1);
      assert.equal(testSpy.firstCall.args[0], 'The "cat" jumped over the moon 6 times.');
    }
  );
});
