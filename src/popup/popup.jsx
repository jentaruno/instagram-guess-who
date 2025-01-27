import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import Button from "../components/Button";
import openIndex from "../components/openIndex";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <h1 className={"text-green-400"}>Instagram Guess Who</h1>
    <Button onClick={openIndex} content="Launch" />
  </StrictMode>
);
