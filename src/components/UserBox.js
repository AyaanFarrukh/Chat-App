import React from 'react'

const UserBox = ({onlineUsers,chatList,setHaveChats,user,searchedUser,setSearchedUser,setChatList,closeModal}) => {
  const disabled = chatList.some((chat) => chat.otherUser._id === user._id);
  return ( 
  //   <div className='mb-5 flex md:flex-row w-full h-fit border rounded shadow p-5 bg-white flex-wrap'>

  //   <div className='flex  bg-blue-600 w-fit  mt-2 px-6 md:px-0 md:mb-0  '>
  //     <img className='w-16 h-16 object-cover rounded-full' src={user.profile_pic}></img>
  //   </div>

  //   <div className=' bg-red-600 w-fit p-1 ml-6 flex flex-col flex-1'>
  //     <div className=' w-fit mb-0 md:mb-0'>
  //       <p className='font-bold text-lg'>{user.name}</p>
  //       <p className='text-gray-500 text-sm'>Start A Conversation By Adding This User</p>
  //     </div>
  //   </div>

  //   <div className='h-full flex justify-center items-center  md:w-auto'>
  //     <button onClick={() => {
  //       setChatList((prev) => [{
  //         conversationId: null,
  //         otherUser: user,
  //         lastMessage: null
  //       },...prev]);
  //       setHaveChats(true);
  //       closeModal();
  //     }} className='bg-primary text-white w-24 border rounded shadow p-2' disabled={disabled}>{disabled ? "Added" : "Add User"}</button>
  //   </div>
  // </div>
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
      Start a conversation by adding this user
    </p>
  </div>

  <div className="flex items-center justify-center md:m-auto md:justify-end w-full md:w-auto">
    <button
      onClick={() => {
        setChatList((prev) => [
          {
            conversationId: null,
            otherUser: user,
            lastMessage: null,
          },
          ...prev,
        ]);
        setHaveChats(true);
        closeModal();
      }}
      className={`${
        disabled
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-primary text-white hover:bg-primary/90"
      } w-14 h-14 md:18 font-medium rounded-full shadow p-2 transition`}
      disabled={disabled}
    >
      {disabled ? <i className='fas fa-user-check'></i> : <i className='fa-solid fa-user-plus'></i>}
    </button>
  </div>
</div>
  )
}

export default UserBox