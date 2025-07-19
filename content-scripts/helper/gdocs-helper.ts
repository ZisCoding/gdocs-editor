const docsEditorContainer = ["#docs-editor-container"];
const docsEditor = ["#docs-editor", ...docsEditorContainer];
const kixCursor = [".kix-cursor"];
const kixCursorCaret = [".kix-cursor-caret"];
interface SelectedTextItem {
  text: string;
  x: number;
  y: number;
}
function getGDocsSelectedText(): string {
  try {
    const selectionContainer: HTMLElement | null = document.querySelector(
      ".kix-canvas-tile-content.kix-canvas-tile-selection"
    );
    if (!selectionContainer) return "";
    const selectionRects: SVGRectElement[] = Array.from(
      selectionContainer.querySelectorAll("rect[fill]:not([aria-label])")
    ) as SVGRectElement[];
    if (selectionRects.length === 0) return "";
    const allTextRects: NodeListOf<SVGRectElement> = document.querySelectorAll(
      "rect[aria-label]"
    ) as NodeListOf<SVGRectElement>;
    const selectedTexts: SelectedTextItem[] = [];
    selectionRects.forEach((selectionRect: SVGRectElement) => {
      const transform: string | null = selectionRect.getAttribute("transform");
      if (!transform) return;
      allTextRects.forEach((textRect: SVGRectElement) => {
        if (textRect.getAttribute("transform") === transform) {
          const text: string | null = textRect.getAttribute("aria-label");
          if (
            text &&
            !selectedTexts.some((item: SelectedTextItem) => item.text === text)
          ) {
            let offsetY: number = 0;
            const matrixMatch: RegExpMatchArray | null = transform.match(
              /matrix\([^,]+,[^,]+,[^,]+,[^,]+,[^,]+,([^)]+)\)/
            );
            if (matrixMatch) {
              offsetY = parseFloat(matrixMatch[1]);
            }
            selectedTexts.push({
              text,
              y: parseFloat(textRect.getAttribute("y") || "0") + offsetY,
              x: parseFloat(textRect.getAttribute("x") || "0"),
            });
          }
        }
      });
    });
    if (selectedTexts.length === 0) return "";
    // Sort by position (top to bottom, left to right)
    selectedTexts.sort((a: SelectedTextItem, b: SelectedTextItem): number => {
      if (Math.abs(a.y - b.y) > 5) {
        return a.y - b.y;
      }
      return a.x - b.x;
    });
    // Group by lines based on Y position
    const lines: SelectedTextItem[][] = [];
    let currentLine: SelectedTextItem[] = [];
    let currentY: number | null = null;
    selectedTexts.forEach((item: SelectedTextItem) => {
      if (currentY === null || Math.abs(item.y - currentY) > 5) {
        if (currentLine.length > 0) {
          lines.push(currentLine);
        }
        currentLine = [item];
        currentY = item.y;
      } else {
        currentLine.push(item);
      }
    });
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
    // Join text with proper line breaks
    return lines
      .map((line: SelectedTextItem[]) =>
        line.map((item: SelectedTextItem) => item.text).join(" ")
      )
      .join("\n");
  } catch (error: unknown) {
    return "";
  }
}
function querySelector(selectors: any, root = document) {
  if (root == null) {
    throw new Error("Passed root element does not exists");
  }
  let value = null;
  for (const selector of selectors) {
    value = root.querySelector(selector);
    if (value) {
      break;
    }
  }
  return value;
}
function getEditorElement() {
  return querySelector(docsEditor);
}
function getCursorElement() {
  const editor = getEditorElement();
  return querySelector(kixCursor, editor);
}
function getCaretElement() {
  const activeCursor = getCursorElement();
  if (!activeCursor) {
    return null;
  }
  return querySelector(kixCursorCaret, activeCursor);
}
function getGoogleDocsEventTarget() {
  let frame: any = document?.querySelector(".docs-texteventtarget-iframe");
  return frame?.contentDocument;
}
// Insert text at current cursor position
function insertText(text: string) {
  // Split text into paragraphs
  const paragraphs = text.split("\n");
  const eventTarget = getGoogleDocsEventTarget();
  // Process each paragraph
  for (let p = 0; p < paragraphs.length; p++) {
    const paragraph = paragraphs[p];
    // Insert each character of the paragraph
    for (let i = 0; i < paragraph.length; i++) {
      const char = paragraph[i];
      const isLetter = /[a-zA-Z]/.test(char);
      // Check if the character is uppercase and is a letter
      const isUppercaseLetter = isLetter && char === char.toUpperCase();
      const keyEvent = new KeyboardEvent("keypress", {
        bubbles: true,
        cancelable: true,
        key: char,
        keyCode: char.charCodeAt(0),
        charCode: char.charCodeAt(0),
        which: char.charCodeAt(0),
        code: char.match(/[a-zA-Z]/) ? "Key" + char.toUpperCase() : undefined,
        ctrlKey: false,
        shiftKey: isUppercaseLetter,
        altKey: false,
        metaKey: false,
      });
      eventTarget.dispatchEvent(keyEvent);
    }
    // Add a newline after each paragraph (except the last one)
    if (p < paragraphs.length - 1) {
      const enterEvent = new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
      });
      eventTarget.dispatchEvent(enterEvent);
    }
  }
  const enterEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    key: "Enter",
    code: "Enter",
    keyCode: 13,
    which: 13,
  });
  eventTarget.dispatchEvent(enterEvent);
}
// Navigate through document (e.g., move cursor left)
function moveCursorLeft(steps = 1) {
  const eventTarget = getGoogleDocsEventTarget();
  const eventObj = {
    bubbles: true,
    cancelable: true,
    key: "ArrowLeft",
    code: "ArrowLeft",
    keyCode: 37,
    ctrlKey: false,
    shiftKey: false,
  };
  for (let i = 0; i < steps; i++) {
    eventTarget.dispatchEvent(new KeyboardEvent("keydown", eventObj));
  }
}
// Delete characters (backspace)
function deleteCharacters(count = 1) {
  const eventTarget = getGoogleDocsEventTarget();
  const eventObj = {
    bubbles: true,
    cancelable: true,
    key: "Backspace",
    code: "Backspace",
    keyCode: 8,
    ctrlKey: false,
    shiftKey: false,
  };
  for (let i = 0; i < count; i++) {
    eventTarget.dispatchEvent(new KeyboardEvent("keydown", eventObj));
  }
}
// Replace selected text with new text
function replaceSelectedText(newText: string) {
  // First, delete the selected text with Delete key
  const eventTarget = getGoogleDocsEventTarget();
  const deleteEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    key: "Delete",
    code: "Delete",
    keyCode: 46,
    ctrlKey: false,
    shiftKey: false,
  });
  eventTarget.dispatchEvent(deleteEvent);
  // Then insert the new text
  insertText(newText);
}
const gdocsHelper = {
  replaceSelectedText,
  insertText,
  moveCursorLeft,
  deleteCharacters,
  getCaretElement,
  getGDocsSelectedText,
};
export default gdocsHelper;
