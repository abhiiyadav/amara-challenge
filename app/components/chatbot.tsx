'use client';
import React, { useState, useEffect, useRef } from "react";
import Image from 'next/image';
import BotMessage from "../components/Message/Bot-Message";
import UserMessage from "./Message/User-Message";
import ChatbotIntro from "./Cards/Intro-Card";
import { think } from '../actions/think';
import BotLoader from "./Message/Bot-Loader";

export default function Chatbot() {
  
  const [chatMessages, setChatMessages] = useState<React.ReactElement[]>([]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const appendUserMessage = (message: string) => {
    processUserMessage(message);
    setChatMessages((prevMessages) => [
      ...prevMessages,
      <UserMessage key={`user-${Date.now()}`} text={message} />,
    ]);
    setInput("");
  };

  const appendBotMessage = (message: string) => {
    setChatMessages((prevMessages) => [
      ...prevMessages,
      <BotMessage key={`bot-${Date.now()}`} text={message} />,
    ]);
  };

  const getCsvHeader = async () => {
    try {
      const response = await fetch('/candidates.csv');
      const csvText = await response.text();
      const [headerLine] = csvText.split('\n');
      return headerLine.split(',');
    } catch (error) {
      console.error('Error fetching CSV headers:', error);
      return [];
    }
  };

  const sendMessageToBot = async (message: string, headers: string) => {
    setIsLoading(true);
    const result = await think(message, headers);
    if (result.error) {
      appendBotMessage("Error: " + result.error);
    } else {
      if(result){
        appendBotMessage(result?.explanation ?? "Couldn't generate a response");
        result?.candidates?.slice(0, 3).forEach(candidate => {
          appendBotMessage(
            `👤 ${candidate.full_name} — ${candidate.title} (${candidate.years_experience} yrs)\n` +
            `📍 ${candidate.location}\n` +
            `💼 ${candidate.summary}\n` +
            `🔗 (${candidate.linkedin_url})`
          );
        });
      }
      else{
        appendBotMessage("No candidates found.");
      }
    }
    setIsLoading(false);
  };

  const processUserMessage = async (message: string) => {
    const headers = getCsvHeader();
    await headers.then((resolvedHeaders) => {
      sendMessageToBot(message, resolvedHeaders.join(', '));
    }).catch((error) => {
      console.error('Error fetching CSV headers:', error);
    });
  };

  useEffect(() => {
    setChatMessages((prevMessages) => [
      ...prevMessages,
      <BotMessage key="1" text="How can I assist you today?" />,
    ]);
  }, []);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [chatMessages]);

  return (
    <div>
        <main className="flex justify-center w-full h-screen">
          <div className="flex bg-white flex-col rounded-lg shadow-[0_0px_16px_0_rgba(0,0,0,0.12)] items-center max-w-[900px] w-full gap-6 my-6 pt-4">
            <ChatbotIntro />
            <div className=" w-full h-full p-4 flex flex-col items-center justify-between">
              <div className="flex flex-col gap-4 w-full max-h-[62vh] overflow-y-auto">
                  {chatMessages.map((chatMessage, index) => (
                    <div
                      key={index}
                      ref={index === chatMessages.length - 2 ? lastMessageRef : null}
                    >
                      {chatMessage}
                    </div>
                  ))}
                  {isLoading && (
                    <BotLoader />
                  )}
              </div>
              <div className='w-full flex flex-col items-center z-10'>
                <div className='flex w-full'>
                  <input
                    type="text"
                    placeholder="Type your question here"
                    className="flex-1 p-3 border bg-white rounded-lg border-[#9a6bff] focus:outline-none text-black"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && input.trim() !== "") {
                        appendUserMessage(input);
                      }
                    }}
                    disabled={isLoading}
                  />
                  <button className="ml-2 bg-white" onClick={() => appendUserMessage(input)} disabled={isLoading}>
                    <Image width={20} height={20} src="/send-message-icon.svg" alt="send message" />
                  </button>
                </div>
                <div className="mt-4 text-center text-gray-500 text-xs">
                  Made by Abhishek for Amara
                </div>
              </div>
            </div>
          </div>
        </main>

      </div>
  );
}
