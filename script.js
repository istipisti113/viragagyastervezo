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