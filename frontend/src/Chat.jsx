import React, { useContext, useEffect, useState, useRef } from 'react'
import { ChatContext } from './context/ChatContext.jsx'
import { animate, stagger } from 'animejs'
import Markdown from 'react-markdown'
import Highlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import "highlight.js/styles/github-dark.css"
import logo from './assets/logo2.png'
import './Chat.css'

function getNodeText(node) {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(getNodeText).join('');
    if (node?.props?.children) return getNodeText(node.props.children);
    return '';
}

function CodeBlock({ children }) {
    const [copied, setCopied] = useState(false);
    const code = getNodeText(children).trimEnd();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="codeBlock">
            <div className="codeBlockHeader">
                <span><i className="fa-solid fa-code"></i> Code</span>
                <button className={copied ? 'copyCodeBtn copied' : 'copyCodeBtn'} onClick={handleCopy}>
                    <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
            <pre>{children}</pre>
        </div>
    );
}

export default function Chat() {

    const { newChat, previousChats, reply, setPrompt } = useContext(ChatContext);
    const [typedReply, setTypedReply] = useState("");
    const welcomeRef = useRef(null);
    const chatsEndRef = useRef(null);
    const shouldFollowReplyRef = useRef(true);


    //! Typing word effect
    useEffect(() => {
        if (!reply) {
            setTypedReply("");
            return;
        }

        const tokens = reply.match(/\s+|\S+/g) || [];
        let index = 0;
        setTypedReply("");

        const interval = setInterval(() => {
            if (index >= tokens.length) {
                clearInterval(interval);
                return;
            }

            const nextToken = tokens[index];
            index += 1;
            setTypedReply((prev) => `${prev}${nextToken}`);
        }, 40);

        return () => clearInterval(interval);
    }, [reply]);

    // Animate welcome hero on mount
    useEffect(() => {
        if (newChat && welcomeRef.current) {
            animate('.welcomeLogoRing', {
                scale: [0, 1],
                opacity: [0, 1],
                rotate: [180, 0],
                duration: 800,
                ease: 'outElastic(1, .5)',
            });

            animate('.welcomeTitle', {
                opacity: [0, 1],
                translateY: [25, 0],
                duration: 600,
                ease: 'outExpo',
                delay: 300,
            });

            animate('.welcomeSubtitle', {
                opacity: [0, 1],
                translateY: [15, 0],
                duration: 500,
                ease: 'outExpo',
                delay: 500,
            });

            animate('.suggestionCard', {
                opacity: [0, 1],
                translateY: [30, 0],
                scale: [0.9, 1],
                duration: 600,
                delay: stagger(100, { start: 650 }),
                ease: 'outExpo',
            });
        }
    }, [newChat]);

    useEffect(() => {
        const scrollArea = document.querySelector('.chatScrollArea');
        if (!scrollArea) return;

        const updateFollowState = () => {
            const distanceFromBottom = scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight;
            shouldFollowReplyRef.current = distanceFromBottom < 140;
        };

        updateFollowState();
        scrollArea.addEventListener('scroll', updateFollowState, { passive: true });

        return () => scrollArea.removeEventListener('scroll', updateFollowState);
    }, []);


    useEffect(() => {
        const latestChat = previousChats[previousChats.length - 1];

        if (latestChat?.role === 'user') {
            shouldFollowReplyRef.current = true;
        }

        if (chatsEndRef.current && shouldFollowReplyRef.current) {
            chatsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [previousChats, typedReply]);


    useEffect(() => {
        if (previousChats.length > 0) {
            const lastMsg = document.querySelector('.chats > div:last-child');
            if (lastMsg) {
                animate(lastMsg, {
                    opacity: [0, 1],
                    translateY: [15, 0],
                    duration: 400,
                    ease: 'outQuad',
                });
            }
        }
    }, [previousChats.length]);

    const handleChipClick = (suggestionText) => {
        if (setPrompt) {
            setPrompt(suggestionText);
        }
    };

    const markdownComponents = {
        pre: CodeBlock,
        table: ({ children }) => (
            <div className="markdownTableWrapper">
                <table>{children}</table>
            </div>
        ),
    };

    return (
        <div className="chatContainer">
            {newChat && (
                <div className="welcomeHero" ref={welcomeRef}>
                    <div className="welcomeLogoRing" style={{ opacity: 0 }}>
                        <img src={logo} alt="Synapse Logo" className="welcomeLogo" />
                    </div>
                    <h1 className="welcomeTitle" style={{ opacity: 0 }}>
                        Where should we <span className="synapseBrandText">begin?</span>
                    </h1>
                    <p className="welcomeSubtitle" style={{ opacity: 0 }}>Connect your ideas with Synapse neural intelligence</p>

                    <div className="suggestionGrid">
                        <div className="suggestionCard" style={{ opacity: 0 }} onClick={() => handleChipClick("Explain quantum computing in simple terms")}>
                            <i className="fa-solid fa-atom cardIcon"></i>
                            <div className="cardContent">
                                <h4>Explain Concepts</h4>
                                <p>Quantum computing in simple terms</p>
                            </div>
                        </div>
                        <div className="suggestionCard" style={{ opacity: 0 }} onClick={() => handleChipClick("Write a clean React component for a responsive table")}>
                            <i className="fa-solid fa-code cardIcon"></i>
                            <div className="cardContent">
                                <h4>Write Code</h4>
                                <p>Clean React component for a responsive table</p>
                            </div>
                        </div>
                        <div className="suggestionCard" style={{ opacity: 0 }} onClick={() => handleChipClick("Draft a creative pitch for an innovative AI app")}>
                            <i className="fa-solid fa-lightbulb cardIcon"></i>
                            <div className="cardContent">
                                <h4>Brainstorm Ideas</h4>
                                <p>Draft a creative pitch for an AI app</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="chats">
                {
                    previousChats?.map((chat, idx) => {
                        const isLatestAssistant = idx === previousChats.length - 1 && chat.role !== "user";

                        return (
                            <div className={chat.role === "user" ? "userDiv" : "aiDiv"} key={idx}>
                                {
                                    chat.role === "user" ?
                                        <div className="userMessageWrapper">
                                            <p className="userMessage">{chat.content}</p>
                                        </div> :
                                        <div className="aiMessageWrapper">
                                            <div className="aiAvatar">
                                                <img src={logo} alt="Synapse AI" />
                                            </div>
                                            <div className="aiMessage">
                                                {isLatestAssistant ?
                                                    <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[Highlight]} components={markdownComponents}>{typedReply || chat.content}</Markdown> :
                                                    <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[Highlight]} components={markdownComponents}>{chat.content}</Markdown>
                                                }
                                            </div>
                                        </div>
                                }
                            </div>
                        );
                    })
                }
                <div ref={chatsEndRef} />
            </div>
        </div>
    )
}
