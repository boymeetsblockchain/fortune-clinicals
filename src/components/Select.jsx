import React from "react";

const Select = ({ id, onChange, value, label, options }) => {
  return (
    <div className="relative group">
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="block rounded-xl px-5 pt-6 pb-2 w-full text-md text-slate-700 bg-white border border-slate-200 appearance-none focus:outline-none focus:ring-4 focus:ring-[#FF5162]/10 focus:border-[#FF5162] peer transition-all duration-200 cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label
        htmlFor={id}
        className="absolute text-sm font-medium text-slate-400 duration-200 transform -translate-y-3 scale-85 top-4 z-10 origin-[0] left-5 peer-focus:scale-85 peer-focus:-translate-y-3 peer-focus:text-[#FF5162] pointer-events-none"
      >
        {label}
      </label>
      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400 peer-focus:text-[#FF5162]">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
};

export default Select;
