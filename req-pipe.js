var request = require('request');
var maxRedirects = process.argv[2] || undefined;

request({uri: 'http://127.0.0.1:8681', maxRedirects: maxRedirects}).on('response', function() {
    console.log('on response');
}).on('end', function(){
    console.log('on end');
}).on('error', function(err){
    console.error('error:', err);
});
