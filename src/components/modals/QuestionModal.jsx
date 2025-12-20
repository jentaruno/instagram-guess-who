import { useState } from "react";
import { BaseModal } from "./BaseModal.jsx";
import questions from "../../data/questions.json";

export function QuestionModal({ hideModal }) {
  const getRandom = (arr, exclude) => {
    let q;
    do {
      q = arr[Math.floor(Math.random() * arr.length)];
    } while (q === exclude);
    return q;
  };

  const rollQuestion = () =>
    setRandomQuestion((prev) => getRandom(questions, prev));

  const [randomQuestion, setRandomQuestion] = useState(() =>
    getRandom(questions.Basic)
  );

  return (
    <BaseModal title="Random Question Generator" hideModal={hideModal}>
      <div className="flex flex-col items-center space-y-4 mt-2 mb-6 pr-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="128"
          height="128"
          fill="currentColor"
          className="bi bi-dice-3"
          viewBox="0 0 16 16"
        >
          <path d="M13 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zM3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3z" />
          <path d="M5.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m8 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-4-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
        </svg>
        <p className={"text-lg"}>{randomQuestion}</p>
        <div className="flex flex-col md:flex-row gap-2 items-center">
          {Object.entries(questions).map(([category, qs]) => (
            <button
              key={category}
              type="button"
              onClick={() => setRandomQuestion(getRandom(qs, randomQuestion))}
              className="inline-flex justify-center rounded-md px-3 py-2
                text-sm font-semibold text-gray-900 shadow-xs bg-gray-200 hover:bg-gray-300
                border-none hover:border-none
                transition-all duration-200"
            >
              <span className="text-lg font-medium">{category}</span>
            </button>
          ))}
        </div>
      </div>
    </BaseModal>
  );
}
