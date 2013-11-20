function unroll(title, testFunc, unrolledValues) {
    var unrolledKeys = unrolledValues.shift();


    unrolledValues.forEach(function(unrolled) {
        var unrolledTestName = title,
            unrolledArgs = {};
        if (unrolled.length !== unrolledKeys.length) {
          throw(new Error('mismatched number of unroll values passed in'));
        }
        unrolledKeys.forEach(function(value, index) {
            if (typeof value !== 'string') {
              throw(new Error('Incorrect type for arg:"' + value + '"  - must be a string'));
            }
            var unrolledValue = unrolled[index];
            unrolledTestName = unrolledTestName.replace(
                '#' + value,
                (typeof unrolledValue == 'string') ? '"' + unrolledValue + '"' : unrolledValue
            );
            unrolledArgs[value] = unrolledValue;
        });
        if (unrolledTestName.indexOf('#')>-1) {
          throw(new Error('title not expanded as incorrect args passed in'));
        }
        if (!unroll.grammar) {
          unroll.grammar = unroll._bdd();
        }
        unroll.grammar(unrolledTestName, function(done) {
            testFunc.apply(null, [done, unrolledArgs]);
        });
    });
}



unroll.use = function(grammarType) {
  if (unroll[grammarType]) {
    return unroll[grammarType];
  }
  return null;
};

unroll._bdd = function() {
  return it;
};

unroll._tdd = function() {
  return test;
};

unroll._cakes = function() {
  return scenario;
};

module.exports = unroll;
