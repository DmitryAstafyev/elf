"strict mode";
var events = require('./events.js');
class TextFileReader {
    constructor(file) {
        if (window.FileReader !== void 0) {
            if (typeof file !== 'undefined') {
                this.file = file;
            } else {
                throw new Error('File should be defined.');
            }
        } else {
            throw new Error('Browser does not support fs API.');
        }
    }
    load(callback) {
        var fileReader = new FileReader();
        events.add(fileReader, 'load', (event) => {
            fileReader = null;
            if (event.target !== void 0 && event.target.result !== void 0) {
                typeof callback === 'function' && callback(event.target.result, void 0);
            } else {
                typeof callback === 'function' && callback(void 0, event);
            }
        });
        events.add(fileReader, 'error', (event) => {
            fileReader = null;
            typeof callback === 'function' && callback(void 0, event);
        });
        fileReader.readAsText(this.file);
    }
}
module.exports = TextFileReader;