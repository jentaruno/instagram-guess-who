export const DEFAULT_NUM_SELECTIONS = 24;

export function validate(selectionList) {
  const minSelections = Math.min(DEFAULT_NUM_SELECTIONS, selectionList.length);
  const numSelections = selectionList.filter(Boolean).length;
  return (
    numSelections >= minSelections && numSelections <= DEFAULT_NUM_SELECTIONS
  );
}

export function randomize(selections) {
  if (selections.length <= DEFAULT_NUM_SELECTIONS) {
    return selections.map(() => true);
  }

  let selected = new Set([]);
  while (selected.size < DEFAULT_NUM_SELECTIONS) {
    let randomIndex = Math.floor(Math.random() * selections.length);
    selected.add(randomIndex);
  }
  return selections.map((_, index) => selected.has(index));
}
