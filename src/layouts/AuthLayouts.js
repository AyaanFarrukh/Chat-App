import React from 'react'
import Logo from "../assets/logo.png";

const AuthLayouts = ({ children }) => {
  return (
    <>
    <header className='flex justify-center items-center py-5 shadow-md bg-white'>
      <img 
      src={Logo}
      alt='logo'
      width={200}
      height={60}
      >
      </img>
    </header>
    { children }
    </>
  )
}

export default AuthLayouts