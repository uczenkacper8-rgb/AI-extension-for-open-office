import { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Download, 
  Menu, 
  X, 
  Settings, 
  Save,
  Type,
  Trash2,
  Share2
} from 'lucide-react';
import { AISidebar } from './components/AISidebar';
import { ExtensionInfo } from './components/ExtensionInfo';
import { generateODT } from './services/odtService';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

export default function App() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Untitled Document');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle incoming content from extension (URL params)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const incomingContent = params.get('content');
    if (incomingContent) {
      setContent(decodeURIComponent(incomingContent));
      // Remove param from URL without refreshing
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleExport = () => {
    generateODT(content, title);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear current work?')) {
      setContent('');
      setTitle('Untitled Document');
    }
  };

  const insertAIContent = (newText: string) => {
    setContent(prev => {
      if (!prev) return newText;
      return prev + '\n\n' + newText;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-office-bg text-office-text font-sans overflow-hidden">
      {/* Top Menu Bar (Classic Office Style) */}
      <nav className="h-8 flex items-center px-4 bg-office-surface border-b border-office-border text-xs space-x-6 z-50">
        <div className="flex space-x-4">
          <button className="hover:text-office-accent cursor-default">File</button>
          <button className="hover:text-office-accent cursor-default">Edit</button>
          <button className="hover:text-office-accent cursor-default">View</button>
          <button className="hover:text-office-accent cursor-default">Insert</button>
          <button className="hover:text-office-accent cursor-default">Format</button>
          <button className="hover:text-office-accent cursor-default">Tools</button>
          <button className="font-bold text-office-accent cursor-default">AI Assistant</button>
          <button className="hover:text-office-accent cursor-default">Help</button>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
          {lastSaved && <span>AUTO-SAVED {lastSaved.toLocaleTimeString()}</span>}
        </div>
      </nav>

      {/* Main Toolbar */}
      <header className="h-10 flex items-center px-4 bg-office-toolbar border-b border-office-border space-x-3 z-40 shadow-sm overflow-x-auto whitespace-nowrap">
        <div className="flex items-center space-x-1 border-r border-[#DDDDDD] pr-3 mr-1">
          <button 
            onClick={handleClear}
            className="p-1.5 hover:bg-[#E5E5E5] rounded text-gray-600 transition-colors" 
            title="New Document"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-[#E5E5E5] rounded text-gray-600 transition-colors" title="Save">
            <Save className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center px-3 py-1 bg-white border border-office-border rounded text-xs min-w-[120px] justify-between cursor-pointer">
          <span>Times New Roman</span>
          <Menu className="w-3 h-3 ml-2 text-gray-400" />
        </div>

        <div className="flex items-center px-3 py-1 bg-white border border-office-border rounded text-xs w-16 justify-between cursor-pointer">
          <span>12</span>
          <Menu className="w-3 h-3 ml-2 text-gray-400" />
        </div>

        <div className="flex space-x-1 border-l border-office-border pl-3">
          <button className="w-7 h-7 flex items-center justify-center font-bold border border-office-border hover:bg-white transition-colors bg-[#f0f0f0] rounded-sm">B</button>
          <button className="w-7 h-7 flex items-center justify-center italic border border-office-border hover:bg-white transition-colors bg-[#f0f0f0] rounded-sm">I</button>
          <button className="w-7 h-7 flex items-center justify-center underline border border-office-border hover:bg-white transition-colors bg-[#f0f0f0] rounded-sm">U</button>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <ExtensionInfo />
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-1.5 bg-office-accent text-white rounded shadow-sm font-semibold text-xs hover:bg-[#0044A5] transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .odt</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Vertical Icon Rail */}
        <nav className="w-10 bg-[#DEDEDE] border-r border-office-border flex flex-col items-center py-6 space-y-6 hidden sm:flex">
          <button className="p-2 text-office-accent bg-white rounded shadow-sm" title="Write">
            <Type className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-[#E5E5E5] rounded" title="Share">
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn(
              "p-2 rounded transition-colors",
              sidebarOpen ? "text-office-accent bg-white shadow-sm" : "text-gray-600 hover:bg-[#E5E5E5]"
            )} 
            title="Toggle AI Assistant"
          >
            <Settings className="w-5 h-5" />
          </button>
        </nav>

        {/* Main Editor Surface - Styled as a Page on Desktop */}
        <main className="flex-1 overflow-y-auto p-4 md:p-12 flex flex-col items-center bg-[#808080]">
           <div className="w-full max-w-[800px] mb-4">
             <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent border-none focus:ring-0 font-bold text-white text-sm w-full opacity-70 hover:opacity-100 transition-opacity"
              />
           </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[800px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-sm min-h-[1056px] flex flex-col"
          >
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing or select text in OpenOffice and send it here..."
              className="flex-1 w-full p-16 sm:p-20 focus:outline-none resize-none bg-transparent font-serif text-lg text-slate-800 leading-relaxed placeholder:font-sans placeholder:italic placeholder:text-gray-300"
            />
          </motion.div>

          <footer className="mt-12 text-center text-white/50 text-[10px] pb-10 uppercase tracking-widest">
            Page 1 of 1 • WriterMind AI Enterprise Edition • OpenOffice Stable
          </footer>
        </main>

        {/* Side AI Panel - Styled to match Office design */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-office-surface border-l border-office-border flex flex-col z-20 shadow-2xl overflow-hidden"
            >
              <AISidebar 
                editorContent={content} 
                onApplyChange={insertAIContent} 
              />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Modern Status Bar */}
      <footer className="h-6 bg-office-surface border-t border-office-border flex items-center px-4 justify-between text-[10px] text-gray-500">
        <div className="flex items-center space-x-4">
          <span>Page 1 of 1</span>
          <span className="w-px h-3 bg-office-border" />
          <span>{content.split(/\s+/).filter(Boolean).length} Words</span>
          <span className="w-px h-3 bg-office-border" />
          <span>English (US)</span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
             <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500/50" />
             <span className="font-bold tracking-tight text-gray-700">AI CONNECTED</span>
          </div>
          <span>v2.4.1</span>
        </div>
      </footer>
    </div>
  );
}

