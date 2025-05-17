import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const PasswordInput = ({ value, onChange, placeholder }) => {

  const [isShowPassword, setIsPassword] = useState(false);

  const togglePassword = () => {
    setIsPassword(!isShowPassword);
  };

  return (
    <div className='flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3'>
      <input
      value={value}
      onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder={"Password"}
        className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"></input>
        
      {isShowPassword ? (<FaRegEye
        size={22}
        className="text-blue-400 cursor-pointer"
        onClick={() => togglePassword()}></FaRegEye>) :
         (<FaRegEyeSlash
          size={22}
          className="text-blue-400 cursor-pointer"
          onClick={() => togglePassword()}></FaRegEyeSlash>
          )}
    </div>
  )
}

export default PasswordInput