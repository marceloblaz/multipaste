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
        console.log(findNode.parent.type);
        findNode.parent.type;
        switch (findNode.type) {
          case "COMPONENT":
            var instance = findNode.createInstance();
            switch (findNode.parent.type) {
              case "PAGE":
                instance.x = (destination.width/2)-(instance.width/2);
                instance.y = (destination.height/2)-(instance.height/2);
                destination.appendChild(instance);
                break;
              default:
                instance.x = findNode.x;
                instance.y = findNode.y;
                destination.appendChild(instance);
            }
            break;
          default:
            let clone = findNode.clone();
            switch (findNode.parent.type) {
              case "PAGE":
                clone.x = (destination.width/2)-(clone.width/2);
                clone.y = (destination.height/2)-(clone.height/2);
                destination.appendChild(clone);
                break;
              default:
                clone.x = findNode.x;
                clone.y = findNode.y;
                destination.appendChild(clone);
            }
        }
      } else {
        figma.closePlugin(
          "Some layer was deleted, therefore wasn't pasted. Don't delete a layer before you paste it."
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
