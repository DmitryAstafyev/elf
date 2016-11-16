var copyObj = require('./modules/tools/copyobj.js'),
    config  = {
        DEFAULT_PORTS   : {
            HTTP        : 8124,
            HTTPS       : 8888
        },
        CERTS           : {
            CERT        : '/etc/nginx/ssl/cert.pem',
            KEY         : '/etc/nginx/ssl/cert.key'
        }
    };
module.exports = () => { return copyObj(config, null); };
