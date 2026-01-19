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
        
// Pop-up bezárása a X gombbal
document.getElementById('close_popup').addEventListener('click', function() {
document.getElementById('popup_overlay').classList.remove('active');
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
        
// Pop-up bezárása a háttérre kattintva
document.getElementById('popup_overlay').addEventListener('click', function(e) {
    if (e.target === this) {
        document.getElementById('popup_overlay').classList.remove('active');
    }
});
        
// Pop-up bezárása ESC billentyűvel
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.getElementById('popup_overlay').classList.remove('active');
    }
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
