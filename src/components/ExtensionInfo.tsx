import { useState } from 'react';
import { Download, ExternalLink, HelpCircle } from 'lucide-react';

export function ExtensionInfo() {
  const [isOpen, setIsOpen] = useState(false);

  // This is a sample Python script that users can manually Add to OpenOffice
  // In a real scenario, we could provide an OXT file, but for the web app
  // we provide instructions and the trigger URL.
  const pythonScript = `
import uno
import webbrowser
import urllib.parse

def OpenWriterMind():
    # Get current document selection
    desktop = XSCRIPTCONTEXT.getDesktop()
    model = desktop.getCurrentComponent()
    selection = model.getCurrentSelection()
    
    if selection:
        first_range = selection.getByIndex(0)
        text = first_range.getString()
        
        # Open web app with content
        base_url = "${window.location.origin}"
        encoded_text = urllib.parse.quote(text)
        url = f"{base_url}?content={encoded_text}"
        webbrowser.open(url)

# Required for OpenOffice Scripts menu
g_exportedScripts = (OpenWriterMind,)
  `.trim();

  const copyScript = () => {
    navigator.clipboard.writeText(pythonScript);
    alert('Python script copied to clipboard!');
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <HelpCircle className="w-4 h-4" />
        OpenOffice Setup
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Use with OpenOffice Writer</h2>
                <p className="text-slate-500 mt-1">Connect this AI assistant directly to your desktop app.</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">1</span>
                  The "Quick-Bridge" Method (Recommended)
                </h3>
                <p className="text-sm text-slate-600 mb-4 ml-8">
                  Simply select text in OpenOffice Writer, copy it, and paste it here. Use the AI to transform it, then click <strong>Export .odt</strong> to download the updated document.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">2</span>
                  Professional Python Script (ADVANCED)
                </h3>
                <div className="ml-8 space-y-3">
                  <p className="text-sm text-slate-600">
                    Add a "Open in AI" command to your OpenOffice <strong>Tools &gt; Macros</strong> menu. 
                  </p>
                  <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-300 relative overflow-hidden">
                    <pre className="overflow-x-auto">{pythonScript.substring(0, 200)}...</pre>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex items-end justify-center pb-4">
                      <button 
                        onClick={copyScript}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg"
                      >
                        <Download className="w-3 h-3" />
                        Copy Full Script
                      </button>
                    </div>
                  </div>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <h4 className="text-sm font-semibold text-blue-800 mb-1">How to Install</h4>
                    <ol className="text-xs text-blue-700 list-decimal ml-4 space-y-1">
                      <li>Open Writer and go to <strong>Tools &gt; Macros &gt; Organize Macros &gt; Python</strong>.</li>
                      <li>Locate your My Macros folder on disk.</li>
                      <li>Create a new file named <code>writermind.py</code> and paste the script.</li>
                      <li>Assign it to a toolbar button for one-click AI processing.</li>
                    </ol>
                  </div>
                </div>
              </section>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-all text-sm"
                >
                  Got it
                </button>
                <a 
                  href="https://www.openoffice.org/download/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all text-sm flex items-center gap-2"
                >
                  Get OpenOffice <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
