import * as Store from "@/store";

const copy = async (): Promise<void> => {
  const { selection } = figma.currentPage;

  if (selection.length === 0) {
    return figma.closePlugin("Nothing to copy.");
  }

  const selectedIds = selection.map((item) => item.id);

  const { parent } = selection[0];

  const orderedIds: string[] = parent.children.reduce(
    (ids, node) => (selectedIds.includes(node.id) ? [...ids, node.id] : ids),
    []
  );

  await Store.save(orderedIds);

  figma.closePlugin(`${orderedIds.length} layers copied.`);
};

export default copy;
