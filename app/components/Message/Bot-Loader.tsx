import React from 'react';


const BotLoader = () => {
  return (
    <div className='flex self-start max-w-sm gap-2'>
      <img
        src="/chatbot-icon-thumb.svg" alt="Bot" className='flex self-start p-1 h-11 w-11 bg-white rounded-full'
      />
      <div className='bg-white text-black border-[0.5px] border-[#D9D9D9] rounded-r-xl rounded-bl-xl rounded-tl-[4px] py-3 px-4 content-center'>
        <div className="flex items-center justify-center">
            <div className="w-2.5 h-2.5 mx-1 bg-[#9a6bff] rounded-full animate-jump delay-200"></div>
            <div className="w-2.5 h-2.5 mx-1 bg-[#9a6bff] rounded-full animate-jump delay-400"></div>
            <div className="w-2.5 h-2.5 mx-1 bg-[#9a6bff] rounded-full animate-jump delay-600"></div>
        </div>
      </div>
    </div>
  );
};

export default BotLoader;
