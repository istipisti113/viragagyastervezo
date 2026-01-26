// Pop-up megnyitása
document.getElementById('open_popup').addEventListener('click', async function() {
    document.getElementById('popup_overlay').classList.add('active');
    var lista = await loadJson("query/faj/neve")
    var sor = "<option value='NEVE' onclick='handleSelectClick(event)'>NEVE</option>"
    var asdf = ""
    for (let name in lista) {
        asdf+=sor.replaceAll("NEVE", lista[name])
    }
    document.getElementById("plant_select").innerHTML = asdf
});

document.getElementById('open_info_popup').addEventListener('click', function() {
    document.getElementById('info_popup_overlay').classList.add('active');
});

// Rólunk popup megnyitása
document.getElementById('open_about_popup').addEventListener('click', function() {
    document.getElementById('about_popup_overlay').classList.add('active');
});

// Kert mentése popup megnyitása
document.getElementById('save_garden').addEventListener('click', function() {
    document.getElementById('save_popup_overlay').classList.add('active');
});

// Kert betöltése popup megnyitása
document.getElementById('load_garden').addEventListener('click', function() {
    document.getElementById('load_popup_overlay').classList.add('active');
});

// Exportálás popup megnyitása
document.getElementById('export_garden').addEventListener('click', function() {
    document.getElementById('export_popup_overlay').classList.add('active');
});
    
// Pop-up bezárása a X gombbal
document.getElementById('close_popup').addEventListener('click', function() {
    document.getElementById('popup_overlay').classList.remove('active');
});

document.getElementById('close_info_popup').addEventListener('click', function() {
    document.getElementById('info_popup_overlay').classList.remove('active');
});

// Rólunk popup bezárása
document.getElementById('close_about_popup').addEventListener('click', function() {
    document.getElementById('about_popup_overlay').classList.remove('active');
});

// Kert mentése popup bezárása
document.getElementById('close_save_popup').addEventListener('click', function() {
    document.getElementById('save_popup_overlay').classList.remove('active');
});

// Kert betöltése popup bezárása
document.getElementById('close_load_popup').addEventListener('click', function() {
    document.getElementById('load_popup_overlay').classList.remove('active');
});

// Exportálás popup bezárása
document.getElementById('close_export_popup').addEventListener('click', function() {
    document.getElementById('export_popup_overlay').classList.remove('active');
});
    
// Pop-up bezárása az "Elfogadom" gombbal
document.getElementById('accept_btn').addEventListener('click', function() {
    document.getElementById('popup_overlay').classList.remove('active');
    alert('A pop-up tartalma elfogadva!');
});
    
// Pop-up bezárása a "Mégse" gombbal
document.getElementById('cancel_btn').addEventListener('click', function() {
    document.getElementById('popup_overlay').classList.remove('active');
});
    

async function handleSelectClick(event) {
    const select = event.target.value;
    var id = await loadJson("get_by/faj/neve/"+select+"/id") 
    var fajtak = await loadJson("get_by/fajta/fajid/"+id+"/neve") 
    var sor = "<option value='NEVE'>NEVE</option>"
    var asdf = ""
    for (let name in fajtak) {
        asdf+=sor.replaceAll("NEVE", fajtak[name])
    }
    document.getElementById("fajta_select").innerHTML = asdf
}

// Sidepanel gombok aktív állapot kezelése
document.addEventListener('DOMContentLoaded', function() {
    const sidepanelButtons = document.querySelectorAll('.sidepanel-btn');
    
    sidepanelButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Távolítsuk el az aktív osztályt minden gombról
            sidepanelButtons.forEach(btn => btn.classList.remove('active'));
            // Adjuk hozzá az aktív osztályt a kattintott gombhoz
            this.classList.add('active');
        });
    });
    
    // Kert mentése gomb funkcionalitása
    document.getElementById('save_garden').addEventListener('click', function(e) {
        e.stopPropagation(); // Megakadályozza, hogy az aktív osztály beállítása előtt bezáródjon
    });
    
    // Kert betöltése gomb funkcionalitása
    document.getElementById('load_garden').addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Exportálás gomb funkcionalitása
    document.getElementById('export_garden').addEventListener('click', function(e) {
        e.stopPropagation();
    });
});