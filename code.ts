//codeinit
if (figma.command == "copy") {
  let selection = figma.currentPage.selection;
  let ids = selection.map((item) => {
    return item.id;
  });
  figma.root.setPluginData("copy", JSON.stringify(ids));
  figma.closePlugin("Layers copied");
} else if (figma.command == "paste") {
  let selection = figma.currentPage.selection;
  let destinations: Array<any> = selection.filter(
    (item) => item.type == "FRAME" || "GROUP" || "COMPONENT"
  );
  try {
    var copy = JSON.parse(figma.root.getPluginData("copy"));
  } catch (e) {
    figma.closePlugin();
  }
  var finalSelection: SceneNode[] = [];
  for (let destination of destinations) {
    for (let node of copy) {
      let findNode = figma.getNodeById(node) as SceneNode;
      if (findNode) {
        switch (findNode.type) {
          case "COMPONENT":
            var instance = findNode.createInstance();
            switch (findNode.parent.type) {
              case "COMPONENT_SET":
              case "PAGE":
                instance.x = destination.width / 2 - instance.width / 2;
                instance.y = destination.height / 2 - instance.height / 2;
                destination.appendChild(instance);
                finalSelection.push(instance);
                break;
              default:
                instance.x = findNode.x;
                instance.y = findNode.y;
                destination.appendChild(instance);
                finalSelection.push(instance);
              //maybe this is unnecessary since components are normally to be pasted in middle
            }
            break;
          default:
            let clone = findNode.clone();
            switch (findNode.parent.type) {
              case "PAGE":
                clone.x = destination.width / 2 - clone.width / 2;
                clone.y = destination.height / 2 - clone.height / 2;
                destination.appendChild(clone);
                finalSelection.push(clone);
                break;
              default:
                clone.x = findNode.x;
                clone.y = findNode.y;
                destination.appendChild(clone);
                finalSelection.push(clone);
            }
        }
        console.log(finalSelection);
        figma.currentPage.selection = finalSelection;
      } else {
        figma.closePlugin(
          "Some layers were deleted, therefore wasn't pasted. Don't delete a layer before you paste it."
        );
      }
    }
  }
  figma.closePlugin("Layers pasted!");
} else if (figma.command == "clear") {
  figma.root.setPluginData("copy", "{}");
  figma.closePlugin("Cache cleared");
}
figma.closePlugin();
