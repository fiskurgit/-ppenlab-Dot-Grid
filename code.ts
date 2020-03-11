//https://www.figma.com/plugin-docs/intro/

let dotSize = 1;
let distance = 12;
let override = false;
figma.ui.onmessage = async(params) => {
  console.log("dot grid params: ", params);
  var values = params.split(":") as Array<string>;
  dotSize = Number(values[0]);
  distance = Number(values[1]);
  console.log("Values size: " + values.length);
  if(values.length > 2) {
    override = true;
  }
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
    
    console.log("Distance: " + distance);
    console.log("Dot size: " + dotSize);
    console.log("Width: " + width + " Height: " + height);
    const inc = Math.floor(distance);
    const size = Math.floor(dotSize);

    const count = numberOfDots(width, height, inc, size);
    console.log("Total grid dots: " + count + " override: " + override);
    if(override == false && count > 4000){
        figma.ui.postMessage(count);
        return;
    }

    override = false;

    const gridParent = figma.createFrame();
    gridParent.x = node.x;
    gridParent.y = node.y;
    gridParent.resize(node.width, node.height);
   
    for(var y = size; y < height; y += inc){
      for(var x = size; x < width; x += inc){
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
    node.parent.insertChild(index+1, flat);
    figma.closePlugin();
  }else{
    showAlert("Select a rectangle to generate a dot grid");
  }

  function showAlert(message: String){
    figma.ui.postMessage(message)
  }
}


