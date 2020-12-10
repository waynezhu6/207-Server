async function getJSON(){
  //gets event data from remote API

  let params = document.URL.split("/");
  if(params.length < 2)
    return;
  
  //replace localhost with VPS address!
  let url = "http://localhost:5000/json/" + params[params.length - 1];
  console.log(url);

  let result = await fetch(url, {
    headers : { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
     }
  });

  return result.json();
}