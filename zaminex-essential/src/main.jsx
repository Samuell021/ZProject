import { applyAppearance, readAppearance } from "./services/appearance";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";
class Boundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    return this.state.error ? (
      <main className="panel">
        <h1>خطا در نمایش صفحه</h1>
        <p>{this.state.error.message}</p>
        <a href="/">بازگشت به داشبورد</a>
      </main>
    ) : (
      this.props.children
    );
  }
}
applyAppearance(readAppearance());
createRoot(document.getElementById("root")).render(
  <Boundary>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Boundary>,
);
