// Pop-up megnyitása
document.getElementById('open_popup').addEventListener('click', function() {
    document.getElementById('popup_overlay').classList.add('active');
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