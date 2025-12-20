import { useState } from "react";
import { BaseModal } from "./BaseModal.jsx";
import { SelectionProfileCard } from "../SelectionProfileCard.jsx";
import { validate, randomize } from "../selectionUtils.js";

export function SelectionModal(props) {
  const [selections, setSelections] = useState(
    props.profiles.map((profile) => profile.selected)
  );
  const [valid, setValid] = useState(true);

  function randomizeSelections() {
    const newSelections = randomize(selections);
    setSelections(newSelections);
    validateSelections(newSelections);
  }

  function clearSelections() {
    const newSelections = selections.map((_) => false);
    setSelections(newSelections);
    validateSelections(newSelections);
  }

  function toggleSelection(index) {
    const newSelections = selections.map((selected, i) =>
      i === index ? !selected : selected
    );
    setSelections(newSelections);
    validateSelections(newSelections);
  }

  function validateSelections(selectionList) {
    setValid(validate(selectionList));
  }

  return (
    <BaseModal
      title="Select Followers"
      hideModal={props.hideModal}
      size="large"
    >
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
            className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2
                    text-sm font-semibold text-gray-900 shadow-xs bg-gray-200 hover:bg-gray-300
                    border-none hover:border-none sm:mt-0 sm:w-auto
                    transition-all duration-200"
            onClick={randomizeSelections}
          >
            Randomize
          </button>
          <button
            className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2
                    text-sm font-semibold text-gray-900 shadow-xs bg-gray-200 hover:bg-gray-300
                    border-none hover:border-none sm:mt-0 sm:w-auto
                    transition-all duration-200"
            onClick={clearSelections}
          >
            Clear
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
    </BaseModal>
  );
}
