//I basically wanted to get confy on sending data back to the server

var http = require('http');
var url = require('url');
var fs = require('fs');
var ip = require('ip'); //Has to be installed // npm install name
//var nodemailer = require('nodemailer'); //Has to be installed
var localtunnel = require('localtunnel');
const brain = require('brain.js');

const net = new brain.NeuralNetworkGPU({hiddenLayers: [/*trainingData[0].input.length*/3072, 50, 2]});

const portS = 8080;

http.createServer((req, res) => {

  if(req.method == 'POST' && req.url == '/data'){
    //Deprecated
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      console.log(JSON.parse(data));
      res.end('ok we received the data');
    });

  } 

  else if(req.method == 'POST' && req.url == '/photo'){
    let data = ''; //Just for the test... actually, receives unknow photos and classifies it
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      
      res.writeHead(200, {'Content-Type': 'application/JSON'});

      console.log(JSON.parse(data).length);
      
      res.end(JSON.stringify(net.run(JSON.parse(data))));
    });

  } 

  //Send data through the url, deprecated
  else if(req.url.slice(0, 5) == '/over'){
    console.log(JSON.parse(req.url.slice(5)));
    //res.writeHead(200, {'Content-Type': 'text/plain'}); //Didn't displayed the data
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
      console.log(photoArray[photoArray.length-1]); //Just prints the last element
      //console.log(photoArray.length); //32*32*3 = 3072
      
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
    //Not really in use
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

  else if(req.method == 'GET' && req.url == '/index2.html'){
    fs.readFile('index2.html', function(err, data) {
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

  else if(req.method == 'GET' && req.url == '/script2.js'){
    fs.readFile('script2.js', function(err, data) {
      res.writeHead(200, {'Content-Type': 'application/js'});
      res.write(data);
      res.end();
    });
  }

  /*
  else if(req.method == 'GET' && (req.url == '/index.html' || req.url == '/index2.html')){
    fs.readFile(req.url/*'index.html'*, function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
  }
  else if(req.method == 'GET' && (req.url == '/script.js' || req.url == '/script2.js')){
    fs.readFile(req.url/*'script.js'*, function(err, data) {
      res.writeHead(200, {'Content-Type': 'application/js'});
      res.write(data);
      res.end();
    });
  }
  */
  
  else if(req.method == 'GET' && req.url == '/awake'){
    fs.readFile('keepServeoAwake.html', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
  }




  
  else if(req.method == 'GET' && req.url == '/'){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<h2>Goto <a href="/index2.html">here</a></h2>');
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
 
  const fs = require('fs');
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) throw err;
  
    var jsonData = JSON.parse(data);

    //console.log(jsonData);
    //console.log(jsonData.length)
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
    if (err){
      console.log("We could't open the file, then we will create one");
      fs.writeFile('data.json', '[]', (err5) => {
        if (err5) throw err5;
        console.log('data.json file created');
      });
    }

    console.log("We opened the file");
  
    var jsonData = JSON.parse(data);

    let trainingData = [];
    for(let photo of jsonData){
      let resultArray = new Array(placeOptions.length).fill(0);
      let index = placeOptions.indexOf(photo.plN);
      resultArray[index] = 1;
      trainingData.push({'input': photo.phA, 'output': resultArray});
    }

    console.log(trainingData.length);
    console.log(trainingData[1].input);
    console.log(trainingData[1].input.length);




    if(fs.existsSync('./nnw.json')){ //Neural Network
      fs.readFile('nnw.json', 'utf8', (err2, data2) => {
        console.log("We try to read the nnw file");
        if (err2){
          console.log("We couldn't read the nnw file");
          //console.log(err2);
        } else {
          console.log("We read the nnw file");
          //net.fromJSON(JSON.parse(data2));
          console.log(typeof(JSON.parse(data2)));
          console.log("We loaded the last nnw");
        }
      });
      console.log("the nnw file exists");
      //Buuuuuuuuuuut it is not learned ;(
    }else{
      console.log("We didn't find the file nnw");
      fs.writeFile('nnw.json', "[]", (err3) => {
        if (err3) throw err3;
        console.log('nnw.json file created succesfully');
        
        //console.log(jsonData);
        //console.log(jsonData.length);
        //console.log(json);
        
        
        
        
        
        
        
        
        
        
        net.train(trainingData, {
          //Even these {} are not necessary
          log: (error) => console.log(error),
          logPeriod: 1 //If not specified, will log every 10 iterations
        });
        
        //console.log(JSON.stringify(net.toJSON));
        fs.writeFile('nnw.json', JSON.stringify(net.toJSON()), (err3) => {
          if (err3) throw err3;
          console.log('network saved succesfully');
        });
        
        
        /*fs.writeFile('nnwF.js', JSON.stringify(net.toFunction()), (err3) => {
          if (err3) throw err3;
          console.log('standalone function saved succesfully');
        });*/
        
        console.log(trainingData[2].input.length);
        console.log(net.run(trainingData[2].input));
        console.log(net.run(trainingData[1].input));
        
        
        
        
        
        
        
      });
    }
        
        
      });
    }
    
    //lt -p 8080
    
    //ssh -R 80:localhost:8080 serveo.net
    
    //To make an alternative always-on requested, in order to keep alive the serveo service
    //But first, compare speeds of serving an image using both tunneling services





    //(Se supone que añadí funcionalidad de guardar la red neuronal en su forma nativa, y como función simple)
    