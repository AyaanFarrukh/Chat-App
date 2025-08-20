import React, { useEffect, useRef, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSocket } from '../contexts/SocketContext';
import "../App.css"
import ChatBox from '../components/ChatBox';
import MessageBox from '../components/MessageBox';
import UserBox from '../components/UserBox';
import toast from "react-hot-toast";


const Home = () => {
  const { token, user, setUser } = useAuth();
  const { socket, connected } = useSocket();
  const [msg,setMsg] = useState("");
  const [messages,setMessages] = useState([]);
  const [chatList,setChatList] = useState([]);
  const [chatOpened,setChatOpened] = useState(false);
  const [otherUser,setOtherUser] = useState(null);
  const [haveChats,setHaveChats] = useState(false); 
  const [noChat,setNoChat] = useState(true);
  const [addUsers,setAddUsers] = useState(false);
  const [animation,setAnimation] = useState(false);
  const [loading,setLoading] = useState(true);
  const [users,setUsers] = useState([]);
  const [filteredUsers,setFilteredUsers] = useState([]);
  const [searchedUser,setSearchedUser] = useState("");
  const [onlineUsers,setOnlineUsers] = useState([]);
  const [isTyping,setIsTyping] = useState(null);
  const [edit,setEdit] = useState(false);
  const [updateUser,setUpdateUser] = useState(false);
  const [usersAvailable,setUsersAvailable] = useState(true);
  const [photo,setPhoto] = useState("");
  const [name,setName] = useState("");
  const inputRef = useRef(null);
  const messageRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if(!token) navigate("/email")
  },[token])

  useEffect(() => {
    if(!socket) return;

    const handleMessage = (data) => {
      setMessages(data.conversation.messages); 
      setNoChat(false);
    };
    const handleChatListError = (data) => {
      if(!data.conversation) {
          setHaveChats(false);
          setLoading(false);
      }
    }
    const handleChats = (data) => {
      setChatList(data.chatList);
      setLoading(false);
      setHaveChats(true);
    }
    const handleMessages = (data) => {
      setMessages(data.conversation.messages);
      setNoChat(false);
    }
    const handleMessageError = (data) => { setNoChat(true) }

    const handleOnlineUsers = (data) => { 
      setOnlineUsers(data)
     }

    const handleTyping = (data) => {
      setIsTyping({ typing: true , userTypingId: data.from })
    }
    const handleStopTyping = (data) => {
      setIsTyping({ typing: false , userTypingId: data.from })
    }
    
    socket.on("take_chat_messages",handleMessages);
    socket.on("recieve_message", handleMessage);
    socket.on("take_chat_list_error", handleChatListError);
    socket.on("take_chat_list", handleChats);
    socket.on("get_messages_error",handleMessageError);
    socket.on("take_online_users",handleOnlineUsers);
    socket.on("show_typing",handleTyping);
    socket.on("hide_typing",handleStopTyping);

    return () => {
      socket.off("recieve_message", handleMessage);
      socket.off("take_chat_list_error", handleChatListError);
      socket.off("take_chat_list", handleChats);
      socket.off("take_chat_messages",handleMessages);
      socket.off("get_messages_error",handleMessageError);
      socket.off("take_online_users",handleOnlineUsers);
      socket.off("show_typing",handleTyping);
      socket.off("hide_typing",handleStopTyping);
    };
  },[socket]);

  useEffect(() => {
    const fetchChatLists = () => {
      {user && socket.emit("get_chat_list",{ userId: user._id }); }
    }
  fetchChatLists();
  },[user]);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth"});
   },[messages])
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const repsonse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/get-users`)
        const data = await repsonse.json();
        if(user) {
        const allUsers = data.users.filter((per,i) => {
          return per._id !== user._id;
        })
        setUsers(allUsers);
        setFilteredUsers(allUsers);
      }
      } catch (error) {
        console.error(error)
      }
    }
    fetchUsers();
  },[user])

  useEffect(() => {
    if(!searchedUser) {
      setFilteredUsers(users);
      setUsersAvailable(true);
      return
    }
    setFilteredUsers((prev) => {
      return filteredUsers.filter((user) => user.name.includes(searchedUser))
    })
    if(filteredUsers.length === 0) {
      setUsersAvailable(false)
    } else {
      setUsersAvailable(true);
    }
  },[searchedUser])

  const openModal = () => {
    setAddUsers(true);
    setTimeout(() => setAnimation(true),10)
  }

  const closeModal = () => {
    setAnimation(false);
    setTimeout(() => setAddUsers(false), 300); 
  };

  const openUpdateModal = () => {
    setUpdateUser(true);
    setTimeout(() => setAnimation(true),10)
  }

  
  const closeUpdateModal = () => {
    setAnimation(false);
    setTimeout(() => setUpdateUser(false), 300); 
  };

  const handleUpload = (e) => {
    const file = e.target.files[0]
    setPhoto(file);
  }

  const clearUpload = (e) => {
    e.preventDefault();
    inputRef.current.value = "";
    setPhoto("");
  }

  const sendMessage = (user,receiver,text,imageUrl,videoUrl) => {
    if(!msg.trim()) return;
    socket.emit("send_message",{
      senderId: user._id,
      recieverId: receiver._id,
      text,
      imageUrl, 
      videoUrl
    });
    setMsg("");
  }

  const getMessages = (conversationId) => {
    socket.emit("get_messages",{
      userId: user ? user._id : null,
      otherUserId: otherUser ? otherUser._id : null,
      conversationId
    });
  }

  const MessagesSeen = (conv_id,id) => {
    socket.emit("messages_seen", {
       conversationId: conv_id,
       userId: user?._id,
       otherUserId: id
    })
  }

  const LogOut = async () => {
    const conversationId = toast.loading("Logging You Out....")
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/logout`,{
      method: "POST",
      credentials: "include"
    });
    const data = await response.json();
    if(data.success) {
      toast.success("Successfully LoggedOut",{ id: conversationId });
      navigate("/email")
    }
  }

  const updateUserDetails = async () => {
    const LoadingId = toast.loading("Updating Profile...");
    const formData = new FormData();
    formData.append("name",name)
    formData.append("profile_pic",photo)
    if(!photo && !name) {
      toast.error("Fill Atleast One Feild",{ id: LoadingId })
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/update-user`,{
        method: "POST",
        credentials: "include",
        body: formData
      });
      const data = await response.json();
      if(data.success) {
        setUser(data.updatedUser);
        toast.success("Profile Updated Successfully",{ id: LoadingId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Something Went Wrong",{ id: LoadingId })
    }
    inputRef.current.value = "";
    setPhoto("");
  }

  const checkOnline = otherUser ? onlineUsers.some((id) => id === otherUser._id) : null
  let typingId = useRef(null);

  return (

<div className='h-screen w-full flex flex-row bg-[#f5f6f7]'>

{addUsers && (
  <div className='z-40 fixed w-full h-full flex items-center justify-center'>
    <div
      className={`w-[100%] md:w-[60%] h-[100%] md:h[80%] bg-white shadow rounded border transform transition-all duration-300 flex flex-col p-5
        ${animation ? `scale-100 opacity-100` : `scale-90 opacity-0`}`}
    >
      <div className='flex flex-row justify-between '>
        <h1 className='font-bold text-2xl my-auto '>Add Users</h1>
        <button
          onClick={() => {
            closeModal();
            setTimeout(() => { setSearchedUser(""); },100)
          }}
          className='ml-3 border rounded shadow p-2 bg-red-700 text-white cursor-pointer w-14 h-18 '
        >
          <i className='fa-solid fa-xmark'></i>
        </button>
      </div>

      <div className='mt-5 w-full flex flex-row'>
        <input
        onChange={(e) => setSearchedUser(e.target.value)}
          className='bg-white h-10 rounded border shadow outline-none focus:outline-primary p-2 w-full'
        />
        <button className='ml-3 border rounded shadow p-2 bg-primary text-white cursor-pointer w-14 h-18'>
         <i className='fa-solid fa-magnifying-glass'></i>
        </button>
      </div>
      <div className={`flex mt-2 p-0 md:p-5 flex-col w-full h-[80%] ${!usersAvailable && 'items-center justify-center'} overflow-y-scroll`}>
        {usersAvailable ? (
    filteredUsers.map((user) => <UserBox 
      chatList={chatList}
       setHaveChats = {setHaveChats} 
       closeModal={closeModal} 
       user={user} 
       searchedUser={searchedUser} 
       setSearchedUser={setSearchedUser} 
       setChatList={setChatList}/>)
        ) : (
          <span className='font-bold'>No Users Available Of Your Match</span>
        )}
      </div>
    </div>
  </div>
)}

{updateUser &&
<div className='fixed z-40 w-full h-full flex items-center justify-center'>
<div className={`w-[95%] md:w-[50%] h-fit bg-white shadow rounded border transform transition-all duration-300 flex flex-col p-5
 ${animation ? `scale-100 opacity-100` : `scale-90 opacity-0`}`}>
  <div className='mb-3 flex flex-row justify-between'>
  <h1 className= 'font-bold text-2xl'>Your Profile</h1>
  <button
  onClick={() => closeUpdateModal()}
   className='ml-3 border rounded shadow p-2 bg-red-700 text-white cursor-pointer w-14 h-18 '
    >
    <i className='fa-solid fa-xmark'></i>
   </button>
  </div>
        <div className="mb-5 flex flex-col md:flex-row w-full border rounded-2xl shadow-md p-5 bg-white items-center md:items-start">
      <div className="flex justify-center items-center mb-4 md:mb-0 md:mr-6">
        <img
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-16 md:h-16 object-cover rounded-full shadow-sm"
          src={user.profile_pic}
          alt={user.name}
        />
      </div>
    
      <div className="flex flex-col flex-1 text-center md:text-left mb-4 md:mb-0">
        <p className="font-bold text-lg md:text-xl">{user.name}</p>
        <p className="text-gray-500 text-sm md:text-base">
          Email: {user?.email}
        </p>
      </div>
    
      <div className="flex items-center justify-center md:m-auto md:justify-end w-full md:w-auto">
        {edit ? <button onClick={() => setEdit(false)}><i className='fas fa-user-slash'></i>
        </button> : <button onClick={() => setEdit(true)}><i className='fas fa-user-edit'></i>
        </button> } 
  
      </div>
    </div> 
    {edit && <form onSubmit={(e) => {
        e.preventDefault();
        updateUserDetails();
    }} encType='multipart/form-data'>
      <div className='w-full flex flex-col shadow '>
      <div className='flex flex-col mt-2 '>
            <label htmlFor='file'>Profile Picture: 
              <div className=' rounded-md flex justify-center mt-2 items-center h-10 p-6 bg-slate-200 border hover:border-primary cursor-pointer'>
                 <span className='text-ellipsis line-clamp-1 max-w-[300]'>{photo.name ? photo.name : "Upload Photo"}</span>
                 {photo.name ? <span onClick={clearUpload} className='py-2 px-3 mt-1 cursor-pointer hover:text-primary'><i className='fa-solid fa-xmark'></i></span> : ""}
              </div>
            </label>
             <input 
             type='file' 
             name='profile_pic' 
             id='file'
             onChange={handleUpload}
             className='hidden'
             ref={inputRef}></input> 
          </div>
      </div>
      <div className='flex flex-col mt-3'>
      <label>Update Name: </label>
      <input type='text'
      onChange={(e) => setName(e.target.value)}
       className='w-full mt-3 h-12 border outline-none focus:outline-primary shadow rounded-md p-3'></input>
      </div>
      <div className='mt-3'>
        <button className='border bg-primary rounded shadow text-white p-3 w-20 h-18'>Update</button>
      </div>
      </form>}
</div>
</div>
}
 

<div className='chat-area h-screen flex flex-row w-full md:w-1/3 bg-white border-r border-gray-300'>
<div className='p-3 flex flex-col border'>
  <div className='flex justify-center items-center'>
  <button onClick={() => openModal()} className='w-8 h-8  mr-1 text-lg'><i class="fas fa-user"></i></button>
  </div>
  <div className='flex flex-col items-center mt-3 justify-center'>
    <button onClick={() => openUpdateModal()} className='w-8 h-8 mb-10 text-lg mb-3'><i class="fas fa-user-pen"></i></button>
    <button onClick={() => LogOut()} className='w-8 h-8 text-lg'><i class="fas fa-right-from-bracket"></i></button>
  </div>
</div>
  <div className='chat-area flex flex-col w-full bg-white border-r border-gray-300'>
    <div className='chat-head w-full h-16 border flex items-center justify-center shadow-sm'>
      <h1 className='font-bold text-xl text-gray-800'>Your Messages</h1>
    </div>

{loading ? (
  <div className="flex w-full h-full justify-center items-center">
    loading chats...
  </div>
) : haveChats ? (
  <div className="chats-boxes-area custom-scroll w-full flex-1 bg-white overflow-y-scroll shadow-sm">
    {chatList.map((chat) => (
      <ChatBox
        messagesSeen = {MessagesSeen}
        user={user}
        typingStatus={isTyping}
        onlineUsers={onlineUsers}
        key={chat.id}
        setChatOpened={setChatOpened}
        chat={chat}
        otherUser={otherUser}
        setUser={setOtherUser}
        getMessages={getMessages}
      />
    ))}
  </div>
) : (
  <div className="flex w-full sm:p-5 h-full justify-center items-center flex-col flex-wrap">
    <h1 className="font-bold">Oops!</h1>
    <p className="font-semibold text-center">You Don't Have Any Chats Yet!</p>
    <p className="font-semibold text-center">Start A Conversation By Adding Users</p>
  </div>
)}

  </div>
  </div>

  <div className={`messages-area h-full fixed w-full overflow-auto
     md:static md:flex-1 md:translate-x-0 flex flex-col bg-[#f5f6f7] transition-transform duration-300
     ${chatOpened ? 'tarnslate-x-0' : 'translate-x-full'}`}>
   {chatOpened ? (
    <>
    <div className='user-header fixed w-full bg-white shadow-xl border h-16 flex flex-row p-5 '>
      <div className= 'user-profile-pic flex justify-center items-center rounded-full shaodw'>
        <img src={otherUser ? otherUser.profile_pic : ""} width={70}  alt="User" className='w-10 h-10 sm:w-10 sm:h-10 md:w-10 md:h-10 object-cover rounded-full shadow-sm' />
      </div>
      <div className='user-info-area flex flex-col ml-5'>
        <p className='font-semibold text-gray-800 flex items-center'>
          <span className={`w-2 h-2 ${checkOnline ? 'bg-green-500' : 'bg-red-600'} rounded-full mr-2`}></span>
          {otherUser ? otherUser.name : "Unknown User"}
        </p>
      </div>
      <button onClick={() => setChatOpened(false)} className='md:hidden mr-3 text-blue font-bold ml-auto'>
       <i className='fas fa-angle-left'></i>
      </button>
    </div>

    <div style={{backgroundImage: "url('https://www.shutterstock.com/image-vector/social-media-sketch-vector-seamless-600nw-1660950727.jpg')"}} 
    className=' main-msg-area w-full mt-10 flex-1 flex flex-col  bg-white p-5 overflow-y-auto'>
      {!noChat ? (
          <>{messages.map((msg,i) => <MessageBox MessagesSeen={MessagesSeen} messages={messages} index={i} msg={msg} otherUser={otherUser}/>)}
          <div ref={messageRef}></div></>
      ) : (
        <div className='bg-white p-5 rounded-md border shadow-xl w-fit mt-5  h-fit fglex justify-center py-5'>
          <p className='font-bold mb-2'>You Both Have'nt Started A Conversation Yet!</p>
          <p className='font-bold'>Start A Conversation By Typing A Message!</p>
        </div>
      )}
    </div>
    <div className='flex h-16 flex-row shadow-xl p-2 bg-white border--black'>
      <input
        onChange={(e) => {
          setMsg(e.target.value);
          socket.emit("start_typing", { to: otherUser._id });
          clearTimeout(typingId.current);
          typingId.current = setTimeout(() => {
            socket.emit("hide_typing", { to: otherUser._id });
          }, 800);
        }}
        onKeyDown={(e) => {
          if(e.key === "Enter") {
            setMessages((prev) => [...prev,{ text: msg, sender: user._id, receiver: otherUser._id, createdAt: new Date().toISOString(), temp: true}])
            sendMessage(user,otherUser,msg,"","")
          }
        }}
        value={msg}
        className='w-full p-2 outline-none border border-gray-300 shadow-sm rounded'
        placeholder="Type a message..."
      />
      <button onClick={() => {
        console.log("Sending", otherUser)
        setMessages((prev) => [...prev,{ text: msg, sender: user._id, receiver: otherUser._id, createdAt: new Date().toISOString(), temp: true }])
        sendMessage(user,otherUser,msg,"","")
        }} className='md:ml-5 w-20 rounded shadow cursor-pointer bg-blue-500 text-white hover:bg-blue-600'>
        Send
      </button>
    </div>
    </>
   ) : (
    <div style={{backgroundImage: "url('https://www.shutterstock.com/image-vector/social-media-sketch-vector-seamless-600nw-1660950727.jpg')"}} 
    className='hidden md:flex w-full h-full justify-center items-center font-bold text-lg'>
     <div className=' bg-white p-5 rounded-md shadow-lg border'> Open a chat to start a conversation</div>
      </div>
   )}

    
  </div>
</div>


  )
}

export default Home