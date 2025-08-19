import './App.css';
import { Outlet } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";
import { AuthProvider } from './contexts/AuthContext';
import { Socket } from 'socket.io-client';
import { SocketProvider } from './contexts/SocketContext';
import { useEffect, useState } from 'react';

function App() {
  const [isWaking,setIsWaking] = useState(true);

  const wakeServer = async () => {
    const LoadingId = toast.loading("Waking Server Up...")
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/ping`);
    if(response.status === 200) {
      toast.success("Server Sarted Successfully", { id: LoadingId });
      setIsWaking(false);
    } else {
      toast.error("Failed To Start Server", { id: LoadingId });
      setIsWaking(false)
    }
  }
  useEffect(() => {
    wakeServer();
  })
  return (
    <>
    <AuthProvider>
    <SocketProvider>

    <Toaster />
    {isWaking ? <div className='bg-gray-200 w-full flex-col h-screen flex justify-center items-center font-bold text-4xl flex-wrap'
    ><p className='mb-3'>Waking Up Server...</p>
    <p>Please Wait</p>
    </div> :<main className = ""><Outlet /></main> }

   </SocketProvider>
   </AuthProvider>
   </>
  );
}

export default App;
