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
  

  useEffect(()=>{
    console.log("in useeffect")
    console.log(userRequest)
    renderer.setSize( window.innerWidth, window.innerHeight-1);
    document.getElementById('three').innerHTML = ""
    document.getElementById('three').appendChild(renderer.domElement);
  },[])

  const callChatGPT = async () => {
    console.log(userRequest)
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: userRequest,
      temperature: 0,
      max_tokens: 10,
    });
    console.log(response)
    let responseText = response.data.choices[0].text;
    setResponse(responseText)
  }

  const getVal = (value) => {
    setUserRequest(value.target.value)
  }

  return (
    <div className="App">
      <div className="chatbox">
        <div className="chatbox__title">
            Chatbox
        </div>
        <div className="chatbox__chatarea">
          <input className="chatbox__textarea" type="textarea" onChange={getVal} placeholder="enter text here"></input>
          <button className="chatbox__enter" onClick={callChatGPT}>enter</button>
        </div>
        <div className="chatbox__outputarea">
          {response}
        </div>
      </div>
      <div id="three"></div>
    </div>
  );
}

export default App;
