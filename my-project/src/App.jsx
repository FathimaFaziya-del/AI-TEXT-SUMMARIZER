import { useState, useEffect } from "react";



function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiReady, setAiReady] = useState(false);

  useEffect(()=> {
    const checkAiReady = setInterval (() =>{
      if(
        window.puter &&
        window.puter.ai &&
        typeof window.puter.ai.chat === "function"
        ){
          setAiReady(true);
          clearInterval(checkAiReady)
        }
   }, 300)
   return () => clearInterval(checkAiReady);
}, [])

const summarizeText = async () => {
  setLoading(true);
  setError("");
  setSummary("");
  
  try {
    const response = await window.puter.ai.chat(`Please summarize the following text: ${text}`);
    setSummary(response.message?.content || "No summary returned.")

  }
  catch (err) {
    setError(err.message || "An error occurred while summarizing the text.");
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-950 via-slate-950 to-purple-900 flex flex-col items-center justify-center p-3 gap-6">
      <h1 className="text-6xl sm:text-8xl bg-gradient-to-r from-blue-500 via-rose-500 to-indigo-500 bg-clip-text text-transparent text-center">
        AI Text Summarizer
      </h1>
      <div className={`px-4 py-2 rounded-full text-sm ${aiReady ?"bg-green-500/20 text-green-300 border border-green-500/30" : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"}`}>
        {aiReady ? "AI Ready" : "Waiting for AI..."}
      </div>

      <div className="w-full max-w-2xl bg-gradient-to-r from-gray-800/90 to-gray-700/90 backdrop-blur-md border border-gray-600 rounded-3xl p-6 shadow-2xl">
      <textarea className="w-full h-40 p-4 bg-gray-700/80 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300 disabled:opacity-50 resize-none shadow-xl focus:shadow-indigo-700/70" placeholder="Paste your text here..."
      value={text} 
      onChange={(e) => setText(e.target.value)} 
      disabled={!aiReady}  
      ></textarea>
      </div>
    </div>
  );
}
export default App