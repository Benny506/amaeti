import sys

with open('src/index.css', 'r') as f:
    lines = f.readlines()

new_lines = lines[:741] # Keep lines up to the start of the block

css = """
/* =========================================
   GSAP 2-COLUMN PINNED GALLERY
   ========================================= */
.gallery-container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: var(--color-bg-dark);
}

.gallery-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex; /* Split into 2 columns */
  flex-direction: row;
  will-change: transform;
  pointer-events: none;
}

.gallery-panel.active-panel {
  pointer-events: auto;
}

/* Individual Column */
.gallery-panel-col {
  width: 50%; /* 50/50 split */
  height: 100vh;
  position: relative;
  overflow: hidden;
  will-change: transform;
}

/* Optional subtle border between columns */
.gallery-panel-col:first-child {
  border-right: 1px solid rgba(255,255,255,0.05);
}

/* Image Wrapper for Parallax */
.panel-img-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120vh; /* Taller for parallax room */
  will-change: transform;
  z-index: 1;
}

.panel-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* The Editorial Scrim (Gradient Bottom) */
.panel-scrim {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50vh; /* Only the bottom 50% gets darkened */
  background: linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.6) 40%, transparent 100%);
  z-index: 2;
  pointer-events: none;
}

/* Typography Container */
.panel-content {
  position: absolute;
  bottom: 5vh; /* Push to the very bottom */
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  text-align: center;
  z-index: 3;
  color: var(--color-text-light);
  padding: 0 5%;
}

/* Typographic Elements */
.reveal-item {
  will-change: transform, opacity;
}

.panel-title {
  font-family: 'Cinzel Decorative', serif; 
  font-size: clamp(2rem, 4vw, 4rem); /* Slightly smaller since it's 50% width */
  line-height: 1.1;
  font-weight: 400;
  margin-bottom: 0;
  text-shadow: 0 4px 20px rgba(0,0,0,0.6);
}

.luxe-btn-light {
  color: var(--color-text-dark);
  background: var(--color-text-light);
}

.luxe-btn-light:hover {
  background: transparent;
  color: var(--color-text-light);
  border-color: var(--color-text-light);
}
"""

with open('src/index.css', 'w') as f:
    f.writelines(new_lines)
    f.write(css)

