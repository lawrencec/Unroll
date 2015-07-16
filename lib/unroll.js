var grammar = it;
function unroll(title, testFunc, unrolledValues) {
    var unrolledKeys = unrolledValues.shift(),
        _callTestFunc,
        _getValue;

    _callTestFunc = function (testFunc, unrolledArgs) {
        return function (done) {
            testFunc.apply(null, [done, unrolledArgs]);
        };
    };

    _getValue = function (value) {
        var type = typeof value;
        if (type === 'object') {
            return Object.prototype.toString.call(value);
        }
        else if (type === 'number') {
            return value;
        }
        return '"' + value + '"';
    };

    unrolledValues.forEach(function (unrolled) {
        var unrolledTestName = title,
            unrolledArgs = {};
        if (unrolled.length !== unrolledKeys.length) {
            throw(new Error('mismatched number of unroll values passed in'));
        }
        unrolledKeys.forEach(function (value, index) {
            if (typeof value !== 'string') {
                throw(new Error('Incorrect type for arg:"' + value + '"  - must be a string'));
            }
            var unrolledValue = unrolled[index];
            unrolledTestName = unrolledTestName.replace(
                '#' + value,
                _getValue(unrolledValue)
            );
            unrolledArgs[value] = unrolledValue;
        });
        if (unrolledTestName.indexOf('#') > -1) {
            throw(new Error('title not expanded as incorrect args passed in'));
        }
        grammar(unrolledTestName, _callTestFunc(testFunc, unrolledArgs));
    });
}
unroll.use = function (grammarType) {
    if (grammarType) {
        switch (grammarType) {
            case 'tdd':
                grammar = test;
                break;
            case 'qunit':
                grammar = test;
                break;
            case 'bdd':
            default:
                grammar = it;
                break;
        }
    } else {
        console.info(grammarType + " is not a valid grammar type.")
    }
    return grammar;
};
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = unroll;
}
else {
    window.unroll = unroll;
}
