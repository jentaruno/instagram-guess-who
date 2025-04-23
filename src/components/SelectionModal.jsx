import { useState } from "react";

function ProfileRow({index, profile, isSelected, toggleSelection}) {
  return (
      <div key={index} className="flex flex-row h-[50px] items-center p-2 bg-blue-500 rounded-md">
        <img
          alt={profile.username}
          src={profile.profile_pic}
          className="rounded-full object-scale-down max-h-full mr-2"
        />
        <span className="flex flex-col max-w-24">
        <a
            className={`text-sm text-left text-white hover:text-white hover:underline truncate`}
            href={`https://instagram.com/${profile.username}`}
            target={"_blank"}
        >
          {profile.username}
        </a>
        <a
            className={`text-sm text-left text-white hover:text-white hover:underline truncate`}
            href={`https://instagram.com/${profile.username}`}
            target={"_blank"}
        >
          {profile.full_name}
        </a>
      </span>
        <div className="ml-auto relative">
          <label className="flex items-center cursor-pointer relative">
            <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleSelection(index)}
                className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded-full
                hover:bg-white hover:bg-opacity-50
                bg-transparent border-2 border-white checked:bg-white checked:focus:bg-white checked:hover:bg-white
                focus:ring-0 focus:ring-offset-0"
                id="check"
            />
            <span
                className="absolute text-blue-500 opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
            >
              <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
              ></path>
            </svg>
          </span>
          </label>
        </div>
      </div>
  );
}

export function SelectionModal(props) {
  const [selections, setSelections] = useState(
    props.profiles.map((profile) => profile.selected)
  );
  const [valid, setValid] = useState(true);

  // reset selections to default
  function resetSelections() {
    setSelections((prevSelections) =>
      prevSelections.map((_, index) => index < 24)
    );
  }

  function toggleSelection(index) {
    const newSelections = selections.map((selected, i) =>
      i === index ? !selected : selected
    );
    setSelections(newSelections);
    // disable Done button if the new length is over 24
    const newValid = newSelections.filter(Boolean).length <= 24;
    setValid(newValid);
  }
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
          <div className="relative w-5/6 h-5/6 max-w-2xl rounded-lg shadow-xl bg-white flex flex-col">
            {/* Scrollable Content */}
            <div className="flex-grow overflow-auto px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="mb-2 font-semibold" id="modal-title">Select Friends</h3>
                  <div className="w-full grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {selections.map((isSelected, index) => (
                        <ProfileRow
                          index={index}
                          profile={props.profiles[index]}
                          isSelected={isSelected}
                          toggleSelection={toggleSelection}/>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons (Sticky) */}
            <div className="bg-white px-4 py-3 sm:flex sm:flex-row sm:px-6 flex-shrink-0 items-center justify-between">
              <p className={valid ? "" : "text-red-500"}>
                {selections.filter(Boolean).length + "/24 selected"}
              </p>
              <div className={"flex flex-row gap-4"}>
                <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={props.flipModal}
                >
                  Cancel
                </button>
                <button
                    type="reset"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={resetSelections}
                >
                  Reset
                </button>
                <button
                    type="submit"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 sm:ml-3 sm:mt-0 sm:w-auto disabled:bg-gray-500"
                    onClick={() => props.updateProfiles(selections)}
                    disabled={!valid}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
