import { initializeUi } from "@/content-scripts/ui";

export default defineContentScript({
  matches: ["*://docs.google.com/*"],
  main() {
    initializeUi();
  },
});
