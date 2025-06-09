import React, { useState } from 'react';
import './App.css';
import Welcome from './pages/Welcome';
import { Route, Routes } from 'react-router-dom';
import Room from './pages/Room';

function App() {
  
  return (
    <div className='app'>
      <Routes>
        <Route path='/' element={<Welcome/>}/>
        <Route path='/room/:roomId' element={
          (localStorage.getItem('username'))?<Room/>:<div>
            
          </div>
        }/>
      </Routes>
    </div>
  );
}

export default App;
