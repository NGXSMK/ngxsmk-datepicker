const fs = require('fs');
const cssPath = 'projects/ngxsmk-datepicker/src/lib/styles/datepicker.css';
let css = fs.readFileSync(cssPath, 'utf8');

// Replace all 1023px with 1024px
css = css.replace(/1023px/g, '1024px');

// Since we replaced 1023 with 1024, the old 'min-width: 1024px' overlaps with 'max-width: 1024px'. 
// We should update 'min-width: 1024px' to 'min-width: 1025px', but ONLY for min-width.
css = css.replace(/min-width: 1024px/g, 'min-width: 1025px');

// Also update the comment (768px - 1024px)
css = css.replace(/768px - 1024px/g, '768px - 1024px'); // Wait, the comment was 1023px, so above replaced it.

fs.writeFileSync(cssPath, css);
console.log('Breakpoints updated successfully in components.');
