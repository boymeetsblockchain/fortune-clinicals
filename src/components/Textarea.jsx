import React from "react";

const TextArea = ({ id, onChange, value, label, rows }) => {
  return (
    <div className="relative">
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        rows={rows}
        className="
          block
          rounded-md
          px-6
          pt-6
          pb-1
          w-full
          h-[260px]
          text-md
          text-neutral-700
          border
          border-black-100
          bg-white
          appearance-none
          focus:outline-none
          focus:ring-0
          peer
          invalid:border-b-1
        "
        placeholder=" "
      ></textarea>
      <label
        htmlFor={id}
        className="
          absolute
          text-md
          text-zinc-400
          duration-150
          transform
          -translate-y-3
          scale-75
          top-4
          z-10
          origin-[0]
          left-6
          peer-placeholder-shown:scale-100
          peer-placeholder-shown:translate-y-0
          peer-focus:scale-75
          peer-focus:-translate-y-3
        "
      >
        {label}
      </label>
    </div>
  );
};

export default TextArea;
