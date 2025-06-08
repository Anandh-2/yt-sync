import React, { useState } from 'react';
import './Welcome.css';

function Welcome() {
  const [showModal, setShowModal] = useState(false);
  const [roomName, setRoomName] = useState('');

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (roomName.trim() === '') return alert("Room name can't be empty");
    console.log('Creating room:', roomName);
    setShowModal(false);
    setRoomName('');
  };

  return (
    <>
      <div className={`container ${showModal ? 'blur' : ''}`}>
        <div className='navbar'>
          <h1 className='logo-name'>StaySync</h1>
        </div>

        <div className='search-bar'>
          <span className='sync'><h1>Welcome to StaySync</h1></span>
        </div>

        <div className='video-container'>
          <div className='video-sec'></div>
          <h2 className='intro-para'>
            A simple platform where you can watch YouTube videos together.
          </h2>
          <button id='room-btn' onClick={() => setShowModal(true)}>Create Room</button>
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
    </>
  );
}

export default Welcome;
