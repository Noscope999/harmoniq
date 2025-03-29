import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeCapacitor, setupBackButtonHandler } from "./lib/capacitor";

// Initialize Capacitor functionalities
document.addEventListener('DOMContentLoaded', () => {
  initializeCapacitor();
  setupBackButtonHandler();
});

createRoot(document.getElementById("root")!).render(<App />);
