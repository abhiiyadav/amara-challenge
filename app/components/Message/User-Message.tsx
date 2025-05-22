import React from 'react';

type UserMessageProps = {
  text: string;
};

const UserMessage: React.FC<UserMessageProps> = ({ text }) => {
  return (
    <div className='justify-self-end bg-[#9a6bff] rounded-l-xl rounded-tr-xl rounded-br-[4px] py-3 px-4 flex self-end max-w-[90%]'>
        <span>{text}</span>
    </div>
  );
}

export default UserMessage;