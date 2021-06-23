import * as Store from "@/store";

const paste = async (): Promise<void> => {
  const { selection } = figma.currentPage;

  const destinations: FrameNode[] = selection.filter(({ type }) =>
    ["FRAME", "GROUP", "COMPONENT"].includes(type)
  ) as FrameNode[];

  const clipboard = await Store.read<{ scrolls: string[]; fixed: string[] }>();

  if (clipboard === null) {
    return figma.closePlugin(
      "Nothing to be pasted! Make sure you copied something first."
    );
  }

  const nodeIds: { id: string; fixed: boolean }[] = clipboard.scrolls
    .map((id) => ({ id, fixed: false }))
    .concat(clipboard.fixed.map((id) => ({ id, fixed: true })));

  const finalSelection: SceneNode[] = [];

  for (const destination of destinations) {
    const { numberOfFixedChildren } = destination;

    for (const { id: nodeId, fixed } of nodeIds) {
      const node = figma.getNodeById(nodeId) as SceneNode;

      if (!node) {
        return figma.closePlugin(
          "Some layers were deleted, therefore weren't pasted. Don't delete a layer before you paste it."
        );
      }

      let newNode: SceneNode;

      switch (node.type) {
        case "COMPONENT":
          newNode = node.createInstance();

          switch (node.parent.type) {
            case "COMPONENT_SET":
            case "PAGE":
              newNode.x = destination.width / 2 - newNode.width / 2;
              newNode.y = destination.height / 2 - newNode.height / 2;
              break;
            default:
              // Maybe this is unnecessary since components are normally to be pasted in middle.
              newNode.x = node.x;
              newNode.y = node.y;
          }

          break;
        default:
          newNode = node.clone();

          switch (node.parent.type) {
            case "PAGE":
              newNode.x = destination.width / 2 - newNode.width / 2;
              newNode.y = destination.height / 2 - newNode.height / 2;
              break;
            default:
              newNode.x = node.x;
              newNode.y = node.y;
          }
      }

      if (fixed) {
        destination.appendChild(newNode);
        if (destination.numberOfFixedChildren === 0) {
          destination.numberOfFixedChildren = 1;
        }
      } else {
        destination.insertChild(
          destination.children.length - numberOfFixedChildren,
          newNode
        );
      }

      finalSelection.push(newNode);
      figma.currentPage.selection = finalSelection;
    }
  }

  figma.closePlugin(`Layers pasted into ${destinations.length} destinations!`);
};

export default paste;
