import React, { useEffect, useRef, useState } from 'react'
import { MdAttachFile, MdSend } from 'react-icons/md'
import useChatContext from '../context/ChatContext'
import { useNavigate } from 'react-router';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import toast from 'react-hot-toast';
import {baseURL} from '../config/AxiosHelper';
import { getMessagess } from '../services/RoomService';
import { timeAgo } from '../config/helper';


const ChatPage = () => {

    const {roomId, currentUser, connected, setConnected, setRoomId, setCurrentUser} = useChatContext();

    const navigate = useNavigate();

    useEffect(()=>{
        if(!connected){
            navigate('/');
        }
    }, [connected, roomId, currentUser])


    const [messages, setMessages] = useState([]);
    const [input, setInput]=useState("")
    const inputRef = useRef(null)
    const chatBoxRef = useRef(null)
    const [stompClient, setStompClient] = useState(null)


    useEffect(()=>{
        async function loadMessages(){
            try {
                const messages= await getMessagess(roomId);
                setMessages(messages);
            } catch (error) {
                
            }

        }
        if(connected){
            loadMessages();
        }

    }, [])

    useEffect(()=>{

        if(chatBoxRef.current){
            chatBoxRef.current.scroll({
                top: chatBoxRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }


    }, [messages])

    useEffect(()=>{

        const connectWebSocket=()=>{
            const sock = new SockJS(`${baseURL}/chat`)

            const client = Stomp.over(sock)

            client.connect({}, ()=>{

                setStompClient(client);
                toast.success("connected");
                client.subscribe(`/topic/room/${roomId}`, (message) => {
                    console.log(message);
                    const newMessage = JSON.parse(message.body);
                    setMessages((prev) => [...prev, newMessage]);
                });
            });

        }

        if (connected){
            connectWebSocket();
        }

    }, [roomId])




    const sendMessage =async () => {
        if (stompClient && connected && input.trim()){
            console.log(input);

        const message={
            sender: currentUser,
            content: input,
            roomId: roomId
        }

        stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
        setInput("");
    }
    };


    function handleLogout(){
        stompClient.disconnect();
        setConnected(false);
        setRoomId('');
        setCurrentUser('');
        navigate('/');
    }


  return (
    <div style={{ height: '100vh', width: '100%', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid #4b5563',
        backgroundColor: '#111827',
        position: 'fixed',
        width: '100%',
        padding: '1.25rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 10,
        top: 0,
        left: 0
      }}>
        {/* Room name */}
        <div style={{ color: '#e5e7eb' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
            Room: <span style={{ color: '#3b82f6' }}>{roomId}</span>
          </h1>
        </div>

        {/* Username */}
        <div style={{ color: '#e5e7eb' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
            User: <span style={{ color: '#10b981' }}>{currentUser}</span>
          </h1>
        </div>

        {/* Leave button */}
        <button 
          onClick={handleLogout}
          style={{
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#991b1b'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
        >
          Leave Room
        </button>
      </header>

      {/* Messages Container */}
      <main 
        ref={chatBoxRef} 
        style={{
          flex: 1,
          marginTop: '6rem',
          padding: '2.5rem 2.5rem 6rem 2.5rem',
          overflowY: 'auto',
          backgroundColor: '#0f172a'
        }}
      >
        {messages && messages.map((message, index) => (
          <div 
            key={index} 
            style={{
              display: 'flex',
              justifyContent: message.sender === currentUser ? 'flex-end' : 'flex-start',
              marginBottom: '1rem'
            }}
          >
            <div style={{
              backgroundColor: message.sender === currentUser ? '#059669' : '#374151',
              color: 'white',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              maxWidth: '20rem',
              display: 'flex',
              gap: '0.5rem'
            }}>
              <img 
                src="https://avatar.iran.liara.run/public/46" 
                alt="avatar"
                style={{ height: '2.5rem', width: '2.5rem', borderRadius: '50%' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 'bold', margin: 0 }}>{message.sender}</p>
                <p style={{ margin: '0.5rem 0 0 0' }}>{message.content}</p>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>{timeAgo(message.timeStamp)}</p>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Input Container */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '1rem 2.5rem',
        backgroundColor: '#111827',
        borderTop: '1px solid #4b5563',
        height: '5rem',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{
          height: '100%',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '9999px',
          width: '50%',
          backgroundColor: '#1f2937',
          padding: '0 1.25rem'
        }}>
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
            type="text" 
            placeholder="Type your message here..." 
            style={{
              flex: 1,
              backgroundColor: '#1f2937',
              color: 'white',
              border: 'none',
              padding: '0.5rem 0',
              outline: 'none',
              fontSize: '1rem'
            }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              style={{
                backgroundColor: '#a855f7',
                color: 'white',
                height: '2.5rem',
                width: '2.5rem',
                borderRadius: '50%',
                border: 'none',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#7c3aed'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#a855f7'}
            >
              <MdAttachFile size={20} />
            </button>
            <button 
              onClick={sendMessage}
              style={{
                backgroundColor: '#16a34a',
                color: 'white',
                height: '2.5rem',
                width: '2.5rem',
                borderRadius: '50%',
                border: 'none',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#15803d'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#16a34a'}
            >
              <MdSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
