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
  var _getStringValue;
  var _throwIfNotAString;
  //var _doesKeyMatchArgument;
  var _extractValue;

  _callTestFunc = function(testFunc, unrolledArgs) {
    return function(done) {
      testFunc(done, unrolledArgs);
    };
  };

  _getStringValue = function(value) {
    var type = typeof value;
    if (type === 'object') {
      return JSON.stringify(value);
    } else if (type === 'number') {
      return value;
    }
    return '"' + value + '"';
  };

  _throwIfNotAString = function(value) {
    if (typeof value !== 'string') {
      throw (new Error(
              'Incorrect type for arg:"' +
              JSON.stringify(value) +
              '" - must be a string')
      );
    }
  };

  /*_doesKeyMatchArgument = function(key, arg) {
    return key === arg;
  };*/

  _extractValue = function(value, arg) {
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


  /*unrolledValues.forEach(function(unrolled) {
    var args = {};
    var newTitle;
    unrolledKeys.forEach(function(key, index) {
      args[key] = unrolled[index];
    });
    newTitle = title;
    title.match(/#\w+(\.\w+)?/g).forEach(function(matchedArg) {

      var unrolledValue = _extractValue(args[matchedArg.replace('#', '').split('.')[0]]);
      newTitle = newTitle.replace(matchedArg, _getStringValue(unrolledValue));

    });

    grammar(newTitle, _callTestFunc(testFunc, args));
  });*/


  unrolledValues.forEach(function(unrolled) {
    var unrolledTestName = title;
    var unrolledArgs = {};
    if (unrolled.length !== unrolledKeys.length) {
      throw (new Error('mismatched number of unroll values passed in'));
    }

    unrolledKeys.forEach(function(key, index) {
      _throwIfNotAString(unrolledKeys[index]);
      unrolledArgs[key] = unrolled[index];
    });

    unrolledTestName.match(/#\w+(\.\w+)?/g).forEach(
      function(matchedArg) {
        var unrolledValue = unrolledArgs[matchedArg.replace('#', '').split('.')[0]];

        if (!unrolledValue) {
          return;
        }

        /*if (!_doesKeyMatchArgument(
                unrolledKeys[index],
                matchedArg.replace('#', '').split('.')[0]
            )
           ) {
          return;
        }*/
        unrolledValue = _extractValue(unrolledValue, matchedArg);

        unrolledTestName = unrolledTestName.replace(
            matchedArg,
            _getStringValue(unrolledValue)
        );
        //unrolledArgs[matchedArg.replace('#', '')] = unrolledValue;
      }
    );


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
