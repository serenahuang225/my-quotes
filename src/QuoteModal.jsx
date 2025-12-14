import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

function QuoteModal({ onClose, onQuoteAdded }) {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [closing, setClosing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!text.trim()) return;
  
    await addDoc(collection(db, "quotes"), {
      text,
      author,
      createdAt: serverTimestamp(),
      likes: 0,
      tags: []
    });
  
    // refresh quotes
    onQuoteAdded?.();
    closeModal();
  };

  // actually call onClose after animation
  useEffect(() => {
    if (!closing) return;

    setTimeout(() => {
      onClose?.(); // unmount parent
    }, 250); // match CSS transition

    // return () => clearTimeout(timer); // clean up in case modal unmounts early
  }, [closing, onClose]);

  const closeModal = () => {
    if (closing) return; // prevent double triggers
    setClosing(true);
  };

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // trigger fade-in after mount
    setTimeout(() => setVisible(true), 10);
    // return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`modal-overlay ${visible && !closing ? "fade-in" : ""} ${closing ? "fade-out" : ""}`}
      onClick={closeModal}
    >
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Add Quote</h2>

          <button className="button heart"
            type="button" onClick={closeModal}>
          ✖️
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <textarea className="input"
            placeholder="Quote text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input className="input"
            placeholder="Author (optional)"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <button className="button heart" type="submit">Save</button>
          <button className="button heart" type="button" onClick={closeModal}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default QuoteModal;