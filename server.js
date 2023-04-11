//I basically wanted to get confy on sending data back to the server

var http = require('http');
var url = require('url');
var fs = require('fs');
var ip = require('ip'); //Has to be installed // npm install name
//var nodemailer = require('nodemailer'); //Has to be installed
var localtunnel = require('localtunnel');
const brain = require('brain.js');


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
    let data = ''; //Just for the test. Will be replaced by /newPhoto
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      console.log(JSON.parse(data));
      res.end('okUser');
    });

  } 

  //Send data through the url
  else if(req.url.slice(0, 5) == '/over'){
    console.log(JSON.parse(req.url.slice(5)));
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('ok we received the data');
  }

  else if(req.url.slice(0, 9) == '/newPhoto'){
    //console.log("someone tries to upload photo");
    let placeName = req.url.slice(9);
    console.log(placeName);
    
    let dataString = '';
    req.on('data', chunk => { dataString += chunk; });
    req.on('end', () => {
      let photoArray = JSON.parse(dataString);
      //console.log(photoArray[photoArray.length-1]); //Just prints the last element
      console.log(photoArray.length); //32*32*3 = 3072
      
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('okUser');
      addPhoto(photoArray, placeName);
    });
  }
  
  else if(req.url == '/train'){
    console.log("we're training");
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('ok we received the data');
    trainNetwork();
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
  else if(req.method == 'GET' && req.url == '/awake'){
    fs.readFile('keepServeoAwake.html', function(err, data) {
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
    res.write('<h2>Goto <a href="/index.html">here</a></h2>');
    res.end('<h3>Hello World</h3>');
  }
  
  else {
    res.statusCode = 404;
    res.end('Not found');
  }
}).listen(portS, () => {
  console.log('Server running at http://' + ip.address() + ':' + portS + '/');
});

function addPhoto(photoArray, placeName){

  console.log("we're trying to add a photo");
 
  const fs = require('fs');
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) throw err;
  
    var jsonData = JSON.parse(data);

    //console.log(jsonData);
    console.log(jsonData.length)
    jsonData.push(
      {
        'plN': placeName,
        'phA': photoArray
      }
    );
  
    fs.writeFile('data.json', JSON.stringify(jsonData), (err) => {
      if (err) throw err;
      console.log('Data updated successfully!');
    });
  });
    

}


let placeOptions = [
  "chair01",
  "floor01"
];

function trainNetwork(){
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) throw err;

    console.log("We opened the file");
  
    var jsonData = JSON.parse(data);

    let trainingData = [];
    for(let photo of jsonData){
      let resultArray = new Array(placeOptions.length).fill(0);
      let index = placeOptions.indexOf(photo.plN);
      resultArray[index] = 1;
      trainingData.push({'input': photo.phA, 'output': resultArray});
    }

    //console.log(trainingData[1].input.length);

    let net = new brain.NeuralNetwork({hiddenLayers: [trainingData[0].input.length, 50, 2]});

    net.train(trainingData, {
      //Even these {} are not necessary
      log: (error) => console.log(error),
      logPeriod: 1 //If not specified, will log every 10 iterations
    });

    console.log(net.run(trainingData[2].input));
    console.log(net.run(trainingData[1].input));
    
  
    
  });
}

//lt -p 8080

//ssh -R 80:localhost:8080 serveo.net

//To make an alternative always-on requested, in order to keep alive the serveo service
//But first, compare speeds of serving an image using both tunneling services