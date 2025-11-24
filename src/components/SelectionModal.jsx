import { useState } from "react";
import { SelectionProfileCard } from "./SelectionProfileCard.jsx";

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
        <div
          className="relative w-5/6 h-5/6 max-w-2xl rounded-xl shadow-xl bg-white dark:bg-gray-800 flex flex-col
          px-4 py-6 sm:p-6 sm:pb-4"
        >
          <h3 className="mb-3 font-semibold" id="modal-title">
            Select Friends
          </h3>
          {/* Scrollable Content */}
          <div className="flex-grow overflow-auto">
            <div className="sm:flex sm:items-start pr-1">
              <div className="w-full grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                {selections.map((isSelected, index) => (
                  <SelectionProfileCard
                    index={index}
                    profile={props.profiles[index]}
                    isSelected={isSelected}
                    toggleSelection={toggleSelection}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Footer Buttons (Sticky) */}
          <div className="bg-white dark:bg-gray-800 rounded-b-xl pt-3 pb-1 sm:flex sm:flex-row flex-shrink-0 items-center justify-between">
            <p className={valid ? "" : "text-red-500"}>
              {selections.filter(Boolean).length + "/24 selected"}
            </p>
            <div className={"flex flex-row gap-4"}>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2
                    text-sm font-semibold text-gray-900 shadow-xs bg-gray-200 hover:bg-gray-300
                    border-none hover:border-none sm:mt-0 sm:w-auto
                    transition-all duration-200"
                onClick={props.hideModal}
              >
                Cancel
              </button>
              <button
                type="reset"
                className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2
                    text-sm font-semibold text-gray-900 shadow-xs bg-gray-200 hover:bg-gray-300
                    border-none hover:border-none sm:mt-0 sm:w-auto
                    transition-all duration-200"
                onClick={resetSelections}
              >
                Reset
              </button>
              <button
                type="submit"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-500 dark:bg-blue-600 hover:opacity-90 px-3 py-2
                    text-sm font-semibold text-white shadow-xs sm:mt-0 sm:w-auto hover:border-none border-none
                    disabled:bg-gray-500 transition-all duration-200"
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
