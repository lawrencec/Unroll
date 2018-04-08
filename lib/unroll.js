(function () {
  const NULL = 'unroll$null';
  const UNDEFINED = 'unroll$undefined';

  function isNULLSymbol (value) {
    return typeof value === 'symbol' && Symbol.keyFor(value) === NULL;
  }

  function isUNDEFINEDSymbol (value) {
    return typeof value === 'symbol' && Symbol.keyFor(value) === UNDEFINED;
  }

  function isString (value) {
    return typeof value === 'string';
  }

  function throwIfNotAString (value) {
    const isStringifed = isStringifiedJSON(value);
    if (value && (!isString(value) || isStringifed)) {
      const errorValue = (isStringifed) ? value : JSON.stringify(value);
      throw (new Error(`Incorrect type for arg:"${errorValue}" - must be a string`));
    }
  }

  function isStringifiedJSON (value) {
    try {
      JSON.parse(value);
    } catch (e) {
      return false;
    }
    return true;
  }

  function parseValue (value) {
    if (isNULLSymbol(value)) {
      return null;
    }
    if (isUNDEFINEDSymbol(value)) {
      return undefined;
    }
    if (value === NULL) {
      return null;
    }
    if (value === UNDEFINED) {
      return undefined;
    }
    try {
      return JSON.parse(value.match(/\[.*?\]/) ? value.slice(0) : value);
    } catch (e) {
      return value;
    }
  }

  function throwIfNoMatch (value, matcher) {
    if (!value.match(matcher)) {
      throw (
        new Error(`Incorrect value for arg:"${JSON.stringify(value)}" - requires "${matcher.toString().replace(/(\/)/g, '')}"`)
      );
    }
  }

  function throwifNotNestedArray (data) {
    if (data[0].constructor !== Array) {
      throw (new Error(
        `You specified unroll, but did not specify any unrolledItems.
         unroll=' + ${JSON.stringify(data)} 
         Check your values (is it a nested array?).`
      ));
    }
  }

  function extractDataFromDataArray (data) {
    throwifNotNestedArray(data);
    return {variableNames: data.slice(0, 1)[0], variableRows: data.slice(1)};
  }

  function extractDataFromDataTable (data) {
    throwIfNoMatch(data, /where:/);
    const dataRows = data
      .split(/\r?\n/)
      .filter(function (row) {
        return !(row.trim().match(/where:/)) && row.trim();
      });

    const variableNames = dataRows[0]
      .split('|')
      .map(function (variableName) {
        return variableName.trim();
      });

    const variableRows = dataRows
      .slice(1)
      .map(function (dataRow) {
        return dataRow.split('|')
          .map(function (v) {
            const trimmedValue = v.trim();
            return isString(trimmedValue) && !Number.isNaN(Number(trimmedValue))
              ? parseFloat(trimmedValue)
              : trimmedValue;
          });
      });

    return {variableNames, variableRows};
  }

  function extractData (data) {
    if (Array.isArray(data)) {
      return extractDataFromDataArray(data);
    } else if (isString(data)) {
      return extractDataFromDataTable(data);
    } else {
      throw new Error('unroll data should be a String or an Array. See docs!');
    }
  }

  function extractValue (value, arg) {
    const parsedValue = value;

    if (arg.indexOf('.') > 0) {
      const nestedName = arg.split('.')[1];
      if (!nestedName || !parsedValue.hasOwnProperty(nestedName)) {
        throw new Error(`${nestedName} not found in arg: ${JSON.stringify(parsedValue)}`);
      }
      return parsedValue[nestedName];
    }

    return parsedValue;
  }

  function isES7Async (func) {
    const string = func.toString().trim();

    return !!(
      // native
      string.match(/^async /) ||
      // babel (this may change)
      string.match(/return _ref(.*).apply/)
    );
  }

  function isCallbackStyle (testFunc) {
    return testFunc.length === 2;
  }

  function getStringValue (value) {
    const type = typeof value;
    if (value !== null && type === 'object') {
      return JSON.stringify(value);
    } else if (type === 'number') {
      return value;
    }
    return `"${value}"`;
  }

  function throwIfTitleNotFullyExpanded (unrolledTestTitle, titleArgs, unrolledArgs) {
    const sortedTitleArgs = titleArgs.map(token => token.replace('#', '').split('.')[0]).sort();
    const sortedUnrolledArgs = Object.keys(unrolledArgs).sort();
    if (sortedTitleArgs.length > sortedUnrolledArgs.length || sortedUnrolledArgs.toString().indexOf(sortedTitleArgs.toString()) === -1) {
      throw (new Error('title not expanded as incorrect args passed in'));
    }
  }

  function throwIfUnrolledRowDoesNotMatchVariables (unrolled, variableNames) {
    if (unrolled.length !== variableNames.length) {
      throw (new Error('mismatched number of unroll values passed in'));
    }
  }

  function throwIfGrammarUnspecified (grammar) {
    if (!grammar) {
      throw new Error('No grammar specified: Use unroll.use() to specify test function');
    }
  }

  function invokeTestFunction (testFunc, unrolledArgs) {
    if (isES7Async(testFunc)) {
      return function () { return testFunc.apply(null, Array.prototype.slice.apply(arguments).concat(unrolledArgs)); };
    } else if (isCallbackStyle(testFunc)) {
      return function (done) { testFunc(done, unrolledArgs); };
    }
    return function () { testFunc(unrolledArgs); };
  }

  function buildUnrolledArgs (variableNames, unrolled) {
    return variableNames.reduce(function (acc, variableName, index) {
      throwIfNotAString(variableName);
      return Object.assign({}, acc, {[variableName]: parseValue(unrolled[index])});
    }, {});
  }

  function buildUnrolledTestTitle (title, unrolledArgs) {
    const titleArgs = (title.match(/#\w+(\.\w+)?/g) || []);

    throwIfTitleNotFullyExpanded(title, titleArgs, unrolledArgs);

    const unrolledTestTitle = titleArgs.reduce(function (acc, matchedArgToken) {
      const testArgName = matchedArgToken.replace('#', '').split('.')[0];
      return acc.replace(
        matchedArgToken,
        getStringValue(extractValue(unrolledArgs[testArgName], matchedArgToken))
      );
    }, title);

    return unrolledTestTitle;
  }

  /**
   * parameterizes test functions
   *
   * @param {String} title  title of test with parameterized values
   * @param {Function} testFunc test function
   * @param {Array|String} unrolledValues data table of values (nested array)
   */
  function unroll (title, testFunc, unrolledValues) {
    throwIfGrammarUnspecified(unroll.grammar);
    const { variableNames, variableRows } = extractData(unrolledValues);

    variableRows.forEach(function (unrolledRow) {
      throwIfUnrolledRowDoesNotMatchVariables(unrolledRow, variableNames);
      const unrolledArgs = buildUnrolledArgs(variableNames, unrolledRow);
      const unrolledTestTitle = buildUnrolledTestTitle(title, unrolledArgs);

      unroll.grammar(unrolledTestTitle, invokeTestFunction(testFunc, unrolledArgs));
    });
  }

  // eslint-disable-next-line immutable/no-mutation
  unroll.use = function use (testFn) {
    // eslint-disable-next-line immutable/no-mutation
    unroll.grammar = testFn;
    return unroll.grammar;
  };

  // eslint-disable-next-line immutable/no-mutation
  unroll.NULL = Symbol.for(NULL);
  // eslint-disable-next-line immutable/no-mutation
  unroll.UNDEFINED = Symbol.for(UNDEFINED);

  /* istanbul ignore next */
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    // eslint-disable-next-line immutable/no-mutation
    module.exports = unroll;
  } else {
    // eslint-disable-next-line immutable/no-mutation
    window.unroll = unroll;
  }
})();
