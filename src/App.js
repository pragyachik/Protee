import { useState, useEffect } from "react";
import * as THREE from 'three';
import "./chatbox.css"

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

console.log("openai")


// const DEFAULT_PARAMS = {
//   "model": "text-davinci-003",
//   "temperature": 0,//0.7,
//   "max_tokens": 7,//256,
//   // "top_p": 1,
//   // "frequency_penalty": 0,
//   // "presence_penalty": 0
// }

// const getQuery =  async function query(params = {}) {
//   const params_ = { ...DEFAULT_PARAMS, ...params };
//   const requestOptions = {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': 'Bearer ' + String(openai_api_key)
//     },
//     body: JSON.stringify(params_)
//   };
//   const response = await fetch('https://api.openai.com/v1/completions', requestOptions);
//   const data = await response.json();
//   return data.choices[0].text;
// }



function downloadInnerHtml(filename, value, mimeType) {
  var link = document.createElement('a');
  mimeType = mimeType || 'text/plain';

  link.setAttribute('download', filename);
  link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(value));
  link.click(); 
}




const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function animate() {
  requestAnimationFrame( animate );

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render( scene, camera );
}

animate();

const App = () => {
  const [response, setResponse] = useState("chatgpt output")
  const [userRequest, setUserRequest] = useState("Say this is a test")
  const [errormessage, setErrorMessage] = useState("200 OK")
  const [showButton, setShowButton] = useState(true)
  const [status, setStatus] = useState(200)
  // const [unformattedResponseText, setUnformattedResponseText] = useState("")
  

  useEffect(()=>{
    renderer.setSize( window.innerWidth, window.innerHeight-1);
    document.getElementById('three').innerHTML = ""
    document.getElementById('three').appendChild(renderer.domElement);
  },[])

  const callChatGPT = async (thesis=false) => {
    setShowButton(false)
    console.log(userRequest)
    let prompt = userRequest
    if(thesis){
      prompt = "Write a ten page thesis, in APA style, including citations and bibliography, on the topic\"" + userRequest + "\"";
    }
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0,
      max_tokens: 1000,
    });
    setStatus(Number(response.status))
    if(Number(response.status)!=200){
      setErrorMessage(JSON.stringify(response))
    }
    console.log(response)
    setShowButton(true)
    // setUnformattedResponseText(response.data.choices[0].text)
    let responseText = response.data.choices[0].text//.replaceAll("\n","<br>");
    console.log(responseText)
    setResponse(responseText)
  }

  const getVal = (value) => {
    setUserRequest(value.target.value)
  }

  const downloadResponse = () => {
    // let value = document.getElementById("outputBox").innerHTML;
    downloadInnerHtml("output.txt", response,'text/html');
  }

  return (
    <div className="App">
      <div className="chatbox">
        <div className="chatbox__title">
            Chatbox
        </div>
        <div className="chatbox__chatarea">
          <textarea className="chatbox__textarea" onChange={getVal} placeholder="enter text here" rows="6" cols="30"></textarea>
          {showButton? <><br></br><button className="chatbox__enter" onClick={()=>callChatGPT(false)}>get chat response</button><button className="chatbox__enter" onClick={()=>callChatGPT(true)}>get thesis</button></> : <div>Loading...</div>}
        </div>
      </div>
      <div className="chatoutputbox">
        <div>
          <button className="chatbox__download" onClick={downloadResponse}>download response</button>
        </div>
        <div id="outputBox" className="chatbox__outputarea">
          {status==200?response:errormessage}
        </div>
      </div>
      <div id="three"></div>
    </div>
  );
}

export default App;
