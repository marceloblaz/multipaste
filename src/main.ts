enum Command {
  COPY = "copy",
  PASTE = "paste",
  CLEAR_CLIPBOARD = "clear",
}

enum Store {
  NODE_CLIPBOARD = "node_clipboard",
}

const read = async <T = any>(key: Store): Promise<T> => {
  const value: string = await figma.clientStorage.getAsync(key);

  return JSON.parse(value);
};

const save = async (key: Store, value: any): Promise<void> =>
  figma.clientStorage.setAsync(key, JSON.stringify(value));

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

  await save(Store.NODE_CLIPBOARD, orderedIds);

  figma.closePlugin(`${orderedIds.length} layers copied.`);
};

const paste = async (): Promise<void> => {
  const { selection } = figma.currentPage;

  const destinations = selection.filter((item) =>
    ["FRAME", "GROUP", "COMPONENT"].includes(item.type)
  ) as any[];

  const nodeIds = await read<string[]>(Store.NODE_CLIPBOARD);

  if (nodeIds === null || nodeIds.length === 0) {
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

const clear = async (): Promise<void> => {
  await save(Store.NODE_CLIPBOARD, null);
  figma.closePlugin("Clipboard cleared!");
};

switch (figma.command) {
  case Command.COPY:
    copy();
    break;
  case Command.PASTE:
    paste();
    break;
  case Command.CLEAR_CLIPBOARD:
    clear();
    break;
}
