module.exports = function copyObj(src, dest = {}) {
    function copy(src, dest) {
        for (let prop in src) {
            if (src[prop] instanceof Array) {
                dest[prop] = src[prop].slice();
            } else if (typeof src[prop] === 'object' && src[prop] !== null) {
                dest[prop] = {};
                copy(src[prop], dest[prop]);
            } else {
                dest[prop] = src[prop];
            }
        }
    };
    if (typeof src === 'object' && src !== null) {
        copy(src, dest = (typeof dest === 'object' ? (dest !== null ? dest : {}) : {}));
    }
    return dest;
};