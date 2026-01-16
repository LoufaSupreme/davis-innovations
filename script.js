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

const tiles = document.querySelectorAll(".tile")
replaceTiles(tiles)
