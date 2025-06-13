import React, { useState } from 'react'
import '../styles/Welcome.css'
import {useNavigate} from 'react-router-dom';
import { createRoom } from '../api/Api'

function Welcome() {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async()=>{
    const roomId = await createRoom();
    setIsLoading(true);
    if(roomId){
      navigate(`/room/${roomId}`);
    }else{
      alert('Something went wrong!');
    }
    setIsLoading(false);
  }
  
  return (
    <div className='welcome'>
      <div className={'container'}>
        <div className='navbar'>
          <h1 className='logo-name'>StaySync</h1>
        </div>

        <div className='welcome-bar'>
          <h1>Welcome to Stay</h1><span className='sync'><h1>Sync</h1></span>
        </div>

        <div className='video-container'>
          <div className='video-sec'>
            <video src='staysync-vedio.mp4' autoPlay muted loop></video>
          </div>
          <h2 className='intro-para'>
            A simple platform where you can watch YouTube videos together.
          </h2>
          <button id='room-btn' disabled={isLoading} onClick={() => {handleClick()}}>Create Room</button>
        </div>
      </div>
    </div>
  )
}

export default Welcome