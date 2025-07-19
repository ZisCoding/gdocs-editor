# Google Docs Text Selector & Replacer Extension (Prototype)

A Chrome extension prototype that demonstrates how to **get selected text** and **replace it** in a Google Docs document — something many developers struggle with when working with Google Docs programmatically.

> ⚠️ This is a proof-of-concept to help developers understand how to interact with Google Docs selections and perform text replacements via extensions.  
> Not production-ready.

## 🚀 What It Does

- Gets the currently selected text in a Google Docs document.
- Replaces the selected text with new content via the extension popup.

This addresses a common issue reported by developers (see [google-docs-utils#10](https://github.com/Amaimersion/google-docs-utils/issues/10)) where there is no straightforward API to programmatically access or replace selected text in Google Docs.

## 🔧 How It Works

The extension uses a `content script` to:

- Access the DOM within the Google Docs iframe.
- Extract the selected text.
- Replace the text using internal structures and simulated inputs.

Due to the complexity and undocumented nature of Google Docs' internals, this solution may break if Google changes their editor structure. Use this as a **learning/demo tool**.

## ⚙️ Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/ZisCoding/gdocs-editor
cd gdocs-editor
npm install
npm run dev
```

This will:

Start a development server with hot reload

Automatically load the extension into Chrome in dev mode

## 🧠 Why This Exists

A number of developers — including those contributing to [`google-docs-utils`](https://github.com/Amaimersion/google-docs-utils) — have found it difficult to **get and manipulate selected text in Google Docs** due to the lack of a public API.

This project is here to:

- Help developers understand how selection works in the Google Docs DOM.
- Provide a working prototype to build from or learn from.

## 🙋‍♂️ Who Is This For?

- Chrome Extension developers
- Anyone trying to manipulate Google Docs programmatically
- Contributors to Google Docs utility libraries

## ⚠️ Limitations

- **Fragile**: Relies on internal structures/classes in Google Docs.


## 💡 Contributions Welcome

If you have ideas for improvements, fixes, or making it more robust — PRs are welcome!

## 📄 License

[MIT License](./LICENSE)

---

Made with ❤️ to help devs struggling with Docs automation.
