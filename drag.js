document.addEventListener('DOMContentLoaded', function() {
  const imageContainer = document.getElementById('imageContainer');
  const resetBtn = document.getElementById('resetBtn');
  const addImageBtn = document.getElementById('addImageBtn');
  const toggleCollisionBtn = document.getElementById('toggleCollisionBtn');
  const imageCountElement = document.getElementById('imageCount');
  const collisionCountElement = document.getElementById('collisionCount');

  let images = [];
  let isDragging = false;
  let dragImage = null;
  let dragOffset = { x: 0, y: 0 };
  let collisionDetectionEnabled = true;
  let collisionCount = 0;

  // Sample image URLs (using placeholder images)
  const imageUrls = [
    'https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1557683316-973673baf926?w-400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&h=300&fit=crop'
  ];

  // Initialize with some images
  function initImages() {
    // Clear existing images
    images = [];
    imageContainer.innerHTML = '';
    collisionCount = 0;
    updateCollisionCount();

    // Create initial images
    for (let i = 0; i < 5; i++) {
      addImageToContainer();
    }

    updateImageCount();
  }

  // Add a new image to the container
  function addImageToContainer() {
    const img = document.createElement('img');
    const randomIndex = Math.floor(Math.random() * imageUrls.length);

    // Set random size for the image
    const width = 120 + Math.floor(Math.random() * 100);
    const height = 90 + Math.floor(Math.random() * 80);

    img.src = `${imageUrls[randomIndex]}&w=${width}&h=${height}`;
    img.className = 'draggable-image';
    img.draggable = false;

    // Set random position (with boundaries)
    const maxX = imageContainer.clientWidth - width - 20;
    const maxY = imageContainer.clientHeight - height - 20;

    let posX, posY;
    let attempts = 0;
    const maxAttempts = 50;

    // Try to find a non-overlapping position
    do {
      posX = 20 + Math.floor(Math.random() * maxX);
      posY = 20 + Math.floor(Math.random() * maxY);
      attempts++;

      if (attempts >= maxAttempts) {
        // If we can't find a non-overlapping position, just place it
        break;
      }
    } while (checkCollisionAtPosition(posX, posY, width, height, null));

    img.style.width = `${width}px`;
    img.style.height = `${height}px`;
    img.style.left = `${posX}px`;
    img.style.top = `${posY}px`;

    // Store image data
    const imageData = {
      element: img,
      x: posX,
      y: posY,
      width: width,
      height: height,
      id: Date.now() + Math.random()
    };

    images.push(imageData);

    // Add event listeners for dragging
    img.addEventListener('mousedown', startDrag);
    img.addEventListener('touchstart', startDragTouch, { passive: false });

    imageContainer.appendChild(img);
    updateImageCount();
  }

  // Check if a position would cause collision with other images
  function checkCollisionAtPosition(x, y, width, height, excludeImage) {
    for (const image of images) {
      if (excludeImage && image.id === excludeImage.id) continue;

      if (x < image.x + image.width &&
        x + width > image.x &&
        y < image.y + image.height &&
        y + height > image.y) {
        return image; // Collision detected
      }
    }
    return false; // No collision
  }

  // Resolve collisions by pushing images away
  function resolveCollisions(movingImage) {
    if (!collisionDetectionEnabled) return;

    let hasCollisions = false;
    let movedImages = new Set();

    // Function to recursively resolve collisions
    function resolveRecursive(image) {
      // Check for collisions with this image
      const collidingImage = checkCollisionAtPosition(
        image.x, image.y, image.width, image.height, image
      );

      if (collidingImage && !movedImages.has(collidingImage.id)) {
        hasCollisions = true;
        movedImages.add(collidingImage.id);

        // Calculate push direction
        const dx = collidingImage.x - image.x;
        const dy = collidingImage.y - image.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) {
          // If images are exactly on top of each other, push randomly
          collidingImage.x += 10;
          collidingImage.y += 10;
        } else {
          // Push the colliding image away
          const pushDistance = 15;
          collidingImage.x += (dx / distance) * pushDistance;
          collidingImage.y += (dy / distance) * pushDistance;
        }

        // Keep within container bounds
        keepWithinBounds(collidingImage);

        // Update the element position
        collidingImage.element.style.left = `${collidingImage.x}px`;
        collidingImage.element.style.top = `${collidingImage.y}px`;

        // Recursively check if this push causes new collisions
        resolveRecursive(collidingImage);
      }
    }

    // Start resolution from the moving image
    resolveRecursive(movingImage);

    // Update collision count
    if (hasCollisions) {
      collisionCount++;
      updateCollisionCount();
    }

    return hasCollisions;
  }

  // Keep an image within the container bounds
  function keepWithinBounds(image) {
    const containerWidth = imageContainer.clientWidth;
    const containerHeight = imageContainer.clientHeight;

    if (image.x < 5) image.x = 5;
    if (image.y < 5) image.y = 5;
    if (image.x + image.width > containerWidth - 5) {
      image.x = containerWidth - image.width - 5;
    }
    if (image.y + image.height > containerHeight - 5) {
      image.y = containerHeight - image.height - 5;
    }
  }

  // Start dragging (mouse)
  function startDrag(e) {
    e.preventDefault();
    isDragging = true;

    // Find the image data
    const imgElement = e.target;
    dragImage = images.find(img => img.element === imgElement);

    // Calculate offset from mouse to image top-left corner
    dragOffset.x = e.clientX - dragImage.x;
    dragOffset.y = e.clientY - dragImage.y;

    // Add dragging class
    imgElement.classList.add('dragging');

    // Add event listeners for dragging and stopping
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
  }

  // Start dragging (touch)
  function startDragTouch(e) {
    e.preventDefault();
    if (e.touches.length !== 1) return;

    isDragging = true;

    // Find the image data
    const imgElement = e.target;
    dragImage = images.find(img => img.element === imgElement);

    // Calculate offset from touch to image top-left corner
    const touch = e.touches[0];
    dragOffset.x = touch.clientX - dragImage.x;
    dragOffset.y = touch.clientY - dragImage.y;

    // Add dragging class
    imgElement.classList.add('dragging');

    // Add event listeners for dragging and stopping
    document.addEventListener('touchmove', doDragTouch, { passive: false });
    document.addEventListener('touchend', stopDrag);
    document.addEventListener('touchcancel', stopDrag);
  }

  // Perform dragging (mouse)
  function doDrag(e) {
    if (!isDragging || !dragImage) return;

    e.preventDefault();

    // Calculate new position
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // Keep within container bounds
    const containerWidth = imageContainer.clientWidth;
    const containerHeight = imageContainer.clientHeight;

    let boundedX = newX;
    let boundedY = newY;

    if (boundedX < 5) boundedX = 5;
    if (boundedY < 5) boundedY = 5;
    if (boundedX + dragImage.width > containerWidth - 5) {
      boundedX = containerWidth - dragImage.width - 5;
    }
    if (boundedY + dragImage.height > containerHeight - 5) {
      boundedY = containerHeight - dragImage.height - 5;
    }

    // Update position
    dragImage.x = boundedX;
    dragImage.y = boundedY;
    dragImage.element.style.left = `${boundedX}px`;
    dragImage.element.style.top = `${boundedY}px`;

    // Check for collisions and resolve them
    const hasCollision = checkCollisionAtPosition(
      boundedX, boundedY, dragImage.width, dragImage.height, dragImage
    );

    // Highlight if colliding
    if (hasCollision && collisionDetectionEnabled) {
      dragImage.element.classList.add('collision');
    } else {
      dragImage.element.classList.remove('collision');
    }

    // Resolve any collisions
    if (collisionDetectionEnabled) {
      resolveCollisions(dragImage);
    }
  }

  // Perform dragging (touch)
  function doDragTouch(e) {
    if (!isDragging || !dragImage || e.touches.length !== 1) return;

    e.preventDefault();

    // Calculate new position
    const touch = e.touches[0];
    const newX = touch.clientX - dragOffset.x;
    const newY = touch.clientY - dragOffset.y;

    // Keep within container bounds
    const containerWidth = imageContainer.clientWidth;
    const containerHeight = imageContainer.clientHeight;

    let boundedX = newX;
    let boundedY = newY;

    if (boundedX < 5) boundedX = 5;
    if (boundedY < 5) boundedY = 5;
    if (boundedX + dragImage.width > containerWidth - 5) {
      boundedX = containerWidth - dragImage.width - 5;
    }
    if (boundedY + dragImage.height > containerHeight - 5) {
      boundedY = containerHeight - dragImage.height - 5;
    }

    // Update position
    dragImage.x = boundedX;
    dragImage.y = boundedY;
    dragImage.element.style.left = `${boundedX}px`;
    dragImage.element.style.top = `${boundedY}px`;

    // Check for collisions and resolve them
    const hasCollision = checkCollisionAtPosition(
      boundedX, boundedY, dragImage.width, dragImage.height, dragImage
    );

    // Highlight if colliding
    if (hasCollision && collisionDetectionEnabled) {
      dragImage.element.classList.add('collision');
    } else {
      dragImage.element.classList.remove('collision');
    }

    // Resolve any collisions
    if (collisionDetectionEnabled) {
      resolveCollisions(dragImage);
    }
  }

  // Stop dragging
  function stopDrag() {
    if (!isDragging || !dragImage) return;

    // Remove dragging class
    dragImage.element.classList.remove('dragging');
    dragImage.element.classList.remove('collision');

    // Clean up event listeners
    document.removeEventListener('mousemove', doDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', doDragTouch);
    document.removeEventListener('touchend', stopDrag);
    document.removeEventListener('touchcancel', stopDrag);

    isDragging = false;
    dragImage = null;
  }

  // Reset all images to random positions
  function resetPositions() {
    images.forEach(image => {
      const maxX = imageContainer.clientWidth - image.width - 20;
      const maxY = imageContainer.clientHeight - image.height - 20;

      let posX, posY;
      let attempts = 0;
      const maxAttempts = 50;

      // Try to find a non-overlapping position
      do {
        posX = 20 + Math.floor(Math.random() * maxX);
        posY = 20 + Math.floor(Math.random() * maxY);
        attempts++;

        if (attempts >= maxAttempts) {
          break;
        }
      } while (checkCollisionAtPosition(posX, posY, image.width, image.height, image));

      image.x = posX;
      image.y = posY;
      image.element.style.left = `${posX}px`;
      image.element.style.top = `${posY}px`;
      image.element.classList.remove('collision');
    });

    collisionCount = 0;
    updateCollisionCount();
  }

  // Toggle collision detection
  function toggleCollisionDetection() {
    collisionDetectionEnabled = !collisionDetectionEnabled;
    toggleCollisionBtn.textContent = collisionDetectionEnabled 
      ? 'Disable Collision Detection' 
      : 'Enable Collision Detection';

    // Remove collision highlights
    images.forEach(image => {
      image.element.classList.remove('collision');
    });

    if (!collisionDetectionEnabled) {
      collisionCount = 0;
      updateCollisionCount();
    }
  }

  // Update image count display
  function updateImageCount() {
    imageCountElement.textContent = images.length;
  }

  // Update collision count display
  function updateCollisionCount() {
    collisionCountElement.textContent = collisionCount;
  }

  // Event listeners for buttons
  resetBtn.addEventListener('click', resetPositions);
  addImageBtn.addEventListener('click', addImageToContainer);
  toggleCollisionBtn.addEventListener('click', toggleCollisionDetection);

  // Initialize images
  initImages();

  // Handle window resize
  window.addEventListener('resize', function() {
    // Keep all images within bounds when window is resized
    images.forEach(image => {
      keepWithinBounds(image);
      image.element.style.left = `${image.x}px`;
      image.element.style.top = `${image.y}px`;
    });
  });
});

