import React, { useEffect, useRef, useState} from 'react'
import '../styles/Room.css'
import {io} from 'socket.io-client'
import { useParams } from 'react-router-dom';

function Room() {
   const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [roomName, setRoomName] = useState('');

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
        </div>
        <div className='search-bar'>
          <input type='search' placeholder='Search...'></input>
        </div>
        <section className='video-chat'>
          <div className='video-sec'>
            <iframe src='https://www.youtube.com/embed/5CEXL8kfGL4' title='sample'></iframe>
          </div>
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
        </section>
        <div className='playlist'>
          <span><p>Playlist</p></span>
        </div>
        
        
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