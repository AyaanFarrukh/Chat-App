import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from "react-router-dom";

const CheckEmailPage = () => {
  const navigate = useNavigate();
  const [email,setEmail] = useState("");

  const handleForm = async (e) => {
    e.preventDefault();
    const LoadingId = toast.loading("Checking Email...");
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/email`,{
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ email }),
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
      if(!data.success && !data.exists) {
        toast.error("User With This Email Dont Exists, Register Please!",{ id: LoadingId });
        return;
      }
      if(data.success) {
        toast.success("Email Verified Successfully!",{ id: LoadingId })
        navigate("/password",{ state: data.data});
      }

    } catch (error) {
      console.error(error);
      toast.error("Something Went Wrong!",{ id: LoadingId })
    }
  }


  return (
    <div className='mt-20'>
       <div className='bg-white w-full max-w-md rounded overflow-hidden p-5 shadow m-auto'>
        <div className=' bg-white-900 w-fit mx-auto mb-5'>
        <span class="fa-stack" style={{ fontSize: "40px"}}>
         <i class="fa-solid fa-circle fa-stack-2x"></i>
        <i class="fa-solid fa-user fa-stack-1x fa-inverse"></i> 
      </span>
        </div>
         <h3 className='text-primary'>Welcome To The Chat App</h3>
         <form encType='multipart/form-data' onSubmit={handleForm}>
          <div className='flex flex-col mt-2 '>
            <label htmlFor='email'>Email: </label>
            <input 
             type='email' 
             name='email' 
             id='email' 
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required
             className='bg-white border outline-none focus:border-primary py-1 px-2 mt-2 '></input>
          </div>
          <button className=' 
          rounded-md mt-4 text-white text-lg w-full h-10 leading-loose bg-primary hover:bg-secondary cursor-pointer border shadow'>Submit</button>
          <p className='text-center mt-3 text-sm'>Dont Have An Account?   
          <span className='font-bold hover:text-primary cursor-pointer'><Link to="/register" >  Register</Link></span></p>
        </form>
       </div>
    </div>
  )
}

export default CheckEmailPage;