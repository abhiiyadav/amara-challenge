import React from 'react';

export default function ChatbotIntro() {

    return (
        <div className="bg-[#9a6bff] !text-white rounded-lg p-3 w-1/2 justify-center shadow-[4px_6px_40px_0_rgba(0,0,0,0.05)] flex items-center">
            <div className="w-8 h-8 flex items-center justify-center mr-4">
                <img src="/chatbot-icon.svg" className='w-[50px] h-[68px] md:w-[66px] md:h-[90px]' alt="Bot" />
            </div>
            <div>
                <h1 className="text-xl font-bold">Hey!</h1>
                <span className='text-white text-sm'>I'm ATS Lite, here to help you find the best candidates.</span>
            </div>
      </div>
    );
}
