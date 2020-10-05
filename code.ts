if (figma.command == "copy") {
  let selection = figma.currentPage.selection;
  figma.root.setPluginData("copy", JSON.stringify(selection));
  figma.closePlugin("Layers copied");
} else if (figma.command == "paste") {
  let selection = figma.currentPage.selection;
  let destinations: Array<any> = selection.filter(
    (item) => item.type == "FRAME" || item.type == "GROUP"
  );
  try {
    var copy = JSON.parse(figma.root.getPluginData("copy"));
  } catch (e) {
    figma.closePlugin();
  }
  for (let destination of destinations) {
    for (let node of copy) {
      let findNode = figma.getNodeById(node.id) as SceneNode;
      if (findNode) {
        if (findNode.type == "COMPONENT") {
          var instance = findNode.createInstance();
          if (instance.parent == figma.currentPage) {
            instance.x = destination.width / 2;
            instance.y = destination.height / 2;
            destination.appendChild(instance);
          } else {
            destination.appendChild(instance);
          }
        } else {
          var clone = findNode.clone();
          if (clone.parent == figma.currentPage) {
            clone.x = destination.width / 2;
            clone.y = destination.height / 2;
            destination.appendChild(clone);
          } else {
            destination.appendChild(clone);
          }
        }
      }else{
        figma.closePlugin("Original layer was deleted. Don't delete a layer before you paste it!")
      }
    }
  }
  figma.closePlugin("Layers pasted!");
} else if (figma.command == "clear") {
  figma.root.setPluginData("copy", "{}");
  figma.closePlugin("Cache cleared");
}
figma.closePlugin();
