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

  // Validáció - CSAK ha tényleg üresek a mezők (nem alert)
  if (!selectedPlantValue || !selectedFajtaValue || isNaN(selectedQuantity) || selectedQuantity <= 0) {
    return; // Csak visszatérünk, nem jelenítünk alert-et
  }
  // Ellenőrizzük, hogy van-e már ilyen növény
  const existingPlantIndex = selectedPlants.findIndex(plant => 
    plant.plantType === selectedPlantValue && plant.variety === selectedFajtaValue
  );
  
  if (existingPlantIndex !== -1) {
    // Ha már van ilyen növény, akkor növeljük a mennyiségét
    selectedPlants[existingPlantIndex].quantity += selectedQuantity;
  } else {
    // Új növény objektum létrehozása
    const newPlant = {
      plantType: selectedPlantValue,
      variety: selectedFajtaValue,
      quantity: selectedQuantity,
      id: Date.now() // Egyedi azonosító
    };

    // Hozzáadás a tömbhöz
    selectedPlants.push(newPlant);
  }

  // Frissítjük a megjelenítést
  updatePlantList();

  // Mezők ürítése
  mennyiInput.value = '';

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

// Tervezés gomb eseménykezelője
function tervezes() {
  const areaInput = document.getElementById('area_input');
  const widthInput = document.getElementById('width_input');
  
  // Első körben ellenőrizzük a terület mezőket
  const length = parseFloat(areaInput.value);
  const width = parseFloat(widthInput.value);

  // Terület validáció
  if (isNaN(length) || length <= 0 || isNaN(width) || width <= 0) {
    alert("Kérjék, töltse ki helyesen a terület mezőket (pozitív számok)!");
    return;
  }

  // Növény validáció
  if (selectedPlants.length === 0) {
    alert("Kérjék, adjon hozzá legalább egy növényt a tervezéshez!");
    return;
  }

  // Ha minden valid, akkor jelenítsük meg a tervezési popup-ot
  showPlanningPopup();
}

