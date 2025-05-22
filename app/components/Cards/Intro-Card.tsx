import React from 'react';
import Image from 'next/image';

export default function ChatbotIntro() {

    return (
        <div className="bg-[#9a6bff] !text-white rounded-lg p-3 w-1/2 justify-center shadow-[4px_6px_40px_0_rgba(0,0,0,0.05)] flex items-center">
            <div className="w-8 h-8 flex items-center justify-center mr-4">
                <Image width={66} height={90} src="/chatbot-icon.svg" alt="Bot" />
            </div>
            <div>
                <h1 className="text-xl font-bold">Hey!</h1>
                <span className='text-white text-sm'>I&apos;m ATS Lite, here to help you find the best candidates.</span>
            </div>
      </div>
    );
}
