import { useEffect, useState, useCallback } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db, initAuth } from "./firebase";
import QuoteModal from "./QuoteModal";
import { doc, updateDoc, increment } from "firebase/firestore";
import "./App.css";

const ACCENT_COLORS = ["#eb6cc2", "#530494", "#64dbed", "#25ad1c"];

function App() {
  const [quotes, setQuotes] = useState([]);
  const [currentQuote, setCurrentQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [accent, setAccent] = useState(
    ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)]
  );
  const [animating, setAnimating] = useState(false);

  const pickRandomQuote = useCallback((list = quotes, animate = true) => {
    if (list.length === 0) return;
  
    if (animate) setAnimating(true);
  
    const delay = animate ? 200 : 0;
  
    setTimeout(() => {
      const random = list[Math.floor(Math.random() * list.length)];
      setCurrentQuote(random);
  
      setAccent(
        ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)]
      );
  
      if (animate) setAnimating(false);
    }, delay);
  }, [quotes]);
  

  const likeQuote = async () => {
    if (!currentQuote) return;

    const ref = doc(db, "quotes", currentQuote.id);
    await updateDoc(ref, {
      likes: increment(1)
    });
  };

  useEffect(() => {
    const handleKey = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea") return; // ignore typing inside inputs

      if (e.code === "Space") {
        e.preventDefault();
        pickRandomQuote();
      }
    };
  
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [pickRandomQuote]);

  useEffect(() => {
    initAuth();
  
    const unsubscribe = onSnapshot(collection(db, "quotes"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuotes(data);

      if (data.length > 0 && !currentQuote) {
        pickRandomQuote(data, false);
      }

      setLoading(false); // mark quotes as loaded
    });
  
    return () => unsubscribe();
  }, [pickRandomQuote, currentQuote]);

  return (
    <div className="app" style={{ "--accent": accent }}>
      {
        loading ? (
          <div className="loading">loading...</div>
        ) : (
          currentQuote && (
            <div className={`quote-card ${animating ? "exit" : "enter"}`}>
              <p className="quote-text">
                “{currentQuote.text}”
              </p>
    
              <p className="quote-author">
                — {currentQuote.author || "Unknown"}
              </p>
    
              <div className="actions">
                <button className="button heart" onClick={likeQuote}>
                  ❤️ {currentQuote.likes ?? 0}
                </button>
    
                <button
                  className="button refresh"
                  onClick={() => pickRandomQuote()}
                  title="New quote (space)"
                >
                  🔄
                </button>
              </div>
            </div>
          )
        )
      }

      <button className="button edit" onClick={() => setShowModal(true)}>
        ✏️
      </button>

      {showModal && (
        <QuoteModal
        //  key={Date.now()} 
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default App;