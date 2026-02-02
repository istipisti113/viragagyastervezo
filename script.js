function loadplants(){
    fetch("novenyek")
}
async function loadPage(page, id) {
  return fetch(page)
    .then(response => response.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
    })
}

async function loadJson(page) {
  return fetch(page)
    .then(response => response.json()).then(final => JSON.parse(final))
}
var displayWidth = 980;
var displayHeight = 810;
var canvas = document.getElementById("c");
var scale = 2;
canvas.style.width = displayWidth + 'px';
canvas.style.height = displayHeight + 'px';
canvas.width = displayWidth * scale;
canvas.height = displayHeight * scale;

var c = document.getElementById("c");
var ctx = c.getContext("2d");

ctx.moveTo(0, 0);
ctx.lineTo(980*2, 810*2);
ctx.stroke();

