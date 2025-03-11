import { useState } from "react";

function ProfileRow({index, profile, isSelected, toggleSelection}) {
  return (
      <div key={index} className="flex flex-row h-[50px] items-center p-2 bg-blue-500 rounded-md">
        <img
          alt={profile.username}
          src={profile.profile_pic}
          className="rounded-full object-scale-down max-h-full mr-2"
        />
        <span>
          <a
            className={`text-sm text-left text-white hover:text-white hover:underline line-clamp-1`}
            href={`https://instagram.com/${profile.username}`}
            target={"_blank"}
          >
            {profile.username}
          </a>
          <a
              className={`text-sm text-left text-white hover:text-white hover:underline line-clamp-1`}
              href={`https://instagram.com/${profile.username}`}
              target={"_blank"}
          >
            {profile.full_name}
          </a>
        </span>
        <div className="ml-auto relative">
          <input
              type="checkbox"
              className="sr-only peer"
              checked={isSelected}
              onChange={() => toggleSelection(index)}
          />
          <svg
              className={"fill-white absolute top-1/2 transform -translate-y-1/2 right-0 peer-checked:invisible"}
              width="1.25rem" height="1.25rem" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
            <g>
              <path fill="none" d="M0 0h24v24H0z"/>
              <path
                  d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/>
            </g>
          </svg>
          <svg
              className={"fill-white absolute top-1/2 transform -translate-y-1/2 bottom-1/2 right-0 invisible peer-hover:visible peer-hover:opacity-50 peer-checked:visible peer-checked:peer-hover:opacity-100"}
              width="1.25rem" height="1.25rem" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path fill="none" d="M0 0h24v24H0z"/>
              <path
                  d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z"/>
            </g>
          </svg>
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
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:bg-gray-500"
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
