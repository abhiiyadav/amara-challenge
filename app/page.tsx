'use client';
import React, { use, useEffect, useRef } from "react";
import BotMessage from "../app/components/Message/Bot-Message";
import UserMessage from "./components/Message/User-Message";
import ChatbotIntro from "./components/Cards/Intro-Card";
import { think } from '../app/actions/think';
import BotLoader from "./components/Message/Bot-Loader";
import {
  loadCandidatesFromCSV,
  filterCandidates,
  rankCandidates,
} from '../utils/utils';

export default function Home() {
  
  const [chatMessages, setChatMessages] = React.useState([]);
  const [botMessage, setBotMessage] = React.useState("");
  const [userMessage, setUserMessage] = React.useState("");
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [finalCandidates, setFinalCandidates] = React.useState([]);
  const lastMessageRef = useRef(null);

  const appendUserMessage = (message: string) => {
    processUserMessage(message);
    setChatMessages((prevMessages) => [
      ...prevMessages,
      <UserMessage text={message} />,
    ]);
    setInput("");
  };

  const appendBotMessage = (message: string) => {
    setChatMessages((prevMessages) => [
      ...prevMessages,
      <BotMessage text={message} />,
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
      const { filter, rank } = result;
      // appendBotMessage("Here are the top candidates based on your request:");
      if(result){
        appendBotMessage(result?.explanation);
        console.log("le beta: ", result);
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
      
      // appendBotMessage("JSON: " + JSON.stringify(result));
      // try{
      //   const candidates = loadCandidatesFromCSV();
      //   const filtered = filterCandidates(candidates, result?.filter);
      //   const ranked = rankCandidates(filtered, result?.rank);
      //   setFinalCandidates(ranked);
      // }
      // catch (error) {
      //   appendBotMessage("Error: " + error);
      // }
      // appendBotMessage("Filtered and ranked candidates successfully." + JSON.stringify(finalCandidates));
    }
    setIsLoading(false);
  };

  const processUserMessage = async (message: string) => {
    const headers = getCsvHeader();
    await headers.then((resolvedHeaders) => {
      sendMessageToBot(message, resolvedHeaders.join(', '));
    }).catch((error) => {
    });
  };

  useEffect(() => {
    setChatMessages((prevMessages) => [
      ...prevMessages,
      <BotMessage text="How can I assist you today?" />,
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
                    <img className="h-5 w-5" src="/send-message-icon.svg" alt="send message" />
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
