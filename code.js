//https://www.figma.com/plugin-docs/intro/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*
const numberOfRectangles = 5
const nodes: SceneNode[] = [];
for (let i = 0; i < numberOfRectangles; i++) {
  const rect = figma.createRectangle();
  rect.x = i * 150;
  rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
  figma.currentPage.appendChild(rect);
  nodes.push(rect);
}
figma.currentPage.selection = nodes;
figma.viewport.scrollAndZoomIntoView(nodes);
*/
//figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection);
let dotSize = 1;
let distance = 12;
figma.ui.onmessage = (params) => __awaiter(this, void 0, void 0, function* () {
    console.log("dot grid params: ", params);
    var values = params.split(":");
    dotSize = values[0];
    distance = values[1];
    build();
});
figma.showUI(__html__, {
    width: 270,
    height: 140
});
function build() {
    const node = figma.currentPage.selection[0];
    if (node.type === "RECTANGLE") {
        const xStart = node.x;
        const yStart = node.y;
        const width = node.width;
        const height = node.height;
        let svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"" + width + "\" height=\"" + height + "\" version=\"1.1\">\n";
        console.log("Distance: " + distance);
        console.log("Dot size: " + dotSize);
        console.log("Width: " + width + " Height: " + height);
        const inc = Math.floor(distance);
        const size = Math.floor(dotSize);
        for (var y = size; y < height; y += inc) {
            for (var x = size; x < width; x += inc) {
                svg += "<circle cx=\"" + x + "\" cy=\"" + y + "\" r=\"" + size + "\" stroke=\"none\" fill=\"black\" />";
            }
        }
        svg += "\n</svg>";
        const frameNode = figma.createNodeFromSvg(svg);
        frameNode.x = xStart;
        frameNode.y = yStart;
        let group = figma.group(frameNode.children, figma.currentPage);
        let flat = figma.flatten(group.children, figma.currentPage);
        flat.fills = node.fills;
        node.visible = false;
        frameNode.remove();
        figma.currentPage.appendChild(flat);
        figma.closePlugin();
    }
    else {
        console.log("Selection must be a rectangle");
        //todo - show error
    }
}
