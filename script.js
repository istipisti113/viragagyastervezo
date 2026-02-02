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

function hozzaadas() {
  const plantSelect = document.getElementById('plant_select');
  const fajtaSelect = document.getElementById('fajta_select');
  const mennyiInput = document.getElementById('mennyi');

  // Ellenőrizzük, hogy a kiválasztott növény valid-e
  const selectedPlantValue = plantSelect.value;
  const selectedFajtaValue = fajtaSelect.value;
  const selectedQuantity = parseInt(mennyiInput.value);

  // Validáció
  if (!selectedPlantValue || !selectedFajtaValue || isNaN(selectedQuantity) || selectedQuantity <= 0) {
    errorMessageDiv.textContent = "Kérjük, töltsön ki minden mezőt helyesen a növény hozzáadásához!";
    return;
  }

  // Hibaüzenet törlése
  errorMessageDiv.textContent = '';

  // Új növény objektum létrehozása
  const newPlant = {
    plantType: selectedPlantValue,
    variety: selectedFajtaValue,
    quantity: selectedQuantity,
    id: Date.now() // Egyedi azonosító
  };

  // Hozzáadás a tömbhöz
  selectedPlants.push(newPlant);

  // Frissítjük a megjelenítést
  updatePlantList();

  // Mezők ürítése
  mennyiInput.value = '';
  plantSelectionErrorDiv.textContent = ''; // Töröljük a tervezési hibát is

  console.log("Hozzáadott növények:", selectedPlants);
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

let selectedPlants = [];

// Hozzáadás gomb referencia (az első gomb, ami a hozzáadásért felel)
const addButton = document.getElementById("add");
const planButton = document.getElementById("tervezes");

// Fő input mezők
const areaInput = document.getElementById('area_input');
const widthInput = document.getElementById('width_input');
const errorMessageDiv = document.getElementById('error_message');
const plantSelectionErrorDiv = document.getElementById('plant_selection_error');

// Hozzáadási logika

// Tervezés gomb eseménykezelője - CSAK a validálás
planButton.addEventListener('click', function () {
  // Első körben ellenőrizzük a terület mezőket
  const length = parseFloat(areaInput.value);
  const width = parseFloat(widthInput.value);

  errorMessageDiv.textContent = '';
  plantSelectionErrorDiv.textContent = '';

  // Terület validáció
  if (isNaN(length) || length <= 0 || isNaN(width) || width <= 0) {
    errorMessageDiv.textContent = "Kérjük, töltse ki helyesen a terület mezőket (pozitív számok)!";
    return;
  }

  // Növény validáció
  if (selectedPlants.length === 0) {
    plantSelectionErrorDiv.textContent = "Kérjük, adjon hozzá legalább egy növényt a tervezéshez!";
    return;
  }

  // Ha minden valid, akkor jelenítsük meg a mennyiség beviteli részt
  showQuantitySection();
});

// Növények listájának frissítése
function updatePlantList() {
  const list = document.querySelector('ul');
  list.innerHTML = '';

  selectedPlants.forEach(plant => {
    const li = document.createElement('li');
    li.setAttribute('data-id', plant.id);
    li.textContent = `${plant.plantType} - ${plant.variety}: ${plant.quantity} db`;

    // Törlés gomb
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Törlés';
    deleteBtn.addEventListener('click', function () {
      selectedPlants = selectedPlants.filter(p => p.id !== plant.id);
      updatePlantList();
    });

    li.appendChild(deleteBtn);
    list.appendChild(li);
  });

  // A hozzáadás gomb mindig látható marad
  addButton.style.display = 'inline-block';
}

// Mennyiségi rész megjelenítése
function showQuantitySection() {
  const plantQuantitySection = document.getElementById('plant_quantity_section');
  const plantQuantityInputs = document.getElementById('plant_quantity_inputs');

  // Töröljük a korábbi tartalmat
  plantQuantityInputs.innerHTML = '';

  // Mennyiségi mezők létrehozása minden kiválasztott növényhez
  selectedPlants.forEach(plant => {
    const div = document.createElement('div');
    div.className = 'quantity_input';

    const label = document.createElement('label');
    label.textContent = `${plant.plantType} - ${plant.variety}: `;

    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.value = plant.quantity;
    input.dataset.plantId = plant.id;

    div.appendChild(label);
    div.appendChild(input);
    plantQuantityInputs.appendChild(div);
  });

  // Megjelenítjük a mennyiségi részt
  plantQuantitySection.style.display = 'block';

  // Inicializáljuk a tervezési logikát
  initPlanning();
}

// Tervezés véglegesítése
function initPlanning() {
  // A mennyiségi részen belüli tervezés gomb keresése
  // Ha nincs, akkor létrehozunk egyet
  let finalPlanButton = plantQuantitySection.querySelector('button');

  if (!finalPlanButton) {
    finalPlanButton = document.createElement('button');
    finalPlanButton.textContent = 'Terv elkészítése';
    plantQuantitySection.appendChild(finalPlanButton);

    finalPlanButton.addEventListener('click', function () {
      // Összegyűjtjük a megadott mennyiségeket
      const quantityInputs = document.querySelectorAll('#plant_quantity_inputs input[type="number"]');
      let allValid = true;

      quantityInputs.forEach(input => {
        const value = parseInt(input.value);
        const plantId = parseInt(input.dataset.plantId);

        if (isNaN(value) || value < 0) {
          document.getElementById('quantity_error_message').textContent =
            "Kérjük, adjon meg érvényes mennyiségeket (0 vagy nagyobb)!";
          allValid = false;
          return;
        }

        // Frissítjük a növény mennyiségét
        const plantIndex = selectedPlants.findIndex(p => p.id === plantId);
        if (plantIndex !== -1) {
          selectedPlants[plantIndex].quantity = value;
        }
      });

      if (!allValid) return;

      // Töröljük a hibát
      document.getElementById('quantity_error_message').textContent = '';

      // Itt folytathatod a tervezést - például küldés szervernek vagy megjelenítés
      console.log("Végleges tervezés:", {
        terulet: {
          hossz: parseFloat(areaInput.value),
          szelesseg: parseFloat(widthInput.value)
        },
        novenyek: selectedPlants
      });

      // Sikeres üzenet
      alert("A tervezés sikeresen elkészült!");
    });
  }
}