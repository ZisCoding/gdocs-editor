export default defineContentScript({
  matches: ["*://docs.google.com/*"],
  runAt: "document_start",
  world: "MAIN",
  main() {
    // This line of code helps to annotate google docs without this the extension won't work
    (window as any)._docs_annotate_canvas_by_ext =
      "ogmnaimimemjmbakcfefmnahgdfhfami"; // This is id of an alreadyt whitelisted extension by google
  },
});
