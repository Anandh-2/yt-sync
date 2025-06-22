import React, { useEffect, useRef, useState } from "react";
import "../styles/Room.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { MdShare } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { MdClear } from "react-icons/md";

function Room() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [actionSection, setActionSection] = useState("chat");

  const { roomId } = useParams();

  const socketRef = useRef(null);

  const handleSend = () => {
    if (input.trim() === "") return;

    socketRef.current.emit("new message", input);

    setInput("");
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (roomName.trim() === "") return alert("Room name can't be empty");
    console.log("Creating room:", roomName);
    setShowModal(false);
    setRoomName("");
  };

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SERVER_URL, {
      query: { roomId },
    });

    socketRef.current = socket;

    socket.on("new message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);
  console.log(messages);

  return (
    <div>
      <div className="room-container">
        <div className="navbar">
          <h1 className="logo-name">StaySync</h1>
          <div className="search">
            <IoSearch className="search-icon" />
            <input className="search-bar" placeholder="Search..." value={searchInput} onChange={(e)=>setSearchInput(e.value)}></input>
            <MdClear className="clear-icon" style={{cursor:'pointer'}} onClick={()=>setSearchInput("")}/>
          </div>
          <MdShare id="share-icon" />
        </div>

        <section className="video-sec">
          <div className="video">
            <iframe
              src="https://www.youtube.com/embed/5CEXL8kfGL4"
              title="sample"
              allowFullScreen
            ></iframe>
          </div>

          <div className="action-sec">
          <div className="action-container">
            <div className="toggle-btns">
              <button
                className="action-btn"
                onClick={() => {
                  setActionSection("chat");
                }}
                style={{backgroundColor: actionSection==='chat'?'#121212':'#1A1A1A', borderTopLeftRadius:'10px'}}
              >
                Chat
              </button>
              <button
                className="action-btn"
                onClick={() => {
                  setActionSection("playlist");
                }}
                style={{backgroundColor: actionSection==='playlist'?'#121212':'#1A1A1A', borderTopRightRadius:'10px'}}
              >
                Playlist
              </button>
            </div>
            <div className="action-main">
            {actionSection === "chat" ? (
              <div className="chat-box">
                <div className="chat-messages">
                  {messages.map((msg, index) => (
                    socketRef.current.id===msg.id?
                    <div className="chat-message" key={index}>
                      <span>{msg.username}: </span>
                      <span>{msg.msg}</span>
                    </div>:
                    <div className="chat-message">
                      <span>{msg.username}: </span>
                      <span>{msg.msg}</span>
                    </div>
            ))}
                </div>
                <div className="chat-input">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                  <button onClick={handleSend}>Send</button>
                </div>
              </div>
            ) : (
              <div className="playlist">
              </div>
            )}
            </div>
            </div>
          </div>
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
              <button type="submit" className="join-btn">
                Create
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Room;
