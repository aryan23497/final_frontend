// src/modules/AIRecommendationModule.js
import React, { useRef, useState } from "react";
import "./AIRecommendationModule.css";

const INITIAL_ASSISTANT_MSG = {
  id: "a-1",
  role: "assistant",
  text:
    "Hi, I’m the OASIS recommendation assistant. Tell me your scientific goal " +
    "(domain, region, time window, variables), and I’ll recommend datasets and workflows.",
};

const AIRecommendationModule = () => {
  const [messages, setMessages] = useState([INITIAL_ASSISTANT_MSG]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsSending(true);

    // MOCK AI RESPONSE (backend → POST /chat later)
    setTimeout(() => {
      const mockAssistant = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text:
          "Here is a compact AI-generated plan:\n\n" +
          "• Use recent cruise CTD + nutrient transects.\n" +
          "• Add weekly satellite SST & chlorophyll grids.\n" +
          "• Overlay fisheries CPUE time series.\n\n" +
          "You can now open these datasets in the visualization module.",
      };

      setMessages((prev) => [...prev, mockAssistant]);
      setIsSending(false);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleUploadDataset = () => {
    alert("Upload Dataset → POST /upload (prototype)");
  };

  const handleRebuildMemory = () => {
    alert("Rebuild Memory → POST /ingest and POST /embed (prototype)");
  };

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text);
  };

  const handleEdit = (text) => {
    setInput(text);
    textareaRef.current?.focus();
  };

  return (
    <div className="harbor-layout">

      {/* HEADER */}
      <header className="harbor-header">
        <div>
          <h2 className="harbor-title">Harbor · Research Chat</h2>
          <p className="harbor-subtitle">
            Ask scientific questions and receive AI-powered dataset and workflow recommendations.
          </p>
        </div>

        <div className="harbor-header-actions">
          <button className="btn harbor-btn-secondary" onClick={handleUploadDataset}>
            Upload Dataset
          </button>
          <button className="btn harbor-btn-primary" onClick={handleRebuildMemory}>
            Rebuild Memory
          </button>
        </div>
      </header>

      {/* FULL PAGE CHAT PANEL */}
      <section className="harbor-panel harbor-chat-panel-full">

        <div className="harbor-chat-window">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`harbor-bubble-row harbor-bubble-row-${msg.role}`}
            >
              <div className={`harbor-bubble harbor-bubble-${msg.role}`}>
                <span className="harbor-bubble-author">
                  {msg.role === "user" ? "Scientist" : "Harbor · OASIS AI"}
                </span>

                <p className="harbor-bubble-text">
                  {msg.text.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>

                {/* COPY / EDIT CONTROLS */}
                <div className="harbor-bubble-footer">
                  <div className="harbor-bubble-actions">
                    <button
                      className="harbor-icon-btn"
                      onClick={() => handleCopy(msg.text)}
                    >
                      Copy
                    </button>
                    <button
                      className="harbor-icon-btn"
                      onClick={() => handleEdit(msg.text)}
                    >
                      Edit
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* INPUT BAR */}
        <div className="harbor-input-bar">
          <textarea
            ref={textareaRef}
            className="harbor-input"
            placeholder="Describe your scientific analysis..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
          />
          <button
            className="btn harbor-send-btn"
            onClick={handleSend}
            disabled={isSending}
          >
            {isSending ? "Thinking…" : "Send"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default AIRecommendationModule;
