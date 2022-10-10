import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import Zoom from './ZoomMeeting/Zoom';
import CryptoJS from 'crypto-js'
import { Routes, Route, useParams, useSearchParams } from 'react-router-dom';

function App() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [meeting, setMeeting] = useState(true)
  // const [name, setName] = useState('')
  // const [ role, setRole] = useState('')
  // const [email, setEmail] = useState('')
  return (
    <div className="App">
      {console.log({out:searchParams.get('signature')})}

      {/* <input value={name} placeholder='Username' onChange={e => setName(e.target.value)}/><br/>
      <input value={email} placeholder='email' onChange={e => setEmail(e.target.value)}/><br/>
      <input value={role} placeholder='role' onChange={e => setRole(e.target.value)}/><br/> */}
      {meeting?<Zoom signature={searchParams.get('signature')} meeting_id={searchParams.get('meeting_id')} meeting_password={searchParams.get('meeting_password')} email={searchParams.get('email')} username={searchParams.get('username')}/>:
      <div>

        <button onClick={()=>{
          setMeeting(true)
        }}>Error</button>
       </div> 
        }
    </div>
  );
}

export default App;
