module.exports = {
    text (response, content){
        response.writeHead(200, { 'content-type': 'text/plain', 'access-control-allow-origin': '*' });
        response.end(JSON.stringify(content));
    },
    html (response, html) {
        response.writeHead(200, { 'content-type': 'text/html', 'access-control-allow-origin': '*', 'charset': 'utf-8' });
        response.end(html);
    }
};