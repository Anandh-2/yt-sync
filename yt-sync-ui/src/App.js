
import './App.css';
import Welcome from './pages/Welcome';
import { Route, Routes } from 'react-router-dom';
import Room from './pages/Room';

function App() {
  
  return (
    <div className='app'>
      <Routes>
        <Route path='/' element={<Welcome/>}/>
        <Route path='/room' element={<Room/>}/>
      </Routes>
    </div>
  );
}

export default App;
