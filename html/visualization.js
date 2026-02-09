// visualization.js - EGYSZERŰ VERZIÓ
console.log('=== VIZUALIZÁCIÓ.JS BETÖLTÖDÖTT ===');

// Egyszerű vizualizáció osztály
class FarmVisualizer {
  constructor() {
    console.log('FarmVisualizer konstruktor meghívva');
    this.canvas = null;
    this.ctx = null;
  }

  // Létrehoz egy canvas-t a kerthez
  createVisualization(bedWidth, bedHeight, plants) {
    console.log('createVisualization meghívva:', bedWidth, bedHeight, plants);
    
    // Canvas létrehozása
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    canvas.style.cssText = `
      border: 3px solid green;
      background: #f0fff0;
      border-radius: 10px;
      display: block;
      margin: 20px auto;
      max-width: 90%;
    `;
    
    const ctx = canvas.getContext('2d');
    
    // Kert kerete
    ctx.fillStyle = '#f0fff0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#27ae60';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // Felirat
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Kert: ${bedWidth}m × ${bedHeight}m`, canvas.width/2, 30);
    ctx.font = '14px Arial';
    ctx.fillText(`${plants.length} növénycsoport`, canvas.width/2, 55);
    
    // Növények rajzolása
    if (plants && plants.length > 0) {
      const colors = ['#e74c3c', '#27ae60', '#3498db', '#f39c12', '#9b59b6'];
      
      plants.forEach((plant, index) => {
        const color = colors[index % colors.length];
        const x = 50 + (index % 4) * 180;
        const y = 100 + Math.floor(index / 4) * 120;
        
        // Növény négyzet
        ctx.fillStyle = color + '80';
        ctx.fillRect(x, y, 150, 100);
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, 150, 100);
        
        // Növény infó
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(plant.plantType || `Növény ${index + 1}`, x + 10, y + 25);
        
        ctx.font = '12px Arial';
        ctx.fillText(`Fajta: ${plant.variety || '?'}`, x + 10, y + 45);
        ctx.fillText(`Mennyiség: ${plant.quantity || 0} db`, x + 10, y + 65);
        ctx.fillText(`Méret: ${plant.width/100 || 1}m × ${plant.height/100 || 1}m`, x + 10, y + 85);
      });
    } else {
      ctx.fillStyle = '#777';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Nincsenek növények a vizualizációhoz', canvas.width/2, canvas.height/2);
    }
    
    return canvas;
  }
}

// Globális változóként elérhetővé tesszük
window.FarmVisualizer = FarmVisualizer;
console.log('FarmVisualizer beállítva a window objektumra');