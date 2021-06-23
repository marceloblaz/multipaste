import * as Store from "@/store";

const getChildrenDeep = (frame): SceneNode[] =>
  frame.children.flatMap((node) =>
    node.children ? [node, ...getChildrenDeep(node)] : node
  );

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
        frameSelectionIds.push(item.id);
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
      (frame &&
        getChildrenDeep(frame)
          .filter(
            ({ id }) =>
              frameSelectionIds.includes(id) && !fixedSelectionIds.includes(id)
          )
          .map(({ id }) => id)) ??
        []
    ),
    fixed: fixedSelectionIds,
  };

  await Store.save(orderedIds);

  figma.closePlugin(`${selection.length} layers copied.`);
};

export default copy;
