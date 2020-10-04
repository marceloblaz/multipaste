if (figma.command == "copy") {
    let selection = figma.currentPage.selection;
    figma.root.setPluginData("copy", JSON.stringify(selection));
    figma.closePlugin("Layers copied");
}
else if (figma.command == "paste") {
    let selection = figma.currentPage.selection;
    let destinations = selection.filter((item) => item.type == "FRAME" || item.type == "GROUP");
    try {
        var copy = JSON.parse(figma.root.getPluginData("copy"));
    }
    catch (e) {
        figma.closePlugin();
    }
    console.log(copy);
    console.log(destinations);
    for (let destination of destinations) {
        for (let node of copy) {
            let findNode = figma.getNodeById(node.id);
            var clone = findNode.clone();
            destination.appendChild(clone);
        }
    }
    figma.closePlugin("Layers pasted!");
}
else if (figma.command == "clear") {
    figma.root.setPluginData('copy', '{}');
    figma.closePlugin("Cache cleared");
}
figma.closePlugin();
