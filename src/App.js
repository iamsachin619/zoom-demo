import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import Zoom from './ZoomMeeting/Zoom';
import CryptoJS from 'crypto-js'


function App() {
  const [meeting, setMeeting] = useState(false)
  const [name, setName] = useState('')
  const [ role, setRole] = useState('')
  const [email, setEmail] = useState('')
  return (
    <div className="App">

      <input value={name} placeholder='Username' onChange={e => setName(e.target.value)}/><br/>
      <input value={email} placeholder='email' onChange={e => setEmail(e.target.value)}/><br/>
      <input value={role} placeholder='role' onChange={e => setRole(e.target.value)}/><br/>
      {meeting?<Zoom name={name} roleUser={role} Email={email}/>:
      <div>

        <button onClick={()=>{
          setMeeting(true)
        }}>Join meeting</button>
       </div> 
        }
    </div>
  );
}

export default App;
