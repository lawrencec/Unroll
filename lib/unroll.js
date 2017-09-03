var grammar;

/**
 * parameterizes test functions
 *
 * @param {String} title  title of test with parameterized values
 * @param {Function} testFunc test function
 * @param {Array} unrolledValues data table of values (nested array)
 */
function unroll (title, testFunc, unrolledValues) {
  if (!grammar) {
    throw new Error(
      'No grammar specified: Use unroll.use() to specify test function'
    );
  }

  var unrolledKeys = unrolledValues.slice(0, 1)[0];
  var unrolledItems = unrolledValues.slice(1);
  var _callTestFunc;
  var _getStringValue;
  var _throwIfNotAString;
  var _extractValue;
  var _isES7Async;
  var isCallbackStyle;

  _isES7Async = function isAsync (func) {
    const string = func.toString().trim();

    return !!(
    // native
      string.match(/^async /) ||
        // babel (this may change)
        string.match(/return _ref(.*).apply/)
    );
  };

  isCallbackStyle = function (testFunc) {
    return testFunc.length === 2;
  };

  _callTestFunc = function (testFunc, unrolledArgs) {
    if (_isES7Async(testFunc)) {
      return function () {
        return testFunc.apply(this, Array.prototype.slice.apply(arguments).concat(unrolledArgs));
      };
    } else if (isCallbackStyle(testFunc)) {
      return function (done) {
        testFunc(done, unrolledArgs);
      };
    }
    return function () {
      testFunc(unrolledArgs);
    };
  };

  _getStringValue = function (value) {
    var type = typeof value;
    if (type === 'object') {
      return JSON.stringify(value);
    } else if (type === 'number') {
      return value;
    }
    return '"' + value + '"';
  };

  _throwIfNotAString = function (value) {
    if (typeof value !== 'string') {
      throw (new Error(
        'Incorrect type for arg:"' +
              JSON.stringify(value) +
              '" - must be a string')
      );
    }
  };

  _extractValue = function (value, arg) {
    if (arg.indexOf('.') > 0) {
      var nestedName = arg.split('.')[1];
      if (!nestedName || !value.hasOwnProperty(nestedName)) {
        throw new Error(
          nestedName + ' not found in arg: ' + JSON.stringify(value)
        );
      }
      return value[nestedName];
    }
    return value;
  };

  if (unrolledValues[0].constructor !== Array) {
    throw (new Error(
      'You specified unroll, but did not specify any unrolledItems. ' +
      ' unrolledKeys=' + JSON.stringify(unrolledKeys) +
      ' unrolledItems=' + JSON.stringify(unrolledItems) +
      ' Check your values (is it a nested array?).'
    ));
  }

  unrolledItems.forEach(function (unrolled) {
    var unrolledTestName = title;
    var unrolledArgs = {};
    if (unrolled.length !== unrolledKeys.length) {
      throw (new Error('mismatched number of unroll values passed in'));
    }

    unrolledKeys.forEach(function (key, index) {
      _throwIfNotAString(unrolledKeys[index]);
      unrolledArgs[key] = unrolled[index];
    });

    (unrolledTestName.match(/#\w+(\.\w+)?/g) || [])
      .forEach(
        function (matchedArg) {
          var unrolledValue = unrolledArgs[matchedArg.replace('#', '').split('.')[0]];
          if (unrolledValue === null || unrolledValue === undefined) {
            return;
          }

          unrolledValue = _extractValue(unrolledValue, matchedArg);
          unrolledTestName = unrolledTestName.replace(
            matchedArg,
            _getStringValue(unrolledValue)
          );
        }
      );

    if (unrolledTestName.indexOf('#') > -1) {
      throw (new Error('title not expanded as incorrect args passed in'));
    }

    grammar(unrolledTestName, _callTestFunc(testFunc, unrolledArgs));
  });
}

unroll.use = function (testFn) {
  grammar = testFn;
  return grammar;
};

/* istanbul ignore next */
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = unroll;
} else {
  window.unroll = unroll;
}
