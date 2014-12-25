var request = require('request');

var maxRedirects = process.argv[2] || undefined;

request({uri: 'http://127.0.0.1:8681', maxRedirects: maxRedirects}, function(err) {
    console.log('error:', err);
});
