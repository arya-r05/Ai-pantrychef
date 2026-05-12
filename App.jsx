import { useState } from 'react'

function App() {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!ingredients) return;
    setLoading(true);
    setRecipe(""); // Clear the old recipe while loading
    try {
      // This fetches data from your FastAPI (Python) backend
      const response = await fetch(`http://127.0.0.1:8000/recipe?ingredients=${ingredients}`);
      const data = await response.json();
      setRecipe(data.recipe);
    } catch (error) {
      setRecipe("❌ Error: Cannot connect to the Chef's brain. Is your Python terminal running?");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center p-6 text-gray-900 font-sans">
      {/* Header Section */}
      <header className="text-center mt-12 mb-10">
        <h1 className="text-5xl font-black text-orange-600 tracking-tight">AI PANTRY CHEF</h1>
        <p className="text-gray-500 mt-2 text-lg italic font-medium">Turn your fridge leftovers into a master dish.</p>
      </header>

      {/* Input Section */}
      <div className="w-full max-w-md bg-white p-2 rounded-2xl shadow-xl flex border border-orange-100 mb-10">
        <input 
          className="flex-1 p-4 rounded-xl focus:outline-none text-lg bg-transparent text-gray-800"
          placeholder="eggs, cheese, tomato..."
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && askAI()}
        />
        <button 
          onClick={askAI}
          disabled={loading}
          className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-700 active:scale-95 transition-all shadow-md disabled:opacity-50"
        >
          {loading ? "..." : "Cook"}
        </button>
      </div>

      {/* Recipe Result Card */}
      {recipe && (
        <div className="p-8 bg-white shadow-2xl rounded-[2rem] max-w-2xl border-l-8 border-orange-500 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
            <span>👨‍🍳</span> Chef's Recommendation
          </h2>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed text-lg italic">
            {recipe}
          </p>
          <div className="mt-6 pt-4 border-t border-gray-100 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            Powered by HuggingFace AI • Accuracy: High
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="mt-10 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-orange-600 font-bold animate-pulse">Thinking of a recipe...</p>
        </div>
      )}
    </div>
  )
}

export default App;