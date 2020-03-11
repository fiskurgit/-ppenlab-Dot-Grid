//https://www.figma.com/plugin-docs/intro/

let dotSize = 1;
let distance = 12;
figma.ui.onmessage = async(params) => {
  console.log("dot grid params: ", params);
  var values = params.split(":");
  dotSize = values[0];
  distance = values[1];
  build();
}
figma.showUI(__html__, {
  width: 270,
  height: 140
});

function build(){
  const node = figma.currentPage.selection[0];
  if(node.type === "RECTANGLE"){
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
    for(var y = size; y < height; y += inc){
      for(var x = size; x < width; x += inc){
        svg += "<circle cx=\"" + x + "\" cy=\"" + y + "\" r=\"" + size + "\" stroke=\"none\" fill=\"black\" />"
      }
    }
    
    svg += "\n</svg>"
    
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
  }else{
    console.log("Selection must be a rectangle");
    //todo - show error
  }
}


