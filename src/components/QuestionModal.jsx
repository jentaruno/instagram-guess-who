import { useState } from "react";
import questions from "../data/questions.json";

export function QuestionModal({ hideModal }) {
  const getRandom = (arr, exclude) => {
    let q;
    do {
      q = arr[Math.floor(Math.random() * arr.length)];
    } while (q === exclude);
    return q;
  };

  const rollQuestion = () => setRandomQuestion((prev) => getRandom(questions, prev));

  const [randomQuestion, setRandomQuestion] = useState(() => getRandom(questions));

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-500/75 transition-opacity"
        aria-hidden="true"
      ></div>
      <div className="fixed inset-0 z-10 flex items-center justify-center">
        <div
          className="relative w-5/6 max-w-2xl rounded-xl shadow-xl bg-white dark:bg-gray-800 flex flex-col
          px-4 py-6 sm:p-6 sm:pb-4"
        >
          <div className="flex flex-row w-full justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
                Random Question Generator
            </h3>
            <button
                className={"p-0 border-none focus:outline-none bg-transparent"}
                onClick={hideModal}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                </svg>
            </button>
          </div>
          <div className="flex flex-col items-center space-y-4 mt-2 mb-6 pr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" fill="currentColor" className="bi bi-dice-3" viewBox="0 0 16 16">
                <path d="M13 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zM3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3z"/>
                <path d="M5.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m8 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-4-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
            </svg>
            <p className={"text-lg"}>{randomQuestion}</p>
            <button
              type="button"
              onClick={rollQuestion}
              className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2
                text-sm font-semibold text-gray-900 shadow-xs bg-gray-200 hover:bg-gray-300
                border-none hover:border-none sm:mt-0 sm:w-auto
                transition-all duration-200"
            >
              <span className="text-lg font-medium">New Question</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
