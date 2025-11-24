export function HelpModal({ hideModal }) {
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
          className="relative w-5/6 h-5/6 max-w-2xl rounded-xl shadow-xl bg-white dark:bg-gray-800 flex flex-col
          px-4 py-6 sm:p-6 sm:pb-4"
        >
          <div className="flex flex-row w-full justify-between items-center mb-4">
            <h3 className="font-semibold">
                How to Play
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
          <p className="mb-3 text-md">Instagram Guess Who is a two-player game where each player tries to guess the other player's chosen Instagram user from a shared pool of mutual followers.</p>
          <ol className="text-md list-decimal ml-6">
              <li>If you want to choose a different set of mutual followers, click Select Users and choose the followers you want on the board.</li>
              <li>Each player secretly chooses a person on the board.</li>
              <li>Take turns asking yes/no questions to deduce who the other person chose.
                  As you do this, you can click on a follower's card to disable it and take it off the possible choices.</li>
              <li>If you think you know who the other player chose, make a guess! Note that this counts as a turn. The first player to guess correctly wins.</li>
              <li>Click Reset All to reset the board if you want to play a new game.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
