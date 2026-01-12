import { useState } from "react";
import { BaseModal } from "./BaseModal.jsx";
import { SelectionProfileCard } from "../SelectionProfileCard.jsx";
import {
  validate,
  randomize,
  DEFAULT_NUM_SELECTIONS,
} from "../selectionUtils.js";

export function SelectionModal(props) {
  const [celebTab, setCelebTab] = useState(false);
  const [selections, setSelections] = useState(
    props.profiles.map((profile) => profile.selected)
  );
  const [valid, setValid] = useState(true);

  const numSelectedFollowers = selections.filter(
    (_, index) => selections[index] && !props.profiles[index].isCeleb
  ).length;

  const numSelectedCelebrities = selections.filter(
    (_, index) => selections[index] && props.profiles[index].isCeleb
  ).length;

  const numToRandomize =
    DEFAULT_NUM_SELECTIONS -
    selections.filter(
      (_, index) =>
        selections[index] &&
        (!props.profiles[index].isCeleb || false) === celebTab
    ).length;

  function randomizeSelections() {
    const newSelections = randomize(selections, numToRandomize, celebTab);
    setSelections(newSelections);
    validateSelections(newSelections);
  }

  function clearSelections() {
    const newSelections = selections.map((_, index) => {
      return (props.profiles[index].isCeleb || false) === celebTab
        ? false
        : selections[index];
    });
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
    <BaseModal title="Select Users" hideModal={props.hideModal} size="large">
      <div className="text-sm font-medium text-center text-body border-b border-neutral-600 mb-4">
        <ul className="flex flex-wrap">
          <li className="me-2">
            <a
              href="#"
              className={`inline-block px-4 py-2 rounded-t-base active cursor-pointer no-underline ${
                celebTab
                  ? "text-neutral-400 hover:text-neutral-400"
                  : "border-b border-white text-white hover:text-white"
              }`}
              onClick={() => setCelebTab(false)}
            >
              Followers ({numSelectedFollowers})
            </a>
          </li>
          <li className="me-2">
            <a
              href="#"
              className={`inline-block px-4 py-2 rounded-t-base active cursor-pointer no-underline ${
                celebTab
                  ? "border-b border-white text-white hover:text-white"
                  : "text-neutral-400 hover:text-neutral-400"
              }`}
              aria-current="page"
              onClick={() => setCelebTab(true)}
            >
              Celebrities ({numSelectedCelebrities})
            </a>
          </li>
        </ul>
      </div>
      {/* Scrollable Content */}
      <div className="flex-grow overflow-auto">
        <div className="sm:flex sm:items-start pr-1">
          <div className="w-full grid sm:grid-cols-2 md:grid-cols-3 gap-2">
            {selections
              .map((isSelected, index) => (
                <SelectionProfileCard
                  key={index}
                  index={index}
                  profile={props.profiles[index]}
                  isSelected={isSelected}
                  toggleSelection={toggleSelection}
                />
              ))
              .filter(
                (_, index) =>
                  (props.profiles[index].isCeleb || false) === celebTab
              )}
          </div>
        </div>
      </div>
      {/* Footer Buttons (Sticky) */}
      <div className="bg-white dark:bg-neutral-800 rounded-b-xl pt-4 pb-1 sm:flex sm:flex-row flex-shrink-0 items-center justify-between">
        <p className={valid ? "" : "text-red-500"}>
          {selections.filter(Boolean).length + "/24 selected"}
        </p>
        <div className={"flex flex-row gap-4"}>
          <button
            className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2
                    text-sm font-semibold text-neutral-900 shadow-xs bg-neutral-200 hover:bg-neutral-300
                    border-none hover:border-none sm:mt-0 sm:w-auto
                    transition-all duration-200"
            onClick={randomizeSelections}
          >
            Randomize ({numToRandomize})
          </button>
          <button
            className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2
                    text-sm font-semibold text-neutral-900 shadow-xs bg-neutral-200 hover:bg-neutral-300
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
                    disabled:bg-neutral-500 transition-all duration-200"
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
