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
        <iframe src='https://www.youtube.com/embed/goK4hKZ742w' title='sample'></iframe>
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
    </div>
  )
}

export default Room