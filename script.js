async function getHtmlSnippet(filename) {
  const res = await fetch(`./html-snippets/${filename}`);
  const snip = await res.text();
  console.log(snip)
  return snip;
}

async function replaceTiles(tiles) {
  const snip = await getHtmlSnippet("glassTile.html");
  tiles.forEach(tile => {
    tile.outerHTML = snip;
  })
}

// calculates the sweepFlag of an SVG path arc "A r,r 0 0 sweepFlag, arcEnd"
// right turn -> 1
// left turn -> 0
function sweepFlag(dIn, dOut) {
  const cross = dIn.x * dOut.y - dIn.y * dOut.x;
  return cross < 0 ? 0 : 1;
}

function setClipPath(clipPath, coords, cornerRadius) {  

  const dirs = {
    up: {x: 0, y: -1},
    right: {x: 1, y: 0},
    down: {x: 0, y: 1},
    left: {x: -1, y: 0},
  };
  
  let pathd = `M ${coords[0].x},${coords[0].y}`;
  for (let i = 1; i < coords.length - 1; i++) {
    const curr = coords[i];

    const dIn = dirs[curr.in];
    const dOut = dirs[curr.out];

    // arc geometry
    const arcStart = {
      x: curr.x - cornerRadius * dIn.x,
      y: curr.y - cornerRadius * dIn.y,
    };

    const arcEnd = {
      x: curr.x + cornerRadius * dOut.x,
      y: curr.y + cornerRadius * dOut.y,
    };

    const sweep = sweepFlag(dIn, dOut);

    pathd += ` L ${arcStart.x},${arcStart.y} A ${cornerRadius},${cornerRadius} 0 0 ${sweep} ${arcEnd.x},${arcEnd.y}`;
  }

  pathd += ' Z'

  clipPath.setAttribute('d', pathd);
}

function applyTileClipPaths(tile) {
  // tile background
  const cardBGClipPath = tile.querySelector('.card-clip-path');
  
  let cornerRadius = 0.06;
  let cutoutDepth = 0.1;
  let cutoutWidth = 0.5;

  const cardBGCoords = [
    {x: cornerRadius, y: cutoutDepth},
    {x: cutoutWidth, y: cutoutDepth, in: 'right', out: 'up'},
    {x: cutoutWidth, y: 0, in: 'up', out: 'right'},
    {x: 1, y: 0, in: 'right', out: 'down'},
    {x: 1, y: 1, in: 'down', out: 'left'},
    {x: 0, y: 1, in: 'left', out: 'up'},
    {x: 0, y: cutoutDepth, in: 'up', out: 'right'},
    {x: cornerRadius, y: cutoutDepth},
  ];

  setClipPath(cardBGClipPath, cardBGCoords, cornerRadius);

  // tile title
  const cardTitleClipPath = tile.querySelector('.title-clip-path');

  // cornerRadius = 0.5;
  // // cutoutDepth = 0.1;
  // // cutoutWidth = 0.5;

  // const titleBGCoords = [
  //   {x: cornerRadius, y: 0},
  //   {x: 1, y: 0, in: 'right', out: 'down'},
  //   {x: 1, y: 1, in: 'down', out: 'left'},
  //   {x: 0, y: 1, in: 'left', out: 'up'},
  //   {x: 0, y: 0, in: 'up', out: 'right'},
  //   {x: cornerRadius, y: 0},
  // ];

  // setClipPath(cardTitleClipPath, titleBGCoords, cornerRadius);
}

const tiles = document.querySelectorAll(".tile")
tiles.forEach(tile => {
  // applyTileClipPaths(tile)
})
// replaceTiles(tiles)
