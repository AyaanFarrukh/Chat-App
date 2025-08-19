import React, { useEffect, useState } from 'react'
import Logo from "../assets/logo.png"

const ChatBox = ({messagesSeen,user,typingStatus,onlineUsers,chat, otherUser, setUser , getMessages, setChatOpened }) => {
  const conversationId = chat.conversationId ? chat.conversationId : null;
  const checkOnline = onlineUsers.some((id) => id === chat.otherUser._id);
  const seen = chat.lastMessageseen;
  const iamsender = chat.lastMessage?.sender === user?._id;
  const iamreceiver = chat.lastMessage?.receiver === user?._id;
  const lastMsg = chat.lastMessage?.text;
  const [previewText,setPreviewText] = useState("Start A Conversation");


  useEffect(() => {
    if (!chat?.lastMessage) return;
  
    if (iamsender) {
      setPreviewText(seen ? `Seen By ${chat.otherUser.name}` : "Message Sent");
    } else if (iamreceiver) {
      setPreviewText(seen ? lastMsg : "* New Messages");
    } else {
      setPreviewText("Start A Conversation");
    }
  }, [lastMsg, seen, iamsender, iamreceiver]);
  

  return (
    <div onClick={() => {
      setUser({...chat.otherUser, conversationId});
      getMessages(conversationId);
      setChatOpened(true);
      messagesSeen(conversationId,chat.otherUser._id);
    }} className='chat-box cursor-pointer hover:bg-gray-100 rounded w-full h-20 flex flex-row p-3 border-b border-gray-200 items-center'>
          <div className='profile-pic-area flex w-14 h-14 items-center justify-center rounded-full overflow-hidden'>
            <img src={chat.otherUser.profile_pic} width={50} className='w-16 h-16 sm:w-20 sm:h-20 md:w-10 md:h-10 object-cover rounded-full shadow-sm' />
          </div>
          <div className='user-info-area flex flex-col ml-4 text-ellipsis line-clamp-1 overflow-hidden'>
            <p className='font-semibold text-gray-800 flex items-center text-ellipsis line-clamp-1 overflow-hidden'>
              <span className={`w-2 h-2 ${checkOnline ? 'bg-green-500' : 'bg-red-600'} rounded-full mr-2`}></span>
              {chat.otherUser.name}
            </p>
            {typingStatus && typingStatus.userTypingId === chat.otherUser._id ?
             <p className=
             'ml-1 text-gray-500 text-sm truncate text-ellipsis line-clamp-1 overflow-hidden'>
               {typingStatus.typing ? "Typing..." : previewText } </p> : <p>{previewText}</p>
            }
          </div>
    </div>
  )
}

export default ChatBox