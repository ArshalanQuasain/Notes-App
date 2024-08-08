import React, { useEffect } from 'react';
import { LuCheck } from "react-icons/lu";
import { MdDeleteOutline, MdErrorOutline } from 'react-icons/md';

function Toast({ isShow, message, type, onClose }) {
  useEffect(() => {
    if (isShow) {
      const timeoutId = setTimeout(() => {
        onClose();
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isShow, onClose]);

  // Determine icon and color based on the type
  let icon, bgColor, borderColor;
  switch (type) {
    case 'delete':
      icon = <MdDeleteOutline className="text-xl text-red-500" />;
      bgColor = 'bg-red-50';
      borderColor = 'border-red-500';
      break;
    case 'edit':
      icon = <LuCheck className="text-xl text-green-500" />;
      bgColor = 'bg-green-50';
      borderColor = 'border-green-500';
      break;
    case 'error':
      icon = <MdErrorOutline className="text-xl text-yellow-500" />;
      bgColor = 'bg-yellow-50';
      borderColor = 'border-yellow-500';
      break;
    default: 
      return null; 
  }

  return (
    <div
      className={`absolute top-20 right-6 transition-all duration-400 ${isShow ? "opacity-100" : "opacity-0"}`}
      role="alert"
      aria-live="assertive"
    >
      <div
        className={`min-w-52 bg-white shadow-2xl rounded-md border ${borderColor} after:w-[5px] after:h-full ${borderColor} after:absolute after:left-0 after:top-0 after:rounded-l-lg`}
      >
        <div className='flex items-center gap-3 py-2 px-4'>
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full ${bgColor}`}
          >
            {icon}
          </div>
          <p className='text-sm text-slate-800'>{message}</p>
        </div>
      </div>
    </div>
  );
}

export default Toast;
