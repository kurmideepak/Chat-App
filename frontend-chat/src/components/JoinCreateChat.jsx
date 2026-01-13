import React, { useState } from 'react'
import chatIcon from "../assets/chat.png"
import { createRoomApi } from "../services/RoomService";
import toast from 'react-hot-toast';
import useChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router';
import { joinChatApi } from "../services/RoomService";


const JoinCreateChat = () => {

  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });

  const { roomId, userName, setRoomId, setCurrentUser, setConnected } = useChatContext();
  const navigate = useNavigate()


  function handleFormInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  function validateForm() {
    if (detail.roomId === "" || detail.userName === "") {
      toast.error("Invalid Input")
      return false;
    }
    return true;
  }

  async function joinChat() {
    if (validateForm()) {
      try {
        const room = await joinChatApi(detail.roomId);
        toast.success("Joined..")
        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        if (error.status == 404) {
          toast.error(error.response.data);
        } else {
          toast.error("Error in joining room");
        }

        console.log(error);

      }
    }

  }

  async function creatRoom() {
    if (validateForm()) {
      console.log(detail)

      try {
        const response = await createRoomApi(detail.roomId);
        console.log(response);
        toast.success("Room Created Successfully !! ")
        setCurrentUser(detail.userName);
        setRoomId(response.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        console.log(error);
        if (error.status == 400) {
          toast.error("Room Already Exist !! ")
        } else {
          toast.error("Error in Creating room")

        }
      }
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f172a',
      padding: '1rem'
    }}>
      <div style={{
        padding: '2rem',
        border: '2px solid #374151',
        width: '100%',
        maxWidth: '28rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        borderRadius: '0.75rem',
        backgroundColor: '#111827',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
      }}>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img src={chatIcon} style={{
            width: '8rem',
            height: '8rem',
            objectFit: 'contain',
            borderRadius: '0.5rem'
          }} alt="Chat Icon" />
        </div>

        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          textAlign: 'center',
          color: 'white'
        }}>
          Chat Room
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: '0.875rem'
        }}>
          Join or create a chat room to start messaging
        </p>

        {/* Name div */}
        <div>
          <label style={{
            display: 'block',
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: '#e5e7eb'
          }}>
            Your Name
          </label>
          <input
            onChange={handleFormInputChange}
            type="text"
            name='userName'
            placeholder='Enter your name'
            style={{
              width: '100%',
              backgroundColor: '#1f2937',
              color: 'white',
              padding: '0.75rem 1rem',
              border: '2px solid #374151',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#374151'}
          />
        </div>

        {/* Room id div */}
        <div>
          <label style={{
            display: 'block',
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: '#e5e7eb'
          }}>
            Room ID
          </label>
          <input
            name="roomId"
            onChange={handleFormInputChange}
            value={detail.roomId}
            placeholder='Enter room ID'
            type="text"
            style={{
              width: '100%',
              backgroundColor: '#1f2937',
              color: 'white',
              padding: '0.75rem 1rem',
              border: '2px solid #374151',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#374151'}
          />
        </div>

        {/* Button */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button onClick={joinChat}
            style={{
              flex: 1,
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2563eb',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.2s',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseDown={(e) => e.target.style.backgroundColor = '#1e40af'}
          >
            Join Room
          </button>
          <button onClick={creatRoom}
            style={{
              flex: 1,
              padding: '0.75rem 1.5rem',
              backgroundColor: '#16a34a',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.2s',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#15803d'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#16a34a'}
            onMouseDown={(e) => e.target.style.backgroundColor = '#166534'}
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat