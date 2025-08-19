import React from 'react'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

const CheckPasswordPage = () => {

  const navigate = useNavigate();
  const [password,setPassword] = useState("");
  const { login } = useAuth();
  const location = useLocation();
  const userData = location.state;
  console.log(userData);

  const handleForm = async (e) => {
    e.preventDefault();
    const LoadingId = toast.loading("Checking Password...");
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/password`,{
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ password, userId: userData._id }),
        headers: {
          "Content-type": "application/json"
        }
      });
      const data = await response.json();
      console.log(data);
      if(response.status === 500) {
        toast.error("Server Error!",{ id: LoadingId })
        return;
      }
      if(!data.success && !data.verified) {
        toast.error("Wrong Password!, Try Again",{ id: LoadingId });
        return;
      }
      if(data.success) {
        toast.success("Login Successfull!",{ id: LoadingId })
        login(data.token,data.user);
        navigate("/home");
      }

    } catch (error) {
      console.error(error);
      toast.error("Something Went Wrong!",{ id: LoadingId })
    }
  }

  const getUserProfileLetters = () => {
    let letters = ''
    const userName = userData?.name.split(" ");
    console.log(userName);
    const nameLength = userName.length;
    for(let i = 0; i < nameLength; i++) {
      const name = userName[i];
      if(!name) continue
      letters += name[0]
    }
    return letters.toUpperCase();
  }
  const getRandomBgColor = () => {
    let bgColor = '';
    const randomNumber = Math.floor(Math.random()*5)+1;
    switch(randomNumber) {
      case 1: {
        bgColor = "bg-red-900"
        break;
      }
      case 2: {
        bgColor = "bg-yellow-900"
        break;
      }
      case 3: {
        bgColor = "bg-blue-900"
        break;
      }
      case 4: {
        bgColor = "bg-pink-900"
        break;
      }
      case 5: {
        bgColor = "bg-purple-900"
        break;
      }
    }
    return bgColor;
  }

  return (
      <div className='mt-20'>
         <div className='bg-white w-full max-w-md rounded overflow-hidden p-5 shadow m-auto'>
          <div className={`${getRandomBgColor()} text-white text-2xl font-semibold flex justify-center items-center rounded-full p-5 w-16 h-16 mx-auto mb-5`}>
          <span>{getUserProfileLetters()}</span>
          </div>
          <div className=' mb-5 w-full flex justify-center items-center'>
          <span className='font-bold text-2xl text-center'>Hey {userData.name}, Welcome!</span>
          </div>
           <h3 className='text-primary'>Welcome To The Chat App</h3>
           <form encType='multipart/form-data' onSubmit={handleForm}>
            <div className='flex flex-col mt-2 '>
              <label htmlFor='password'>Password: </label>
              <input 
               type= "text" 
               name='password' 
               id='password' 
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
               className='bg-white border outline-none focus:border-primary py-1 px-2 mt-2 '></input>
            </div>
            <button className=' 
            rounded-md mt-4 text-white text-lg w-full h-10 leading-loose bg-primary hover:bg-secondary cursor-pointer border shadow'>Submit</button>
          </form>
         </div>
      </div>
  )
}

export default CheckPasswordPage