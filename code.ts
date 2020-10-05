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
        (findNode.parent.type);
        switch (findNode.type) {
          case "COMPONENT":
            ("Fzer instancia");
            var instance = findNode.createInstance();
            switch (findNode.parent.type) {
              case "PAGE":
                ("filho da pagina");
                instance.x = 0;
                instance.y = 0;
                destination.appendChild(instance);
                break;
              default:
                ("Não é filho da página");
                instance.x = findNode.x;
                instance.y = findNode.y;
                destination.appendChild(instance);
            }
            break;
          default:
            ("Elemento normal");
            let clone = findNode.clone();
            (clone.parent.type);
            switch (findNode.parent.type) {
              case "PAGE":
                ("Normal filho da pagina");
                clone.x = 0;
                clone.y = 0;
                destination.appendChild(clone);
                break;
              default:
                ("Normal, nao é filho da página");
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
