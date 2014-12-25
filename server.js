const PORT = 8681;
var maxRedirects = process.argv[2] || 10;
var url = require('url');
require('http').createServer(function(req, res){
    var u = url.parse(req.url);
    var cnt;
    var b = u.path.split('/');
    if (!b[1]) {
        cnt = 1;
    } else {
        cnt = Number(b[1]) + 1;
        if (cnt >= maxRedirects) {
            console.log('Max redirect:', cnt);
            return res.end();
        }
    }
    var redirectTo = 'http://127.0.0.1:' + PORT + '/' + cnt;
    res.writeHead(301, {
        location: redirectTo
    });
    res.end();
}).listen(PORT);

