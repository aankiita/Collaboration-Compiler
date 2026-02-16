import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate, Navigate } from "react-router-dom";
import { initSocket } from "../socket"; 
import Editor from "../components/Editor";
import ACTIONS from "../Actions"; 
import { toast } from "react-hot-toast"; 

export default function Room() {
  const { id: roomId } = useParams(); 
  const socketRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]); 

 
  useEffect(() => {
    const init = async () => {
     
      socketRef.current = await initSocket();

    
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("Socket error", e);
        toast.error("Socket connection failed, try again later.");
        navigate("/");
      }

     
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username || "Guest", 
      });

    
      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room.`);
        }
        setClients(clients);
      });

      
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => prev.filter((client) => client.socketId !== socketId));
      });
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOIN);
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
      }
    };
  }, [roomId, location.state, navigate]);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
    
      <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-xl text-blue-400">CodeCollab</h1>
          <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">
           Room ID :   {roomId} 
          </span>
        </div>
        
        <div className="flex gap-2">
            <button 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-bold text-sm transition-colors"
                onClick={() => navigate('/dashboard')}
            >
                Leave Room
            </button>
        </div>
      </div>

      <div className="flex-grow overflow-hidden">
        <Editor
            socketRef={socketRef}
            roomId={roomId}
            onCodeChange={(code) => {
            }}
        />
      </div>

      <div className="absolute bottom-4 right-4 flex gap-2">
        {clients.map((client) => (
             <div key={client.socketId} className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-lg" title={client.username}>
                {client.username.charAt(0).toUpperCase()}
             </div>
        ))}
      </div>
    </div>
  );
}