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
let dotSize = 1;
let distance = 12;
figma.ui.onmessage = (params) => __awaiter(this, void 0, void 0, function* () {
    var values = params.split(":");
    dotSize = Number(values[0]);
    distance = Number(values[1]);
    build((values.length > 2));
});
figma.showUI(__html__, {
    width: 270,
    height: 140
});
function numberOfDots(width, height, distance, dotSize) {
    const numberHorizontal = width / distance;
    const numberVertical = height / distance;
    return numberHorizontal * numberVertical;
}
function build(overrideWarning) {
    const node = figma.currentPage.selection[0];
    if (node && node.type == "RECTANGLE") {
        const xStart = node.x;
        const yStart = node.y;
        const width = node.width;
        const height = node.height;
        console.log("Distance: " + distance);
        console.log("Dot size: " + dotSize);
        console.log("Width: " + width + " Height: " + height);
        const inc = Math.floor(distance);
        const size = Math.floor(dotSize);
        const count = numberOfDots(width, height, inc, size);
        console.log("Total grid dots: " + count + " override: " + overrideWarning);
        if (overrideWarning == false && count > 4000) {
            figma.ui.postMessage(count);
            return;
        }
        const gridParent = figma.createFrame();
        gridParent.x = node.x;
        gridParent.y = node.y;
        gridParent.resize(node.width, node.height);
        for (var y = size; y < height; y += inc) {
            for (var x = size; x < width; x += inc) {
                const ellipse = figma.createEllipse();
                ellipse.x = x;
                ellipse.y = y;
                ellipse.resize(size, size);
                gridParent.appendChild(ellipse);
            }
        }
        let group = figma.group(gridParent.children, figma.currentPage);
        let flat = figma.flatten(group.children, figma.currentPage);
        flat.fills = node.fills;
        node.visible = false;
        gridParent.remove();
        const index = node.parent.children.findIndex(_node => _node.id == node.id);
        node.parent.insertChild(index + 1, flat);
        figma.closePlugin();
    }
    else {
        showAlert("Select a rectangle to generate a dot grid");
    }
    function showAlert(message) {
        figma.ui.postMessage(message);
    }
}
