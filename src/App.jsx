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
  const [showModal, setShowModal] = useState(false);
  const [accent, setAccent] = useState(
    ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)]
  );
  const [animating, setAnimating] = useState(false);

  const pickRandomQuote = useCallback((list = quotes) => {
    if (list.length === 0) return;
  
    setAnimating(true);
  
    setTimeout(() => {
      const random = list[Math.floor(Math.random() * list.length)];
      setCurrentQuote(random);
  
      setAccent(
        ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)]
      );
  
      setAnimating(false);
    }, 200);
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
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      setQuotes(data);
  
      if (!currentQuote && data.length > 0) {
        pickRandomQuote(data);
      }
    });
  
    return () => unsubscribe();
  }, [pickRandomQuote, currentQuote]);

  return (
    <div className="app" style={{ "--accent": accent }}>
      <button className="button edit" onClick={() => setShowModal(true)}>
        ✏️
      </button>

      {currentQuote && (
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
      )}

      {showModal && (
        <QuoteModal
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default App;