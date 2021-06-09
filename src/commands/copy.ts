import * as Store from "@/store";

const copy = async (): Promise<void> => {
  const { selection } = figma.currentPage;

  if (selection.length === 0) {
    return figma.closePlugin("Nothing to copy.");
  }

  let frame: FrameNode;
  let frameSelectionIds: string[] = [];
  let pageSelectionIds: string[] = [];

  for (const item of selection) {
    switch (item.parent.type) {
      case "PAGE":
        pageSelectionIds.push(item.id);
        break;
      case "FRAME":
        if (!frame) {
          frame = item.parent;
        }

        if (item.parent.id !== frame.id) {
          return figma.closePlugin(
            "Cannot copy elements from different frames."
          );
        }

        frameSelectionIds.push(item.id);
        break;
      default:
        return figma.closePlugin("The selected elements cannot be grouped.");
    }
  }

  const fixedSelectionIds: string[] =
    frame?.numberOfFixedChildren > 0
      ? frame.children
          .slice(-frame.numberOfFixedChildren)
          .filter(({ id }) => frameSelectionIds.includes(id))
          .map(({ id }) => id)
      : [];

  const orderedIds: {
    scrolls: string[];
    fixed: string[];
  } = {
    scrolls: pageSelectionIds.concat(
      frame?.children
        .filter(
          ({ id }) =>
            frameSelectionIds.includes(id) && !fixedSelectionIds.includes(id)
        )
        .map(({ id }) => id) ?? []
    ),
    fixed: fixedSelectionIds,
  };

  await Store.save(orderedIds);

  figma.closePlugin(`${selection.length} layers copied.`);
};

export default copy;
