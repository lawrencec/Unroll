var grammar;

/**
 * parameterizes test functions
 *
 * @param {String} title  title of test with parameterized values
 * @param {Function} testFunc test function
 * @param {Array} unrolledValues data table of values (nested array)
 */
function unroll(title, testFunc, unrolledValues) {
  if (!grammar) {
    throw new Error(
        'No grammar specified: Use unroll.use() to specify test function'
    );
  }

  var unrolledKeys = unrolledValues.shift();
  var _callTestFunc;
  var _getValue;

  _callTestFunc = function(testFunc, unrolledArgs) {
    return function(done) {
      testFunc(done, unrolledArgs);
    };
  };

  _getValue = function(value) {
    var type = typeof value;
    if (type === 'object') {
      return Object.prototype.toString.call(value);
    } else if (type === 'number') {
      return value;
    }
    return '"' + value + '"';
  };

  unrolledValues.forEach(function(unrolled) {
    var unrolledTestName = title;
    var unrolledArgs = {};
    if (unrolled.length !== unrolledKeys.length) {
      throw (new Error('mismatched number of unroll values passed in'));
    }
    unrolledKeys.forEach(function(value, index) {
      if (typeof value !== 'string') {
        throw (new Error(
            'Incorrect type for arg:"' + value + '"  - must be a string')
        );
      }
      var unrolledValue = unrolled[index];
      unrolledTestName = unrolledTestName.replace(
        '#' + value,
        _getValue(unrolledValue)
      );
      unrolledArgs[value] = unrolledValue;
    });
    if (unrolledTestName.indexOf('#') > -1) {
      throw (new Error('title not expanded as incorrect args passed in'));
    }

    grammar(unrolledTestName, _callTestFunc(testFunc, unrolledArgs));
  });
}

unroll.use = function(testFn) {
  grammar = testFn;
  return grammar;
};

/* istanbul ignore next */
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = unroll;
} else {
  window.unroll = unroll;
}
