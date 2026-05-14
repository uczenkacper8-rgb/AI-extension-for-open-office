import { useState } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { generateContent } from '../services/gemini';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';

interface AISidebarProps {
  editorContent: string;
  onApplyChange: (newText: string) => void;
}

export function AISidebar({ editorContent, onApplyChange }: AISidebarProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await generateContent(userMsg, editorContent);
      setMessages(prev => [...prev, { role: 'ai', content: response || 'No response generated.' }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please check your API key.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-office-surface w-full">
      <div className="p-3 bg-[#E1E1E1] border-b border-office-border flex justify-between items-center">
        <h2 className="text-xs font-bold text-[#444444] flex items-center tracking-tight">
          <Sparkles className="w-4 h-4 mr-2 text-office-accent" />
          AI WRITING ASSISTANT
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Context Preview */}
        <div className="bg-white border border-[#D1D1D1] rounded p-3 shadow-sm">
          <p className="text-[10px] text-gray-400 uppercase font-bold mb-2 tracking-widest">Selected Context</p>
          <div className="bg-[#F9F9F9] border-l-2 border-office-accent p-2 text-xs italic text-gray-500 line-clamp-3">
            {editorContent || 'No text selected yet. Type in the document to provide context.'}
          </div>
        </div>

        {/* Command Grid */}
        <div className="space-y-2">
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Quick Commands</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Summarize', prompt: 'Please summarize this text concisely.' },
              { label: 'Simplify', prompt: 'Rewrite this text to be easier to understand.' },
              { label: 'Fix Grammar', prompt: 'Identify and correct any grammatical errors in this text.' },
              { label: 'Make Formal', prompt: 'Rewrite this text in a formal, professional tone.' }
            ].map(cmd => (
              <button 
                key={cmd.label}
                onClick={() => {
                  setInput(cmd.prompt);
                  handleSend();
                }}
                className="flex items-center justify-center p-2 bg-white border border-office-border rounded text-[11px] font-medium text-gray-600 hover:border-office-accent hover:text-office-accent transition-colors shadow-sm"
              >
                {cmd.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-office-border mx-2" />

        {/* Chat Messages */}
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "p-3 rounded border shadow-sm text-xs",
                msg.role === 'user' 
                  ? "bg-[#F9F9F9] border-office-border text-gray-600 border-l-office-accent border-l-2" 
                  : "bg-white border-office-border text-office-text"
              )}
            >
              <div className="markdown-body">
                <Markdown>{msg.content}</Markdown>
              </div>
              {msg.role === 'ai' && (
                <button
                  onClick={() => onApplyChange(msg.content)}
                  className="mt-3 px-3 py-1 bg-office-accent text-white rounded text-[10px] font-bold hover:bg-[#0044A5] transition-all flex items-center gap-1 uppercase tracking-tighter"
                >
                  <Sparkles className="w-3 h-3" /> Insert into document
                </button>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-office-accent text-[10px] font-bold italic animate-pulse p-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              GENERATING CONTENT...
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-office-border">
        <div className="flex flex-col border border-office-border rounded bg-[#F9F9F9]">
          <div className="p-2 border-b border-office-border flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-[10px] text-gray-500 font-mono uppercase tracking-tighter">Gemini Pro AI • Ready</span>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask AI assistant..."
            className="w-full p-3 text-xs focus:outline-none resize-none bg-transparent min-h-[80px]"
          />
          <div className="p-2 flex justify-end">
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-4 py-1.5 bg-office-accent text-white text-xs font-bold rounded shadow-sm disabled:opacity-30 hover:bg-[#0044A5] transition-all uppercase tracking-tighter"
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
