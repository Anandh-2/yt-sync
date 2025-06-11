import React, { useState} from 'react'
import '../styles/Room.css'

function Room() {
   const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;

    const newMessage = {
      text: input
    };

    setMessages([...messages, newMessage]);
    setInput('');
  };
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
            <iframe src='https://www.youtube.com/embed/goK4hKZ742w' title='sample'></iframe>
          </div>
          <div className="chat-box">
      <div className="chat-header"><h2>Live chat</h2></div>
          <div className="chat-messages">
        {messages.map((msg, index) => (
          <div className="chat-message" key={index}>
            <span className="chat-time">{msg.text}</span>
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
    </div>
  )
}

export default Room