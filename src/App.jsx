import { useState } from "react";
import Button from "./components/Button.jsx";
import findMutualFollowers from "./components/findMutualFollowers.js";

export default function App() {
  const [username, setUsername] = useState("");

  return (
    <>
      <h1>Instagram Guess Who</h1>
      <h2>the real app</h2>
      <input
        type="text"
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <Button
        onClick={() => {
          findMutualFollowers(username);
        }}
        content="Launch"
      />
    </>
  );
}
