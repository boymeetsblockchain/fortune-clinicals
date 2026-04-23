import React from "react";

const Input = ({id, onChange, value, label, name, type, disabled})=>{
    return(
        <div className="relative group">
             <input 
              id={id}
              name={name}
              value={value}
              type={type}
              onChange={onChange}
              autoComplete="none"
              disabled={disabled}
              className="block rounded-xl px-5 pt-6 pb-2 w-full text-md text-slate-700 bg-white border border-slate-200 appearance-none focus:outline-none focus:ring-4 focus:ring-[#FF5162]/10 focus:border-[#FF5162] peer transition-all duration-200"
              placeholder=" " />
        <label htmlFor={id} className="absolute text-sm font-medium text-slate-400 duration-200 transform -translate-y-3 scale-85 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-3 peer-focus:text-[#FF5162]">{label}</label>
        </div>
    )
}

export default Input