// Növények listájának frissítése - NYILAKKAL
function updatePlantList() {
  const list = document.querySelector('ul');
  if (!list) return;
  
  list.innerHTML = '';

  // Csoportosítás növény típus és fajta szerint
  const groupedPlants = {};
  
  selectedPlants.forEach(plant => {
    const key = `${plant.plantType}_${plant.variety}`;
    if (!groupedPlants[key]) {
      groupedPlants[key] = {
        plantType: plant.plantType,
        variety: plant.variety,
        quantity: 0,
        ids: [] // Az összes azonos növény id-ját tároljuk
      };
    }
    groupedPlants[key].quantity += plant.quantity;
    groupedPlants[key].ids.push(plant.id);
  });

  // Megjelenítés csoportosítva nyilakkal
  Object.values(groupedPlants).forEach(plantGroup => {
    const li = document.createElement('li');
    li.setAttribute('data-id', plantGroup.ids[0]);
    
    // Növény neve és fajtája
    const plantText = document.createElement('span');
    plantText.textContent = `${plantGroup.plantType} - ${plantGroup.variety}: `;
    plantText.style.fontWeight = 'bold';
    plantText.style.marginRight = '10px';
    plantText.style.color = '#000000';

    // Mennyiség kezelő gombok
    const quantityContainer = document.createElement('div');
    quantityContainer.style.display = 'flex';
    quantityContainer.style.alignItems = 'center';
    quantityContainer.style.gap = '5px';
    
    
    // Csökkentés gomb
    const decreaseBtn = document.createElement('button');
    decreaseBtn.textContent = '−';
    decreaseBtn.style.width = '30px';
    decreaseBtn.style.height = '30px';
    decreaseBtn.style.borderRadius = '50%';
    decreaseBtn.style.border = '1px solid #ccc';
    decreaseBtn.style.background = '#f0f0f0';
    decreaseBtn.style.cursor = 'pointer';
    decreaseBtn.style.fontSize = '16px';
    decreaseBtn.style.display = 'flex';
    decreaseBtn.style.alignItems = 'center';
    decreaseBtn.style.justifyContent = 'center';
    
    // Mennyiség megjelenítése
    const quantityDisplay = document.createElement('span');
    quantityDisplay.textContent = plantGroup.quantity;
    quantityDisplay.style.minWidth = '30px';
    quantityDisplay.style.textAlign = 'center';
    quantityDisplay.style.fontWeight = 'bold';
    
    // Növelés gomb
    const increaseBtn = document.createElement('button');
    increaseBtn.textContent = '+';
    increaseBtn.style.width = '30px';
    increaseBtn.style.height = '30px';
    increaseBtn.style.borderRadius = '50%';
    increaseBtn.style.border = '1px solid #ccc';
    increaseBtn.style.background = '#f0f0f0';
    increaseBtn.style.cursor = 'pointer';
    increaseBtn.style.fontSize = '16px';
    increaseBtn.style.display = 'flex';
    increaseBtn.style.alignItems = 'center';
    increaseBtn.style.justifyContent = 'center';
    
    // db szöveg
    const dbText = document.createElement('span');
    dbText.textContent = ' db';
    dbText.style.marginLeft = '5px';
    
    // Eseménykezelők a nyilakhoz
    decreaseBtn.addEventListener('click', function() {
      if (plantGroup.quantity > 1) {
        plantGroup.quantity--;
        quantityDisplay.textContent = plantGroup.quantity;
        
        // Frissítjük a selectedPlants tömböt is
        updatePlantQuantity(plantGroup, plantGroup.quantity);
      }
    });
    
    increaseBtn.addEventListener('click', function() {
      plantGroup.quantity++;
      quantityDisplay.textContent = plantGroup.quantity;
      
      // Frissítjük a selectedPlants tömböt is
      updatePlantQuantity(plantGroup, plantGroup.quantity);
    });
    
    // Törlés gomb
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Törlés';
    deleteBtn.style.marginLeft = '15px';
    deleteBtn.style.padding = '5px 10px';
    deleteBtn.style.background = '#e74c3c';
    deleteBtn.style.color = 'white';
    deleteBtn.style.border = 'none';
    deleteBtn.style.borderRadius = '4px';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.fontSize = '14px';
    
    deleteBtn.addEventListener('click', function () {
      // Az összes ilyen típusú és fajtájú növényt töröljük
      selectedPlants = selectedPlants.filter(p => 
        !(p.plantType === plantGroup.plantType && p.variety === plantGroup.variety)
      );
      updatePlantList();
    });
    
    // Összeállítás
    quantityContainer.appendChild(decreaseBtn);
    quantityContainer.appendChild(quantityDisplay);
    quantityContainer.appendChild(increaseBtn);
    
    li.appendChild(plantText);
    li.appendChild(quantityContainer);
    li.appendChild(dbText);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

// Növény mennyiségének frissítése a tömbben
function updatePlantQuantity(plantGroup, newQuantity) {
  // Az összes azonos növény mennyiségének frissítése
  selectedPlants.forEach(plant => {
    if (plant.plantType === plantGroup.plantType && plant.variety === plantGroup.variety) {
      // Arányosan osztjuk el az új mennyiséget
      const totalSameType = selectedPlants.filter(p => 
        p.plantType === plantGroup.plantType && p.variety === plantGroup.variety
      ).length;
      
      if (totalSameType > 0) {
        plant.quantity = Math.max(1, Math.floor(newQuantity / totalSameType));
      }
    }
  });
}

// Tervezési popup megjelenítése
function showPlanningPopup() {
  // Eltávolítjuk az előző popup-ot, ha van
  const existingPopup = document.getElementById('planning-popup');
  if (existingPopup) {
    existingPopup.remove();
  }
  
  // Új popup létrehozása
  const planningPopup = document.createElement('div');
  planningPopup.id = 'planning-popup';
  planningPopup.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;
  
  // Popup tartalom - KISEBB MÉRETBEN
  const popupContent = document.createElement('div');
  popupContent.style.cssText = `
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    max-width: 500px;
    width: 90%;
    max-height: 70vh;
    overflow-y: auto;
    position: relative;
  `;
  
  // Bezárás gomb
  const closeButton = document.createElement('button');
  closeButton.textContent = '×';
  closeButton.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  `;
  
  closeButton.addEventListener('mouseenter', function() {
    this.style.backgroundColor = '#f0f0f0';
  });
  
  closeButton.addEventListener('mouseleave', function() {
    this.style.backgroundColor = 'transparent';
  });
  
  closeButton.addEventListener('click', function() {
    planningPopup.remove();
  });
  
  // Cím - KISEBB BETŰMÉRET
  const title = document.createElement('h2');
  title.textContent = 'Farm Terv Összegzése';
  title.style.cssText = `
    text-align: center;
    color: #000000;
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 20px;
    border-bottom: 2px solid #ecf0f1;
    padding-bottom: 10px;
  `;
  
  // Terület információk
  const areaInput = document.getElementById('area_input');
  const widthInput = document.getElementById('width_input');
  
  const areaInfo = document.createElement('div');
  areaInfo.style.cssText = `
    background-color: #f8f9fa;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 15px;
    text-align: center;
  `;
  
  const areaText = document.createElement('p');
  areaText.innerHTML = `<strong>Terület mérete:</strong> ${areaInput.value} m × ${widthInput.value} m`;
  areaText.style.cssText = `
    font-size: 14px;
    color: #000000;
    margin: 0;
  `;
  
  areaInfo.appendChild(areaText);
  
  // Növények listája
  const plantsTitle = document.createElement('h3');
  plantsTitle.textContent = 'Kiválasztott növények:';
  plantsTitle.style.cssText = `
    color: #000000;
    margin-bottom: 10px;
    text-align: center;
    font-size: 16px;
  `;
  
  const plantsList = document.createElement('div');
  plantsList.id = 'planning-plants-list';
  plantsList.style.cssText = `
    margin-bottom: 15px;
    max-height: 200px;
    overflow-y: auto;
  `;
  
  // Csoportosítás
  const groupedPlants = {};
  selectedPlants.forEach(plant => {
    const key = `${plant.plantType}_${plant.variety}`;
    if (!groupedPlants[key]) {
      groupedPlants[key] = {
        plantType: plant.plantType,
        variety: plant.variety,
        quantity: 0
      };
    }
    groupedPlants[key].quantity += plant.quantity;
  });
  
  // Növények megjelenítése
  Object.values(groupedPlants).forEach(plant => {
    const plantDiv = document.createElement('div');
    plantDiv.style.cssText = `
      background-color: #f0f0f0;
      padding: 8px 12px;
      margin: 6px 0;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
    `;
    
    const plantText = document.createElement('span');
    plantText.textContent = `${plant.plantType} - ${plant.variety}`;
    plantText.style.fontWeight = 'bold';
    plantText.style.color = '#000000';

    const quantityText = document.createElement('span');
    quantityText.textContent = `${plant.quantity} db`;
    quantityText.style.cssText = `
      font-weight: bold;
      color: #27ae60;
    `;
    
    plantDiv.appendChild(plantText);
    plantDiv.appendChild(quantityText);
    plantsList.appendChild(plantDiv);
  });
  
  // Összes növény
  const totalPlants = Object.values(groupedPlants).reduce((sum, plant) => sum + plant.quantity, 0);
  
  const totalDiv = document.createElement('div');
  totalDiv.style.cssText = `
    background-color: #34495e;
    color: white;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 15px;
    text-align: center;
  `;
  
  const totalText = document.createElement('p');
  totalText.textContent = `Összesen: ${totalPlants} db növény`;
  totalText.style.cssText = `
    margin: 0;
    font-size: 16px;
    font-weight: bold;
  `;
  
  totalDiv.appendChild(totalText);
  
  // Gombok - KISEBB MÉRETBEN
  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = `
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 15px;
  `;
  
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Vissza';
  cancelButton.style.cssText = `
    padding: 10px 20px;
    background-color: #95a5a6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    min-width: 100px;
  `;
  
  cancelButton.addEventListener('click', function() {
    planningPopup.remove();
  });
  
  const finishButton = document.createElement('button');
  finishButton.textContent = 'Terv Elkészítése';
  finishButton.style.cssText = `
    padding: 10px 20px;
    background-color: #27ae60;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    min-width: 150px;
  `;
  
finishButton.addEventListener('click', function() {
  // 1. Azonnal eltávolítjuk a tervezési popup-ot
  planningPopup.remove();
  
  // 2. Megjelenítjük az alert-et
  alert('A farm terv sikeresen elkészült!');
  
  // 3. OLDAL ÚJRATÖLTÉSE (így minden alaphelyzetbe áll)
  setTimeout(function() {
    location.reload();
  }, 100);
});

  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(finishButton);
  
  // Összeállítás
  popupContent.appendChild(closeButton);
  popupContent.appendChild(title);
  popupContent.appendChild(areaInfo);
  popupContent.appendChild(plantsTitle);
  popupContent.appendChild(plantsList);
  popupContent.appendChild(totalDiv);
  popupContent.appendChild(buttonContainer);
  
  planningPopup.appendChild(popupContent);
  document.body.appendChild(planningPopup);
  
  // Háttérre kattintás is bezárja
  planningPopup.addEventListener('click', function(event) {
    if (event.target === planningPopup) {
      planningPopup.remove();
    }
  });
}

// Űrlap resetelése
function resetForm() {
  selectedPlants = [];
  updatePlantList();
  document.getElementById('area_input').value = '';
  document.getElementById('width_input').value = '';
  document.getElementById('plant_select').value = '';
  document.getElementById('fajta_select').value = '';
  document.getElementById('mennyi').value = '';
}

// CSS stílusok hozzáadása - KISEBB MÉRETEK
document.addEventListener('DOMContentLoaded', function() {
  // Elrejtjük a felesleges elemeket
  const hideElements = ['error_message', 'plant_selection_error', 'plant_quantity_section'];
  hideElements.forEach(id => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.style.display = 'none';
    }
  });
  
  // CSS stílusok
  const style = document.createElement('style');
  style.textContent = `
    /* Fő popup - GÖRGETHETŐ */
    .popup_content {
      text-align: center;
      max-width: 550px;
      margin: 20px auto;
      padding: 20px;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      border: 1px solid #e0e0e0;
      max-height: 80vh;
      overflow-y: auto;
    }
    
    /* Címek */
    .popup_content p:first-of-type {
      font-size: 18px;
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #ecf0f1;
    }
    
    /* Input mezők - KISEBB GAP */
    .popup_content select, 
    .popup_content input[type="text"], 
    .popup_content input[type="number"] {
      width: 100%;
      max-width: 280px;
      margin: 8px auto;
      padding: 10px 12px;
      border: 1px solid #bdc3c7;
      border-radius: 6px;
      font-size: 14px;
      display: block;
      text-align: center;
    }
    
    /* Gombok - KISEBB */
    #add, #tervezes {
      padding: 12px 24px;
      margin: 15px 8px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      display: inline-block;
      min-width: 140px;
    }
    
    #add {
      background-color: #3498db;
      color: white;
    }
    
    #add:hover {
      background-color: #2980b9;
    }
    
    #tervezes {
      background-color: #27ae60;
      color: white;
    }
    
    #tervezes:hover {
      background-color: #229954;
    }
    
    /* Növények listája - GÖRGETHETŐ */
    ul {
      list-style-type: none;
      padding: 15px;
      margin: 20px auto;
      max-width: 480px;
      background-color: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      max-height: 250px;
      overflow-y: auto;
    }
    
    /* Lista elemek - KISEBB GAP */
    li {
      margin: 8px 0;
      padding: 10px 12px;
      background-color: white;
      border-radius: 6px;
      border: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #000000;
    }
    
    /* Nyilak gombjai */
    li button[style*="border-radius: 50%"] {
      transition: background-color 0.2s;
    }
    
    li button[style*="border-radius: 50%"]:hover {
      background-color: #e0e0e0 !important;
    }
    
    /* Törlés gomb */
    li button:not([style*="border-radius: 50%"]) {
      background-color: #e74c3c;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      transition: background-color 0.2s;
    }
    
    li button:not([style*="border-radius: 50%"]):hover {
      background-color: #c0392b;
    }
    
    /* Reszponzív */
    @media (max-width: 768px) {
      .popup_content {
        margin: 15px;
        padding: 15px;
      }
      
      #add, #tervezes {
        width: 100%;
        margin: 10px 0;
        max-width: 280px;
      }
      
      li {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
      
      li button:not([style*="border-radius: 50%"]) {
        align-self: flex-end;
      }
    }
    
    /* Görgetősáv stílusa */
    ::-webkit-scrollbar {
      width: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #bdc3c7;
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #95a5a6;
    }
  `;
  document.head.appendChild(style);
  
  // Eseménykezelők beállítása
  const addButton = document.getElementById('add');
  const planButton = document.getElementById('tervezes');
  
  if (addButton) {
    addButton.addEventListener('click', hozzaadas);
  }
  
  if (planButton) {
    planButton.addEventListener('click', tervezes);
  }
  
  console.log("Farm tervező betöltődött");
});