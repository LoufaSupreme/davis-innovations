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

function setClipPath(tile) {
  const d="M 0.025,0.1 L 0.4875,0.1 A0.025,0.025 0,0,0 0.5125,0.0875 L 0.5125,0.0125 A0.025,0.025 0,0,1 0.5375,0 L 0.575,0 L 0.975,0 A0.025,0.025 0,0,1 1,0.025 L 1,0.975 A0.025,0.025 0,0,1 0.975,1 L 0.025,1 A0.025,0.025 0,0,1 0,0.975 L 0,0.125 A0.025,0.025 0,0,1 0.025,0.1 Z"
  
  const cornerRadius = 0.05;
  const cutoutDepth = 0.1;
  const cutoutWidth = 0.5;

  const coords = [
    {x: cornerRadius, y: cutoutDepth},
    {x: cutoutWidth, y: cutoutDepth, in: 'right', out: 'up'},
    {x: cutoutWidth, y: 0, in: 'up', out: 'right'},
    {x: 1, y: 0, in: 'right', out: 'down'},
    {x: 1, y: 1, in: 'down', out: 'left'},
    {x: 0, y: 1, in: 'left', out: 'up'},
    {x: 0, y: cutoutDepth, in: 'up', out: 'right'},
    {x: cornerRadius, y: cutoutDepth},
  ];

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
  const lastCoord = coords.at(-1);
  pathd += ` L ${lastCoord.x},${lastCoord.y} Z`;
  console.log(pathd)

  const clipPath = tile.querySelector('.clip-path')
  clipPath.setAttribute('d', pathd)
}

const tiles = document.querySelectorAll(".tile")
tiles.forEach(tile => {
  setClipPath(tile)
})
// replaceTiles(tiles)
