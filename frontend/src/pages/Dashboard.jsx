import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || "Guest";

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    navigate(`/room/${id}`, {
        state: {
            username: username,
        },
    });
    toast.success("Created a new room");
  };

  const joinRoom = () => {
    if (!roomId.trim()) {
      toast.error("Please enter a valid Room ID");
      return; 
    }
    navigate(`/room/${roomId}`, {
      state: {
        username: username,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold mb-2 text-center text-blue-500">
          CodeCollab Lobby
        </h2>
        <p className="text-center text-gray-400 mb-6">Welcome, {username}</p>
        
        <div className="space-y-6">
          <div className="text-center">
            <button 
              onClick={createNewRoom} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-all transform hover:scale-105"
            >
              + Create New Room
            </button>
            <p className="text-gray-400 text-sm mt-2">Start a fresh collaboration session</p>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Join Existing Room
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                className="w-full bg-gray-900 text-white border border-gray-600 rounded p-3 focus:outline-none focus:border-blue-500"
                placeholder="Paste Room ID here..."
                onChange={(e) => setRoomId(e.target.value)}
                value={roomId}
                required 
                onKeyUp={(e) => {
                  if (e.code === 'Enter') {
                    joinRoom();
                  }
                }}
              />
              <button 
                onClick={joinRoom}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded transition-colors"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}