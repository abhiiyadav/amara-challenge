import React from 'react';
import Image from 'next/image';

type BotMessageProps = {
  text: string;
};

const BotMessage: React.FC<BotMessageProps> = ({ text }) => {
  return (
    <div className='flex self-start max-w-[90%] gap-2'>
      <Image
        width={66}
        height={90}
        src="/chatbot-icon-thumb.svg" alt="Bot" className='flex self-start p-1 h-11 w-11 bg-white rounded-full'
      />
      <div className='bg-white text-black border-[0.5px] border-[#D9D9D9] rounded-r-xl rounded-bl-xl rounded-tl-[4px] py-3 px-4'>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default BotMessage;
