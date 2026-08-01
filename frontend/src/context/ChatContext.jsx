import React, { useState, createContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const ChatContext = createContext();

export function ChatProvider({ children }) {
    const [prompt, setPrompt] = useState("");
    const [reply, setReply] = useState(null);
    const [threadId, setThreadId] = useState(uuidv4());
    const [previousChats, setPreviousChats] = useState([]);
    const [newChat, setNewChat] = useState(true);
    const [allThreads, setAllThreads] = useState([]);

    const providerValues = {
        prompt, setPrompt,
        reply, setReply,
        threadId, setThreadId,
        newChat, setNewChat,
        previousChats, setPreviousChats,
        allThreads, setAllThreads
    };

    return (
        <ChatContext.Provider value={providerValues}>
            {children}
        </ChatContext.Provider>
    );
}