import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useEffect  } from 'react';

const MessageBox = ({MessagesSeen,messages,index,msg,otherUser}) => {
    const { user } = useAuth();
    const timeInPk = new Date(msg.createdAt).toLocaleTimeString("en-PK",{
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
    const formattedDate = new Date(msg.createdAt).toLocaleDateString("en-US", {
      timeZone: "Asia/Karachi",
      month: "long",
      day: "numeric"
    });

    useEffect(() => {
      if (messages.length > 0 && otherUser?.conversationId) {
        const lastMsg = messages[messages.length - 1];
        if(lastMsg.temp) return;
        if (lastMsg.sender === otherUser._id && !lastMsg.temp) {
          MessagesSeen(otherUser.conversationId, otherUser._id);
        }
      }
    }, [messages, otherUser]);
    
  return (
    <div className={`flex items-center flex-row ${msg.sender === user._id ? "justify-end bg" : "justify-start" }`}>
      {msg.sender !== user._id ? (
        <>
        <div className='w-fit max-w-[50%] h-fit shaow rounded-full mt-3 mr-3'>
        <img className='w-10 h-10 sm:w-10 sm:h-10 md:w-10 md:h-10 object-cover rounded-full shadow-sm' src={msg.sender === user._id ? user.profile_pic : otherUser.profile_pic}></img>
        </div>
        <div className={`shadow-md border mt-2 ${msg.sender === user._id ? "bg-green-300" : "bg-white" } text-gray-800 w-fit h-fit p-4 break-words  rounded-md`}>
          {msg.text}
          <div className="flex justify-end text-xs text-gray-500 mt-1">{formattedDate.split(" ")[1]} {formattedDate.split(" ")[0]}, {timeInPk}</div>
        </div>

        </>
      ) : (
        <>
        <div className={`shadow-md border mt-2 ${msg.sender === user._id ? "bg-green-300" : "bg-white" } text-gray-800 w-fit h-fit p-4 break-words max-w-[50%]  rounded-md`}>
          {msg.text}
          <div className="flex justify-end text-xs text-gray-600 mt-1">{formattedDate.split(" ")[1]} {formattedDate.split(" ")[0]}, {timeInPk}</div>
        </div>
        <div className='w-fit h-fit shaow rounded-full mt-3 ml-3'>
        <img className='w-10 h-10 sm:w-10 sm:h-10 md:w-10 md:h-10 object-cover rounded-full shadow-sm' src={msg.sender === user._id ? user.profile_pic : otherUser.profile_pic}></img>
        </div>
        </>
      )}
    
      </div>
  )
}

export default MessageBox