class RectanglePacker {
  constructor(containerWidth, containerHeight) {
    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;
    this.packedRectangles = [];
    this.shelves = [];
  }

  /**
   * Pack rectangles using Shelf Algorithm (First-Fit Decreasing Height)
   * @param {Array} rectangles - Array of {id, width, height}
   * @returns {Array} Packed rectangles with positions
   */
  packShelfAlgorithm(rectangles) {
    // 1. Sort rectangles by height (tallest first) or area
    const sorted = [...rectangles].sort((a, b) => 
      Math.max(b.width, b.height) - Math.max(a.width, a.height)
    );
    
    this.shelves = [{ y: 0, currentX: 0, height: 0 }];
    
    for (const rect of sorted) {
      let placed = false;
      
      // Try to fit in existing shelves
      for (const shelf of this.shelves) {
        if (this.canFitInShelf(rect, shelf)) {
          this.placeInShelf(rect, shelf);
          placed = true;
          break;
        }
      }
      
      // Create new shelf if doesn't fit
      if (!placed) {
        const newShelf = this.createNewShelf(rect);
        if (newShelf) {
          this.placeInShelf(rect, newShelf);
        } else {
          // Can't fit at all
          rect.fitted = false;
          this.packedRectangles.push({ ...rect, x: -1, y: -1 });
        }
      }
    }
    
    return this.packedRectangles;
  }
  
  canFitInShelf(rect, shelf) {
    return (
      rect.width <= this.containerWidth - shelf.currentX &&
      rect.height <= shelf.height
    );
  }
  
  placeInShelf(rect, shelf) {
    rect.x = shelf.currentX;
    rect.y = shelf.y;
    shelf.currentX += rect.width;
    rect.fitted = true;
    this.packedRectangles.push(rect);
  }
  
  createNewShelf(rect) {
    const lastShelf = this.shelves[this.shelves.length - 1];
    const newShelfY = lastShelf.y + lastShelf.height;
    
    if (newShelfY + rect.height > this.containerHeight) {
      return null; // No vertical space
    }
    
    const newShelf = {
      y: newShelfY,
      currentX: 0,
      height: rect.height
    };
    
    this.shelves.push(newShelf);
    return newShelf;
  }
}
