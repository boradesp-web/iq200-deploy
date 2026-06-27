import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, MessageSquare, Loader2, Search, ExternalLink, Info, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AiGuideChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [isListening, setIsListening] = useState(false);
  const isListeningRef = useRef(false);
  const [micVolume, setMicVolume] = useState(0);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [voiceStatus, setVoiceStatus] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startRecording = async () => {
    setVoiceError(null);
    setVoiceStatus("Connecting microphone...");
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setVoiceError("Microphone access is not supported or permitted in this browser window. Please make sure you are using HTTPS or try opening the app in a new tab!");
        setVoiceStatus(null);
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      if (AudioContextClass) {
        const audioCtx = new AudioContextClass();
        audioContextRef.current = audioCtx;

        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const checkVolume = () => {
          if (!mediaStreamRef.current) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;
          const normalizedVolume = Math.min(average / 128, 1);
          setMicVolume(normalizedVolume);
          animationFrameRef.current = requestAnimationFrame(checkVolume);
        };
        
        checkVolume();
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';

        rec.onstart = () => {
          isListeningRef.current = true;
          setIsListening(true);
          setVoiceStatus("Listening... Speak now!");
        };

        rec.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          const text = finalTranscript || interimTranscript;
          if (text.trim()) {
            setInput(text);
          }
        };

        rec.onerror = (event: any) => {
          console.warn('[Speech] Error event:', event.error);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setVoiceError("Microphone permission or Speech Recognition was denied. Click 'Open in New Tab' above or allow microphone access in browser settings!");
            stopRecording();
          } else if (event.error === 'no-speech') {
            setVoiceStatus("Listening... (No speech detected)");
          }
        };

        rec.onend = () => {
          // Keep active unless manually stopped or stream ends
          if (isListeningRef.current) {
            console.log('[Speech] restarting active recognition session due to unexpected onend');
            setTimeout(() => {
              if (isListeningRef.current && recognitionRef.current === rec) {
                try {
                  rec.start();
                } catch (err) {
                  console.warn('[Speech] failed to restart recognition:', err);
                }
              }
            }, 250);
          } else {
            stopRecording();
          }
        };

        recognitionRef.current = rec;
        rec.start();
      } else {
        isListeningRef.current = true;
        setIsListening(true);
        setVoiceStatus("Microphone stream is active, but Speech-to-Text is not natively supported in this browser.");
        console.warn('Native SpeechRecognition is not fully supported in this browser environment.');
      }
    } catch (err) {
      console.error('Failed to get microphone permissions/stream:', err);
      setVoiceError("Could not access microphone. Please make sure microphone access is allowed in your browser settings!");
      setVoiceStatus(null);
      isListeningRef.current = false;
      setIsListening(false);
    }
  };

  const stopRecording = () => {
    isListeningRef.current = false;
    setIsListening(false);
    setMicVolume(0);
    setVoiceStatus(null);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        const rec = recognitionRef.current;
        recognitionRef.current = null;
        rec.onend = null;
        rec.onerror = null;
        rec.stop();
      } catch (e) {
        console.error(e);
      }
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {
        console.error(e);
      }
      audioContextRef.current = null;
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(track => track.stop());
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    console.log("[AI-GUIDE] Chat component mounted and state checked", { isOpen, msgCount: messages.length });
    if (isOpen && messages.length === 0) {
      setMessages([
        { role: 'assistant', content: "Hey there! I am **OlymBot**, your interactive voice mentor. You can type or click the microphone to talk to me live. Ask me absolutely anything—from breaking down an intense Class 10 IMO math problem, to explaining a tough science concept, or even just asking a general question. What are we mastering today?" }
      ]);
    }
  }, [isOpen, messages.length]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ask-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: userMessage,
          history: messages 
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error (${res.status})`);
      }

      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.error || 'I encountered an issue retrieving that data. Please try again in 30 seconds.' }]);
      }
    } catch (error: any) {
      const errorMessage = error.message.includes('429') 
        ? "I am currently at peak capacity with student inquiries. Please try asking again in a minute."
        : "The Library is currently undergoing maintenance. Please retry in a few moments.";
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const [showHintBubble, setShowHintBubble] = useState(true);

  const renderMessageContent = (text: string, isUser = false) => {
    // Split text into lines
    return text.split('\n').map((line, j) => {
      const parts: React.ReactNode[] = [];
      let currentIdx = 0;
      
      // Matches standard **bold** or [text](#link) or [text](http://link)
      const regex = /(\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\))/g;
      let match;
      
      while ((match = regex.exec(line)) !== null) {
        const matchStart = match.index;
        const matchEnd = regex.lastIndex;
        
        // Add preceding text
        if (matchStart > currentIdx) {
          parts.push(line.substring(currentIdx, matchStart));
        }
        
        if (match[1].startsWith('**')) {
          parts.push(
            <strong key={`bold-${matchStart}`} className={`font-black ${isUser ? 'text-white' : 'text-indigo-900'}`}>
              {match[2]}
            </strong>
          );
        } else {
          const linkText = match[3];
          const linkTarget = match[4];
          parts.push(
            <a 
              key={`link-${matchStart}`} 
              href={linkTarget} 
              className={`${isUser ? 'text-white/90 hover:text-white underline' : 'text-indigo-600 hover:text-indigo-800'} underline font-black transition-colors inline-flex items-center gap-0.5`}
              onClick={(e) => {
                if (linkTarget.startsWith('#')) {
                  e.preventDefault();
                  const targetId = linkTarget.slice(1);
                  const targetElement = document.getElementById(targetId);
                  if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.location.hash = linkTarget;
                  }
                  setIsOpen(false);
                }
              }}
            >
              {linkText}
            </a>
          );
        }
        
        currentIdx = matchEnd;
      }
      
      if (currentIdx < line.length) {
        parts.push(line.substring(currentIdx));
      }
      
      if (line.trim() === '') {
        return <div key={j} className="h-2" />;
      }
      
      // Check if it's a list item starting with bullet points (e.g. • or * or -)
      const listMatch = line.trim().match(/^([•\-\*])\s*(.*)$/);
      if (listMatch) {
        const liParts: React.ReactNode[] = [];
        let liIdx = 0;
        const liLine = listMatch[2];
        const liRegex = /(\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\))/g;
        let limatch;
        while ((limatch = liRegex.exec(liLine)) !== null) {
          const mStart = limatch.index;
          const mEnd = liRegex.lastIndex;
          if (mStart > liIdx) {
            liParts.push(liLine.substring(liIdx, mStart));
          }
          if (limatch[1].startsWith('**')) {
            liParts.push(<strong key={`li-bold-${mStart}`} className={`font-black ${isUser ? 'text-white' : 'text-indigo-900'}`}>{limatch[2]}</strong>);
          } else {
            const linkText = limatch[3];
            const linkTarget = limatch[4];
            liParts.push(
              <a 
                key={`li-link-${mStart}`} 
                href={linkTarget} 
                className={`${isUser ? 'text-white/90 hover:text-white underline' : 'text-indigo-600 hover:text-indigo-800'} underline font-black transition-colors inline-flex items-center gap-0.5`}
                onClick={(e) => {
                  if (linkTarget.startsWith('#')) {
                    e.preventDefault();
                    const targetId = linkTarget.slice(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                      targetElement.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.location.hash = linkTarget;
                    }
                    setIsOpen(false);
                  }
                }}
              >
                {linkText}
              </a>
            );
          }
          liIdx = mEnd;
        }
        if (liIdx < liLine.length) {
          liParts.push(liLine.substring(liIdx));
        }

        return (
          <div key={j} className="flex gap-2 mb-2 last:mb-0 ml-1">
            <span className={`${isUser ? 'text-white' : 'text-indigo-500'} font-black shrink-0`}>•</span>
            <div className={`flex-1 leading-relaxed ${isUser ? 'text-white font-medium' : 'text-slate-700'}`}>{liParts.length > 0 ? liParts : liLine}</div>
          </div>
        );
      }

      return (
        <p key={j} className={`mb-2 last:mb-0 leading-relaxed ${isUser ? 'text-white font-medium' : 'text-slate-700'}`}>
          {parts.length > 0 ? parts : line}
        </p>
      );
    });
  };

  return (
    <>
      {/* 5. FLOATING "AI Mentor" WIDGET (Pulsing Gently) */}
      <div id="olymbot-widget" className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-[9999] flex flex-col items-end gap-2.5 pointer-events-none select-none">
        {showHintBubble && (
          <div id="olymbot-hint-bubble" className="bg-slate-900 border border-indigo-500/25 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center justify-between gap-2.5 text-xs font-semibold animate-bounce max-w-[280px] pointer-events-auto">
            <div className="flex items-center gap-2 min-w-0">
              <Bot className="w-4 h-4 text-indigo-400 shrink-0" />
              <p className="leading-snug text-left text-slate-100 font-bold text-[11px]">
                Your AI buddy is ready for your toughest questions. Tap to open!
              </p>
            </div>
            <button 
              id="olymbot-hint-close"
              onClick={(e) => { e.stopPropagation(); setShowHintBubble(false); }}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <button
          id="olymbot-open-chat-btn"
          onClick={() => setIsOpen(true)}
          className="p-4 bg-[#4F46E5] text-white rounded-full shadow-2xl hover:bg-indigo-700 transition-all hover:scale-110 active:scale-95 flex items-center justify-center gap-2 group relative pointer-events-auto select-auto"
          aria-label="Ask OlymBot Guide"
        >
          {/* Gentle pulsing outer ring */}
          <span className="absolute inset-x-0 inset-y-0 rounded-full border-4 border-indigo-500/30 animate-ping pointer-events-none"></span>
          
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-xs font-black uppercase tracking-wider">
            Consult OlymBot
          </span>
        </button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="olymbot-chat-container"
            initial={{ opacity: 0, y: 100, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 100, scale: 0.9, x: 20 }}
            className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-[9999] w-[calc(100%-2rem)] md:w-full max-w-[400px] h-[600px] max-h-[70vh] bg-white rounded-3xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden pointer-events-auto"
          >
            {/* Header */}
            <div id="olymbot-header-bar" className="p-4 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div id="olymbot-avatar-badge" className="p-2 bg-white/20 rounded-xl">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 id="olymbot-header-name" className="font-bold text-sm">OlymBot</h3>
                  <p id="olymbot-header-subtitle" className="text-[10px] text-indigo-100 flex items-center gap-1">
                    <Search className="w-3 h-3" /> Live Intelligent Tutors Active
                  </p>
                </div>
              </div>
              <button 
                id="olymbot-close-chat"
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              id="olymbot-messages-area"
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
            >
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  id={`msg-row-${i}`}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    id={`msg-bubble-${i}`}
                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' 
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className={msg.role === 'user' ? "text-white font-medium text-left leading-relaxed break-words" : "prose prose-sm max-w-none text-left prose-slate"}>
                      {renderMessageContent(msg.content, msg.role === 'user')}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div id="olymbot-loading-indicator" className="flex justify-start">
                  <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                    <span className="text-xs font-semibold text-slate-500 italic">OlymBot is formulating steps...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div id="olymbot-input-area" className="p-4 bg-white border-t border-slate-100 flex flex-col gap-2">
              {voiceStatus && (
                <div className="text-[11px] font-bold text-indigo-600 animate-pulse flex items-center gap-1.5 bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-100/50 self-start">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping shrink-0"></span>
                  <span>{voiceStatus}</span>
                </div>
              )}
              {voiceError && (
                <div className="text-[11px] font-bold text-red-600 flex items-start gap-1.5 bg-red-50 p-2.5 rounded-lg border border-red-100">
                  <span className="shrink-0 text-sm">⚠️</span>
                  <div className="flex-1 leading-snug">
                    {voiceError}
                    <button 
                      onClick={() => setVoiceError(null)} 
                      className="ml-1.5 text-[10px] underline font-black hover:text-red-800"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
              <div className="relative flex items-center">
                <button
                  id="olymbot-mic-button"
                  type="button"
                  onClick={toggleListening}
                  className={`absolute left-2 p-2 rounded-xl transition-all active:scale-90 shadow-md flex items-center justify-center z-10 bg-blue-600 text-white hover:bg-blue-700 ${
                    isListening ? 'animate-pulse' : ''
                  }`}
                  style={{
                    transform: isListening ? `scale(${1 + micVolume * 0.3})` : 'scale(1)',
                    boxShadow: isListening ? `0 0 ${10 + micVolume * 20}px rgba(37, 99, 235, 0.6)` : 'none'
                  }}
                  title={isListening ? "Listening... Click to stop" : "Tap to talk"}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <input
                  id="olymbot-text-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isListening ? "Listening... Speak now!" : "Type or tap mic to talk..."}
                  className="w-full pl-12 pr-12 py-3 bg-indigo-600 text-white placeholder-indigo-200 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold"
                />
                <button
                  id="olymbot-send-button"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 bg-white text-indigo-600 rounded-xl hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-90 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p id="olymbot-footer-credit" className="mt-2 text-[9px] text-slate-400 text-center flex items-center justify-center gap-1">
                Powered by Gemini Audio Guidance Interface
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
