import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from "react-router-dom";


const RegisterPage = () => {
  const navigate = useNavigate();
  const [data,setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: ""
  });
  const [photo,setPhoto] = useState("");
  const inputRef = useRef(null);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUpload = (e) => {
    const file = e.target.files[0]
    setPhoto(file);
    setData((prev) => ({
      ...prev,
      profile_pic: file
    }));
    console.log(file)
  }

  const clearUpload = (e) => {
    e.preventDefault();
    inputRef.current.value = "";
    setPhoto("");
  }

  const handleForm = async (e) => {
    e.preventDefault();
    const LoadingId = toast.loading("Registering User...");
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("profile_pic", data.profile_pic);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/register`,{
        method: "POST",
        body: formData,
        credentials: "include"
      });
      const data = await response.json();
      console.log(data);
      if(response.status === 500) {
        toast.error("Server Error!",{ id: LoadingId })
        return;
      }
      if(!data.success && data.exists) {
        toast.error("User With This Email Already Exists",{ id: LoadingId });
        return;
      }
      if(data.success) {
        toast.success("User Created Successfully",{ id: LoadingId });
        setData(() => ({
          name: "",
          email: "",
          password: "",
          profile_pic: ""
        }))
        navigate("/email");
      }

    } catch (error) {
      console.error(error);
      toast.error("Something Went Wrong!",{ id: LoadingId })
    }
  }

  return (
    <div className='mt-5'>
       <div className='bg-white max-w-md rounded overflow-hidden p-5 shadow mx-auto'>
         <h3 className='text-primary'>Welcome To The Chat App</h3>
         <form encType='multipart/form-data' onSubmit={handleForm}>
          <div className='flex flex-col mt-2 '>
            <label htmlFor='name'>Name: </label>
            <input 
             type='text' 
             name='name' 
             id='name' 
             minLength={5}
             maxLength={50}
             onChange={handleOnChange}
             value={data.name}
             required
             className='bg-white border outline-none focus:border-primary py-1 px-2 mt-2 '></input>
          </div>
          <div className='flex flex-col mt-2 '>
            <label htmlFor='email'>Email: </label>
            <input 
             type='email' 
             name='email' 
             id='email' 
             onChange={handleOnChange}
             value={data.email}
             required
             className='bg-white border outline-none focus:border-primary py-1 px-2 mt-2 '></input>
          </div>
          <div className='flex flex-col mt-2 '>
            <label htmlFor='password'>Password: </label>
            <input 
             type='password' 
             minLength={5}
             maxLength={50}
             name='password' 
             id='password' 
             onChange={handleOnChange}
             value={data.password}
             required
             className='bg-white border outline-none focus:border-primary py-1 px-2 mt-2 '></input>
          </div>
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
             required
             ref={inputRef}></input> 
          </div>
          <button className=' rounded-md mt-4 text-white text-lg w-full h-10 leading-loose bg-primary hover:bg-secondary cursor-pointer border shadow'>Register</button>
          <p className='text-center mt-3 text-sm'>Already Have An Account?  
          <span className='font-bold hover:text-primary cursor-pointer'><Link to="/email" > Login</Link></span></p>
        </form>
       </div>
    </div>
  )
}

export default RegisterPage