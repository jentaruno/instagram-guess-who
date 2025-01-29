import { useState } from "react";

export function SelectionModal(props) {
  const [selections, setSelections] = useState(
    props.profiles.map((profile) => profile.selected)
  );
  const [valid, setValid] = useState(true);

  // when Done, update profiles outside modal
  function updateProfiles() {
    props.setProfiles((prevProfiles) =>
      prevProfiles.map((profile, i) => ({
        ...profile,
        enabled: true,
        selected: selections[i],
      }))
    );
    props.flipModal();
  }

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
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-gray-700 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-base font-semibold text-gray-900"
                    id="modal-title"
                  >
                    Select Friends
                  </h3>
                  {selections.map((isSelected, index) => (
                    // TODO render a mini profile card row nicely
                    <div>
                      <label>
                        {props.profiles[index].username}
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            toggleSelection(index);
                          }}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 sm:ml-3 sm:w-auto"
                onClick={updateProfiles}
                disabled={!valid}
              >
                Done
              </button>
              <button
                type="reset"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={resetSelections}
              >
                Reset
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={props.flipModal}
              >
                Cancel
              </button>
              <p>{selections.filter(Boolean).length + "/24 selected"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
