import { useEffect, useState } from "react";
import gdocsHelper from "../helper/gdocs-helper";


export default function App() {
  const [selectedText, setSelectedText] = useState<string>("");
  const [replacementText, setReplacementText] = useState<string>("");

  const handleSelection = () => {
    const container = document.querySelector(
      "#gdocs-editor-root"
    ) as HTMLDivElement;

    if (!container) return;

    const text = gdocsHelper.getGDocsSelectedText();

    if (!text) {
      container.style.display = "none";
      setSelectedText("");
      return;
    }

    setSelectedText(text);

    const caretElement = gdocsHelper.getCaretElement();

    const rect = caretElement.getBoundingClientRect();

    container.style.left = `${rect.left + window.scrollX}px`;
    container.style.top = `${rect.top + window.scrollY}px`;
    container.style.display = "block";
  };

  const handleReplaceText = () => {
    const container = document.querySelector(
      "#gdocs-editor-root"
    ) as HTMLDivElement;
    if (replacementText.trim()) {
      gdocsHelper.replaceSelectedText(replacementText);
      setReplacementText("");
      setSelectedText("");
      if (container) container.style.display = "none";
    }
  };

  const handleClear = () => {
    setReplacementText("");
  };

  useEffect(() => {
    const handleMouseUp = (event: MouseEvent) => {
      handleSelection();
    };

    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div
      className="text-replacer-container"
      style={
        {
          "--selected-color": selectedText ? "#374151" : "#9ca3af",
          "--selected-style": selectedText ? "normal" : "italic",
          "--status-color": selectedText ? "#10b981" : "#f59e0b",
        } as any
      }
    >
      <div className="header">
        <div className="header-icon">T</div>
        <h3 className="header-title">Text Replacer</h3>
        <div className="status-indicator"></div>
      </div>

      <div className="section">
        <div className="section-label">Selected Text</div>
        <div className="selected-text-display">
          {selectedText || "Select text in the document to get started..."}
        </div>
      </div>

      <div className="section">
        <div className="section-label">Replacement Text</div>
        <div className="input-container">
          <textarea
            className="text-input"
            placeholder="Enter your replacement text here..."
            value={replacementText}
            onChange={(e) => setReplacementText(e.target.value)}
            maxLength={500}
          />
          <div className="char-count">
            {replacementText.length}/500 characters
          </div>
        </div>
      </div>

      <div className="button-group">
        <button
          className="button button-secondary"
          onClick={handleClear}
          disabled={!replacementText}
        >
          Clear
        </button>
        <button
          className="button button-primary"
          onClick={handleReplaceText}
          disabled={!selectedText || !replacementText.trim()}
        >
          Replace Text
        </button>
      </div>
    </div>
  );
}
