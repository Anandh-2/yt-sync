import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL
});

export const createRoom = async()=>{
    try{
        const response = await api.post('/create-room');
        return response.data.roomId;
    }catch(err){
        console.log('Error in api');
    }
}