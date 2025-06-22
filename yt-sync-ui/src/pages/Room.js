import React, { useEffect, useRef, useState} from 'react'
import '../styles/Room.css'
import {io} from 'socket.io-client'
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareNodes } from '@fortawesome/free-solid-svg-icons'

function Room() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [playlist, setPlaylist] = useState(false);
  const [chatbox, setChatbox] = useState(true);


  const {roomId} = useParams();

  const socketRef = useRef(null);

  const handleSend = () => {
    if (input.trim() === '') return;

    socketRef.current.emit('new message', input);

    setInput('');
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (roomName.trim() === '') return alert("Room name can't be empty");
    console.log('Creating room:', roomName);
    setShowModal(false);
    setRoomName('');
  };

  useEffect(()=>{

    const socket = io(process.env.REACT_APP_SERVER_URL,{
      query: {roomId}
    });

    socketRef.current = socket;

    socket.on('new message', (msg)=>{
      setMessages(prev=>[...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };

  },[]);
  console.log(messages)
  return (
    <div>
      <div className='room-container'>
        <div className='navbar'>
          <h1 className='logo-name'>StaySync</h1>
          <input className='search-bar' type='search' placeholder='Search...'></input>
          <FontAwesomeIcon id='share-icon' icon={faShareNodes} />
        </div>
        
        <section className='video-chat'>
          <div className='video-sec'>
            <iframe src='https://www.youtube.com/embed/goK4hKZ742w' title='sample'></iframe>
          </div>
          
        

          {chatbox && (
            <div>
              <button className='chat-sys' onClick={()=> {setPlaylist(false); setChatbox(true)}}>Chat Box</button>
          <button className='play-sys' onClick={()=> {setPlaylist(true); setChatbox(false)}}>Playlist</button>
            <div className="chat-box">
      <div className="chat-header"><h2>Live chat</h2></div>
          <div className="chat-messages">
        {messages.map((msg, index) => (
          <div className="chat-message" key={index}>
            <span>{msg.username}: </span>
            <span >{msg.msg}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
      </div>
      </div>
          )}
      {playlist && (
        <div>
          <button className='chat-sys' onClick={()=> {setPlaylist(false); setChatbox(true)}}>Chat Box</button>
          <button className='play-sys' onClick={()=> {setPlaylist(true); setChatbox(false)}}>Playlist</button>
        <div className="playlist">
          <h2>Playlist</h2>
        </div>
        </div>
      )}
        </section>
        
        
      </div>
      {showModal && (
        <div className="modal">
          <form className="modal-content" onSubmit={handleCreateRoom}>
            <h2>Create a Room</h2>
            <input
              type="text"
              placeholder="Enter Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="room-input"
            />
            <div className="modal-actions">
              <button type="submit" className="join-btn">Create</button>
              <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Room