import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

function QuoteModal({ onClose, onQuoteAdded }) {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    await addDoc(collection(db, "quotes"), {
      text,
      author,
      createdAt: serverTimestamp(),
      likes: 0,
      tags: [] // reserved for later
    });

    onQuoteAdded();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Add Quote</h2>

          <button className="button heart"
            type="button" onClick={onClose}>
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
          <button className="button heart" type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default QuoteModal;