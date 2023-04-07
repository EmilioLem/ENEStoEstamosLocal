async function frameRendering() {
  //context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
  Vctx.drawImage(videoO, 0, 0);//, pW * 2, pH * 2, 0, 0, pW, pH); //Quad-pixel
  dataO = Vctx.getImageData(0, 0, pW, pH).data;
  //await updateHistogram(); //I do this aquard thing because it is not a plain array
  setTimeout(frameRendering, 1);
}

  
function takePhotoSaveData(){
  let dataM = dataO.slice();

  //console.log(typeof dataM);

  /*************************************
  const uint8Array = new Uint8ClampedArray(10000000).map(() => Math.floor(Math.random() * 255));
 
 //Recomended by ChatGPT, faster on nodejs:
 console.time('Spread operator');
 const simpleArray1 = [...uint8Array];
 console.timeEnd('Spread operator');
 
 console.time('Array.from()');
 const simpleArray2 = Array.from(uint8Array); //fasterOnBrowsers
 console.timeEnd('Array.from()');*/
 
 dataM = [...dataM];


 let dataMlength = dataM.length; //se altera dentro del for
 for (let i = 1; i <= dataMlength/4; i++) {
   dataM.splice(3*i, 1);
  }
  
  
  //Algo más desarrollado que un prompt... darle la opción de contribuir con varias fotos a un mismo lugar... seleccionando el lugar si ya está disponible (y agregar rutina para organizar los lugares  :')
  
  let msgImage = prompt("Introduzca una breve descripción del lugar que ve", "Aquí se puede ver...");
  if(msgImage != null) localStorage.setItem(msgImage, JSON.stringify(dataM));
}

function exportData(){
  for(let i=0; i<localStorage.length; i++){
    alert(localStorage.key(i));
  }
}
//.getItem, key, setItem, length, removeItem

function invertColor() {
  //console.time("invertColor");
  dataI = dataO.slice();  //The data we will manipulate
  let iDisplay = Ictx.createImageData(pW, pH);
  iData = iDisplay.data; //The array that will revive the data
  
  for (let i = 0; i < dataI.length; i++) {
    if(i%4 == 3){
      iData[i] = dataI[i];
    }else{
      iData[i] = 255 - dataI[i];
    }
  }
  
  Ictx.putImageData(iDisplay, 0, 0);
  //console.timeEnd("invertColor");
  setTimeout(invertColor, 3.33);
}

var rValues = new Array(256).fill(0);
var gValues = new Array(256).fill(0);
var bValues = new Array(256).fill(0);

const svg = d3.select("body")
  .append("svg")
  .attr("width", 800)
  .attr("height", 300);

const xScale = d3.scaleLinear()
  .domain([0, 255])
  .range([50, 750]);

const yScale = d3.scaleLinear()
  .domain([0, 1])
  .range([250, 50]);

const line = d3.line()
  .x((d, i) => xScale(i))
  .y(d => yScale(d));




svg.append("path")
  .datum(rValues)
  .attr("fill", "none")
  .attr("stroke", "red")
  .attr("stroke-width", 2)
  .attr("d", line);

svg.append("path")
  .datum(gValues)
  .attr("fill", "none")
  .attr("stroke", "green")
  .attr("stroke-width", 2)
  .attr("d", line);

svg.append("path")
  .datum(bValues)
  .attr("fill", "none")
  .attr("stroke", "blue")
  .attr("stroke-width", 2)
  .attr("d", line);


function updateHistogram() {
  const pixels = [...dataO.slice()];
  
  //Divide them between the bigger one is better than getting their proportion over the entire amount of color per channel
  
  rValues = new Array(256).fill(0);
  gValues = new Array(256).fill(0);
  bValues = new Array(256).fill(0);

  // Adds the amount of each color
  for (let i = 0; i < pixels.length; i += 4) {
    rValues[pixels[i]]++;//.push(pixels[i]);
    
    gValues[pixels[i + 1]]++;//.push(pixels[i + 1]);
    
    bValues[pixels[i+2]]++;//.push(pixels[i + 2]);
  }

  let maxRinHistogram = Math.max(...rValues);
  let maxGinHistogram = Math.max(...gValues);
  let maxBinHistogram = Math.max(...bValues);
  
  for (let i = 0; i < 256; i ++) {
    rValues[i] /= maxRinHistogram;
    gValues[i] /= maxGinHistogram;
    bValues[i] /= maxBinHistogram;
  }

  ///////////////////////////

  svg.selectAll("path")
    .data([rValues, gValues, bValues])
    .transition()
    .duration(100)
    .attr("d", line);





  ///////////////////

  setTimeout(updateHistogram, 100);
}
