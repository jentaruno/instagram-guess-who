import celebs from "../data/celebs.json";
export const DEFAULT_NUM_SELECTIONS = 24;

const numCelebs = celebs.profiles.length;

export function validate(selectionList) {
  const minSelections = Math.min(DEFAULT_NUM_SELECTIONS, selectionList.length);
  const numSelections = selectionList.filter(Boolean).length;
  return (
    numSelections >= minSelections && numSelections <= DEFAULT_NUM_SELECTIONS
  );
}

export function randomize(
  selections,
  numToRandomize = DEFAULT_NUM_SELECTIONS,
  celeb = undefined
) {
  if (selections.length <= DEFAULT_NUM_SELECTIONS) {
    return selections.map(() => true);
  }
  let selected = new Set([]);
  let startIndex = 0;
  let range = selections.length;
  // adjust range for when randomizing after initial run
  if (celeb !== undefined) {
    if (celeb) {
      range = numCelebs;
      startIndex = selections.length - numCelebs;
    } else {
      range = selections.length - numCelebs;
    }
  }
  while (selected.size < numToRandomize) {
    let randomIndex = startIndex + Math.floor(Math.random() * range);
    selected.add(randomIndex);
  }
  return selections.map((_, index) =>
    index < startIndex || index >= startIndex + range
      ? selections[index]
      : selected.has(index)
  );
}
