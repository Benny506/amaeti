const fs = require('fs');
const svg = fs.readFileSync('src/assets/logo.svg', 'utf8');

let jsx = `import React from 'react';
import { motion } from 'framer-motion';

const AnimatedMonogram = ({ isDrawing, ...props }) => {
  const drawVariants = {
    hidden: customDelay => ({ 
      pathLength: 0, 
      fillOpacity: 0,
      transition: { 
        pathLength: { duration: 5, ease: "easeInOut", delay: 3.5 - customDelay },
        fillOpacity: { duration: 2, ease: "easeOut", delay: 3.5 - customDelay }
      }
    }),
    visible: customDelay => ({ 
      pathLength: 1, 
      fillOpacity: 1, 
      transition: { 
        pathLength: { duration: 5, ease: "easeInOut", delay: customDelay },
        fillOpacity: { duration: 3, ease: "easeIn", delay: customDelay + 4 }
      }
    })
  };

  return (
    <motion.svg viewBox="0 0 1024 1024" {...props}>
`;

const paths = svg.match(/<path[^>]+>/g);
if(paths) {
  paths.forEach((path, i) => {
    if(path.includes('d=""')) return; 
    
    const fillMatch = path.match(/fill="([^"]+)"/);
    const fill = fillMatch ? fillMatch[1] : "#DACAB6";
    
    const transformMatch = path.match(/translate\(([^,]+),/);
    let customDelay = 0;
    if (transformMatch) {
      const x = parseFloat(transformMatch[1]);
      let distanceFromCenter = Math.abs(x - 500);
      let normalizedDist = distanceFromCenter / 400;
      if (normalizedDist > 1) normalizedDist = 1;
      customDelay = (1 - normalizedDist) * 3.5; 
    }
    
    customDelay = Math.max(0, customDelay).toFixed(2);

    let newPath = path.replace('<path', `<motion.path custom={${customDelay}} variants={drawVariants} initial="hidden" animate={isDrawing ? "visible" : "hidden"} stroke="${fill}" strokeWidth="2"`);
    jsx += `      ${newPath}\n`;
  });
}

jsx += `    </motion.svg>
  );
};

export default AnimatedMonogram;
`;

fs.writeFileSync('src/components/ui/AnimatedMonogram.jsx', jsx);
console.log('Generated AnimatedMonogram.jsx with reverse draw logic');
