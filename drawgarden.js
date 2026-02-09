const plantImageMap = {};

function loadPlantImages() {
  const plants = [
    { id: 1, file: "Balatoni Rózsa krumpli.png" },
    { id: 2, file: "Gogosári paprika.png" },
    { id: 3, file: "Cékla.png" }
  ];

  return Promise.all(
    plants.map(p => {
      return new Promise(resolve => {
        const img = new Image();
        img.src = "../images/" + p.file;
        img.onload = () => {
          plantImageMap[p.id] = img;
          resolve();
        };
      });
    })
  );
}

async function renderGarden(canvas, agyas, scale = 1) {
  console.log("rendering")
  canvas.style.width = String(agyaswidth*100)+"px"
  canvas.style.height = String(agyasheight*100)+"px"
  canvas.width = agyaswidth*100
  canvas.height=agyasheight*100
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.lineWidth="5"
  ctx.rect(0,0,canvas.width, canvas.height);
  ctx.stroke();

  ctx.beginPath();
  for (var noveny of agyas){
    console.log(noveny.x, noveny.y, noveny.height, noveny.width)
    ctx.lineWidth = "10"
    ctx.fillStyle = "red"
    ctx.rect(
      noveny.x+1,
      noveny.y+1,
      noveny.width,
      noveny.height,
    );
  }
  ctx.fill();
  //ctx.beginPath();
  //for (var noveny of agyas) {
  //  console.log("nigger")
  //  ctx.rect(10, 50, 5, 5);
  //}
  //ctx.fill();

  console.log("rendered")
}

function drawPlantPack(ctx, pack, scale) {
 // const img = plantImageMap[pack.noveny_id];
 // if (!img) return;

  const cols = pack.sor;
  const rows = pack.sorhossz;

  const cellW = pack.width / cols;
  const cellH = pack.height / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (pack.x + c * cellW) * scale;
      const y = (pack.y + r * cellH) * scale;

      ctx.rect(
        x,
        y,
        cellW * scale,
        cellH * scale
      );
    }
  }
}

function testRender() {
  const canvas = document.getElementById("gardenCanvas");

  const rectangles = [
    { noveny_id: 1, sor: 4, sorhossz: 3, width: 240, height: 180 },
    { noveny_id: 2, sor: 3, sorhossz: 2, width: 180, height: 120 },
    { noveny_id: 3, sor: 5, sorhossz: 2, width: 300, height: 120 }
  ];

  const packer = new RectanglePacker(canvas.width, canvas.height);
  const packed = packer.packShelfAlgorithm(rectangles);

  renderGarden(canvas, packed, 1);
}

window.addEventListener("load", async () => {
  await loadPlantImages();
  testRender();
});

function loadplants(){
  fetch("novenyek")
}
