//I basically wanted to get confy on sending data back to the server

var http = require('http');
var url = require('url');
var fs = require('fs');
var ip = require('ip'); //Has to be installed // npm install name
//var nodemailer = require('nodemailer'); //Has to be installed
var localtunnel = require('localtunnel');


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

  else if(req.method == 'POST' && req.url == '/photo'){
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      console.log(JSON.parse(data));
      res.end('we received data from the user');
    });

  } 

  else if(req.url.slice(0, 5) == '/over'){
    console.log(JSON.parse(req.url.slice(5)));
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('ok we received the data');
  }
  
  else if(req.method == 'GET' && req.url == '/theTest.html'){
    fs.readFile('theTest.html', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
  }




  else if(req.method == 'GET' && req.url == '/index.html'){
    fs.readFile('index.html', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
  }
  else if(req.method == 'GET' && req.url == '/script.js'){
    fs.readFile('script.js', function(err, data) {
      res.writeHead(200, {'Content-Type': 'application/js'});
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
  /*localtunnel(portS, { subdomain: 'thePrototype' }, (err, tunnel) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Tunnel URL:', tunnel.url);
    }
  });
  lt -p 8080
  */
});

//ssh -R 80:localhost:8080 serveo.net
