//Modules
var config      = require('./config.js')(),
    Express     = require('express'),
    express     = Express(),
    http        = require('http'),
    https       = require('https'),
    httpServer  = null,
    httpsServer = null,
    FS          = require('fs'),
    PostGetter  = require('./modules/postgetter.js'),
    Response    = require('./modules/response.js'),
    //Try load certificates for HTTPS
    credentials = {
        cert: FS.existsSync(config.CERTS.CERT)  ? FS.readFileSync(config.CERTS.CERT, 'utf8')    : null,
        key : FS.existsSync(config.CERTS.KEY)   ? FS.readFileSync(config.CERTS.KEY, 'utf8')     : null
    };

//Create servers
httpServer = http.createServer(express);
httpServer.listen(config.DEFAULT_PORTS.HTTP);
if (credentials.cert !== null && credentials.key !== null) {
    httpsServer = https.createServer(credentials, express);
    httpsServer.listen(config.DEFAULT_PORTS.HTTPS);
}

//Open access to static files
express.use(Express.static(__dirname.replace('server', '/client/public')));

//favicon.ico
express.get('/favicon.ico', function (request, response) {
    response.send(200);
});

//Listener for API
express.post('/', function (request, response) {
    let postgetter = new PostGetter(request);
    postgetter.get((data, err) => {
        if (typeof data === 'object' && data !== null && typeof data.game === 'string') {
            let ppp = __dirname + '/modules/games/' + data.game.toLowerCase() + '.js';
            if (FS.existsSync(__dirname + '/modules/games/' + data.game.toLowerCase() + '.js')) {
                let Controller = require(__dirname + '/modules/games/' + data.game.toLowerCase() + '.js'),
                    controller = new Controller(response, data);
                controller.proceed();
            } else {
                Response.text(response, { error: 'Cannot find controller for game. Check parameter [game].' });
            }
        } else {
            Response.text(response, { error: 'Cannot find a parameter [game].' });
        }
    });
});

