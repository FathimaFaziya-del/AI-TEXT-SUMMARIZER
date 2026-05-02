import { useState, useEffect } from "react";



function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiReady, setAiReady] = useState(false);
// USED TO SET THE LENGTH OF THE SUMMARY, BUT FOR NOW IT'S FIXED TO SHORT
  const [length, setLength] = useState("short");
  // history state
  const [history, setHistory] = useState([]);

  const prompts = {
    short:    `Summarize the following text in 2-3 sentences only: ${text}`,
    medium:   `Summarize the following text in a short paragraph (5-6 sentences): ${text}`,
    detailed: `Summarize the following text in detail, covering all key points: ${text}`,
  };

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
    // uses selected prompt instead of hardcoded one
    const response = await window.puter.ai.chat(prompts[length]);
    const content = response.message?.content;


    let result = "";
    if (Array.isArray(content)) {
      result = content[0]?.text || "No summary returned.";
    } else if (typeof content === "string") {
      result = content;
    } else {
      result = "No summary returned.";
    }
    
    setSummary(result);


    // Save to History
    setHistory((prev) => [
      { text: text.slice(0, 60) + "...", summary: result, length: length }, 
      ...prev
    ]);

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

      {/* Length selector buttons */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <span className="text-gray-400 text-sm">Summary length:</span>
          {["short", "medium", "detailed"].map((option) => (
            <button
              key={option}
              onClick={() => setLength(option)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition capitalize
                ${length === option
                  ? "bg-gradient-to-r from-rose-500 to-purple-500 text-white border-transparent"
                  : "bg-transparent text-gray-400 border-gray-500 hover:text-white hover:border-gray-300"
                }`}
            >
              {option}
            </button>
          ))}
        </div>

      <button onClick={summarizeText} className="mt-4 px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-500 hover:opacity-80 text-white font-semibold rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"

      disabled={!aiReady || loading || !text.trim()}
      >
        {
          loading ?(
            <div className="flex items-center gap-2">
              <div className = "animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
              Summarizing...
            </div>
          ) : (
            "Summarize"
          )
        }
      </button>


      <div className="mt-6 space-y-4 text-white">
       {summary && (
        <div className="p-4 bg-gray-700/60 border border-gray-500 rounded-xl whitespace-pre-wrap">
          <p className="text-xs text-green-400 mb-2 uppercase tracking-widest">Latest</p>
          {summary}
        </div>
       )}

        {error && (
          <div className="p-4 bg-red-100 text-red-700 border border-red-300 rounded-xl">
            {error}
          </div>
        )}

      </div>
      {history.length > 0 && (
        <div className="mt-6">
          <p className="text-gray-400 text-sm mb-3">Recent Summaries</p>
          {history.map((item, index) => (
            <div key={index}
              className="mb-3 p-4 bg-gray-800/60 border border-gray-600 rounded-xl cursor-pointer hover:border-gray-400 transition"
              onClick={() => setSummary(item.summary)}
            >
              <p className="text-gray-400 text-xs mb-1 capitalize">{item.length} summary</p>
              <p className="text-gray-300 text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
  );
}
export default App