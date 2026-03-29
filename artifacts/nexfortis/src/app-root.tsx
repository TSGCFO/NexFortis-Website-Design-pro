import { createRoot } from "react-dom/client";
import App from "./App";

export function mount(container: HTMLElement) {
  createRoot(container).render(<App />);
}
