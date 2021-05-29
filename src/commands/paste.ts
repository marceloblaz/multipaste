import * as Store from "@/store";

const paste = async (): Promise<void> => {
  const { selection } = figma.currentPage;

  const destinations = selection.filter((item) =>
    ["FRAME", "GROUP", "COMPONENT"].includes(item.type)
  ) as any[];

  const nodeIds = await Store.read<string[]>();

  if (nodeIds === null) {
    return figma.closePlugin(
      "Nothing to be pasted! Make sure you copied something first."
    );
  }

  const finalSelection: SceneNode[] = [];

  for (const destination of destinations) {
    for (const nodeId of nodeIds) {
      const node = figma.getNodeById(nodeId) as SceneNode;

      if (!node) {
        return figma.closePlugin(
          "Some layers were deleted, therefore weren't pasted. Don't delete a layer before you paste it."
        );
      }

      switch (node.type) {
        case "COMPONENT":
          const instance = node.createInstance();

          switch (node.parent.type) {
            case "COMPONENT_SET":
            case "PAGE":
              instance.x = destination.width / 2 - instance.width / 2;
              instance.y = destination.height / 2 - instance.height / 2;
              break;
            default:
              // Maybe this is unnecessary since components are normally to be pasted in middle.
              instance.x = node.x;
              instance.y = node.y;
          }

          destination.appendChild(instance);
          finalSelection.push(instance);
          break;
        default:
          const clone = node.clone();

          switch (node.parent.type) {
            case "PAGE":
              clone.x = destination.width / 2 - clone.width / 2;
              clone.y = destination.height / 2 - clone.height / 2;
              break;
            default:
              clone.x = node.x;
              clone.y = node.y;
          }

          destination.appendChild(clone);
          finalSelection.push(clone);
      }

      figma.currentPage.selection = finalSelection;
    }
  }

  figma.closePlugin(
    "Layers pasted into " + destinations.length + " destinations!"
  );
};

export default paste;
