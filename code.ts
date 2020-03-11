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

function numberOfDots(width: number, height: number, distance: number, dotSize: number): Number{
  const numberHorizontal = width/distance;
  const numberVertical = height/distance;
  return numberHorizontal * numberVertical;
}

function build(){
  const node = figma.currentPage.selection[0];
  
  if(node && node.type == "RECTANGLE"){
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

    const count = numberOfDots(width, height, inc, size);
    console.log("Total grid dots: " + count);
    if(count > 1600){
        showAlert("This will take too long, try increasing the distance, or reduce the rectangle size");
        return;
    }
   
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

    console.log("Node parent type: " + node.parent.type);
    const index = node.parent.children.findIndex(_node => _node.id == node.id);
    node.parent.insertChild(index+1, flat);
    figma.closePlugin();
  }else{
    showAlert("Select a rectangle to generate a dot grid");
  }

  function showAlert(message: String){
    figma.ui.postMessage(message)
  }
}


