const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const imageLoader = document.getElementById('imageLoader');

imageLoader.addEventListener('change', handleImage, false);

function handleImage(e) {
  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.getElementById('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 32, 32);
      sendPhoto([...ctx.getImageData(0, 0, 32, 32).data]);
    }
    img.src = event.target.result;
  }
  reader.readAsDataURL(e.target.files[0]);
}

function sendPhoto(imageData){
  let imageDataLength = imageData.length;
  for (let i = 1; i <= imageDataLength/4; i++) {
    imageData.splice(3*i, 1);
  }
  console.log(imageData);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(imageData)
  };
  var objectSeen = document.querySelector("#objectSeen").value;
  if(objectSeen == 'whatIsThis'){
    //let data = document.getElementById("data");
    fetch('/photo', options).then(response => response.json()).then(data => {
      console.log(typeof(data));
      console.log(data); //{0: 0.08904503285884857, 1: 0.9103144407272339}
      //let dataStr = JSON.stringify(data);  
      //console.log(dataStr);

      let valuesStr = "";
      for (let property in data) {
        valuesStr += `${property}: ${data[property]} , `;
      }
    
      //console.log(data['0']);
      document.getElementById("data").innerText = /*JSON.stringify(data);*/valuesStr;
    });
  }else{
    fetch("/newPhoto"+objectSeen, options)
      .then(response => {
        alert(response.statusText); // Output: Data received successfully
        console.log(response);
      })
      .catch(error => {
        console.error('Error:', error);
      });       
  }
}