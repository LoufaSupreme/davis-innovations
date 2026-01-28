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

function setClipPath(tile) {
  const d="M 0.025,0.1 L 0.4875,0.1 A0.025,0.025 0,0,0 0.5125,0.0875 L 0.5125,0.0125 A0.025,0.025 0,0,1 0.5375,0 L 0.575,0 L 0.975,0 A0.025,0.025 0,0,1 1,0.025 L 1,0.975 A0.025,0.025 0,0,1 0.975,1 L 0.025,1 A0.025,0.025 0,0,1 0,0.975 L 0,0.125 A0.025,0.025 0,0,1 0.025,0.1 Z"
  
  const cornerRadius = 0.1;
  const cutoutDepth = 0.1;
  const cutoutWidth = 0.5;
  const coords = [[0+cornerRadius, cutoutDepth, null, null], [cutoutWidth, cutoutDepth, 'up', 'A0'], [cutoutWidth, 0, 'right', 'A1'], [1,0,'down','A1'], [1,1,'left','A1'], [0,1,'upLeft','A1'], [0,cutoutDepth,'right','A1'], [0+cornerRadius, cutoutDepth, null,null]];
  // const arcs = ['L', 'A0', 'L', 'A1', 'L', 'A1', 'L', 'A1', 'L', 'A1', 'L', 'A1'];
  const dirs = {
    up: {
      pt1: {x: -1, y: 0},
      pt2: {x: 0, y: -1}
    },
    right: {
      pt1: {x: 0, y: 1},
      pt2: {x: 1, y: 0}
    },
    down: {
      pt1: {x: -1, y: 0},
      pt2: {x: 0, y: 1}
    },
    left: {
      pt1: {x: 0, y: -1},
      pt2: {x: -1, y: 0}
    },
    upLeft: {
      pt1: {x: 1, y: 0},
      pt2: {x: 0, y: -1}
    }, 
  };

  arcLookup = {
    L: 'L',
    A0: `A${cornerRadius},${cornerRadius} 0,0,0`,
    A1: `A${cornerRadius},${cornerRadius} 0,0,1`,
  }
  
  let pathd = 'M';
  let arcCounter = 0;
  for (const [index,[x,y,dir,arc]] of coords.entries()) {
    if (arc == null) {
      str = ` ${x},${y} L`;
      pathd += str;
      console.log(str)
    }
    
    // if (index == 0) {
    //   pathd += ` ${x},${y} ${arcLookup[arcs[arcCounter]]}`;
    //   arcCounter++;
    // }
    // else if (index == coords.length - 1) {
    //   pathd += ` ${arcLookup[arcs[arcCounter]]} ${x},${y} Z`
    // }
    else {
      const pt1 = `${x + cornerRadius*dirs[dir].pt1.x},${y + cornerRadius/2*dirs[dir].pt1.y}`;
      const pt2 = `${x + cornerRadius*dirs[dir].pt2.x},${y + cornerRadius/2*dirs[dir].pt2.y}`;
      // const arc1 = arcLookup[arcs[arcCounter]];
      // arcCounter++;
      // const arc2 = arcLookup[arcs[arcCounter]];
      // arcCounter++;
      str = ` ${pt1} L ${arcLookup[arc]} ${pt2} L`;
      pathd += str;
      console.log(str)

    }
    // console.log(pathd)
  }
  pathd = pathd.slice(0,-1) + 'Z'
  console.log(pathd)

  const clipPath = tile.querySelector('.clip-path')
  clipPath.setAttribute('d', pathd)
}

const tiles = document.querySelectorAll(".tile")
tiles.forEach(tile => {
  setClipPath(tile)
})
// replaceTiles(tiles)
