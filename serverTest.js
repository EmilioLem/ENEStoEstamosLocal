//I basically wanted to get confy on sending data back to the server

var http = require('http');
var url = require('url');
var fs = require('fs');
var ip = require('ip'); //Has to be installed // npm install name
//var nodemailer = require('nodemailer'); //Has to be installed

const portS = 8080;
//npm install localtunnel
//cmd: lt --port 8080 --subdomain thepaps

http.createServer((req, res) => {

  if(req.method == 'POST' && req.url == '/data'){
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      console.log(JSON.parse(data));
      res.end('ok we received the data');
    });

  } 
  
  else if(req.method == 'GET' && req.url == '/theTest.html'){
    fs.readFile('theTest.html', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
  }
  
  else if(req.method == 'GET' && req.url == '/'){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<h1>Hello World</h1>');
  }
  
  else {
    res.statusCode = 404;
    res.end('Not found');
  }
}).listen(portS, () => {
  console.log('Server running at http://' + ip.address() + ':' + portS + '/');
})