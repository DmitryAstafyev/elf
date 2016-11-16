var unique = (function () {
    var cache = [];
    return function () {
        function getID() {
            var codeA   = 'A'.charCodeAt(0),
                codeZ   = 'Z'.charCodeAt(0),
                range   = codeZ - codeA,
                result  = '';

            for (var i = 4; i >= 0; i -= 1) {
                i !== 4 && (result += '-');
                for (var j = 4; j >= 0; j -= 1) {
                    if (Math.random() > 0.5) {
                        result += String.fromCharCode(codeA + Math.floor(Math.random() * range));
                    } else {
                        result += Math.floor(Math.random() * 9).toString();
                    }
                }
            }
            return result;
        }
        var result = '';
        do {
            result = getID();
        } while (~cache.indexOf(result));
        cache.push(result);
        return result;
    }
} ());
module.exports = unique;