// Generate PWA icons using Node.js and Canvas
const fs = require('fs');
const path = require('path');

// Simple SVG to PNG generator using base64 for icons
const generateIcon = (size, filename) => {
    // Create a simple SVG icon for NutriConnect
    const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#2E7D32;stop-opacity:1" />
            </linearGradient>
        </defs>
        
        <!-- Background with rounded corners -->
        <rect x="0" y="0" width="${size}" height="${size}" rx="${size * 0.15}" ry="${size * 0.15}" fill="url(#grad)"/>
        
        <!-- Main leaf/nutrition symbol -->
        <ellipse cx="${size/2}" cy="${size/2 - size*0.05}" rx="${size*0.18}" ry="${size*0.24}" fill="white"/>
        
        <!-- Leaf vein -->
        <line x1="${size/2}" y1="${size/2 - size*0.24}" x2="${size/2}" y2="${size/2 + size*0.18}" 
              stroke="white" stroke-width="${size*0.015}"/>
        
        <!-- Nutrition symbols (small circles) -->
        <circle cx="${size/2 - size*0.18}" cy="${size/2 - size*0.12}" r="${size*0.025}" fill="white"/>
        <circle cx="${size/2 + size*0.15}" cy="${size/2 - size*0.06}" r="${size*0.025}" fill="white"/>
        <circle cx="${size/2 - size*0.09}" cy="${size/2 + size*0.15}" r="${size*0.025}" fill="white"/>
        <circle cx="${size/2 + size*0.06}" cy="${size/2 + size*0.18}" r="${size*0.025}" fill="white"/>
        
        ${size >= 128 ? `<text x="${size/2}" y="${size/2 + size*0.3}" font-family="Arial, sans-serif" 
                        font-size="${size*0.08}" font-weight="bold" text-anchor="middle" fill="white">NC</text>` : ''}
    </svg>
    `;

    // Convert SVG to base64 data URL
    const base64 = Buffer.from(svg).toString('base64');
    const dataUrl = `data:image/svg+xml;base64,${base64}`;
    
    return { svg, dataUrl, size, filename };
};

// Icon sizes to generate
const iconSizes = [
    { size: 72, name: 'icon-72x72.png' },
    { size: 96, name: 'icon-96x96.png' },
    { size: 128, name: 'icon-128x128.png' },
    { size: 144, name: 'icon-144x144.png' },
    { size: 152, name: 'icon-152x152.png' },
    { size: 192, name: 'icon-192x192.png' },
    { size: 384, name: 'icon-384x384.png' },
    { size: 512, name: 'icon-512x512.png' }
];

// Create the icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('🎨 Generating NutriConnect PWA Icons...');

// Generate all icons
iconSizes.forEach(iconData => {
    const icon = generateIcon(iconData.size, iconData.name);
    
    // Write SVG file (can be used directly as fallback)
    const svgPath = path.join(iconsDir, iconData.name.replace('.png', '.svg'));
    fs.writeFileSync(svgPath, icon.svg);
    
    console.log(`✅ Generated ${iconData.name} (${iconData.size}x${iconData.size})`);
});

// Generate shortcut icons
const shortcuts = [
    { name: 'shortcut-book.png', emoji: '📅', color: '#2196F3', text: 'Book' },
    { name: 'shortcut-progress.png', emoji: '📊', color: '#FF9800', text: 'Track' },
    { name: 'shortcut-diet.png', emoji: '🥗', color: '#4CAF50', text: 'Diet' }
];

shortcuts.forEach(shortcut => {
    const svg = `
    <svg width="96" height="96" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="96" height="96" rx="14" ry="14" fill="${shortcut.color}"/>
        <text x="48" y="60" font-family="Arial, sans-serif" font-size="40" text-anchor="middle">${shortcut.emoji}</text>
    </svg>
    `;
    
    const svgPath = path.join(iconsDir, shortcut.name.replace('.png', '.svg'));
    fs.writeFileSync(svgPath, svg);
    
    console.log(`✅ Generated ${shortcut.name} (shortcut icon)`);
});

// Create a favicon.ico equivalent
const faviconSvg = generateIcon(32, 'favicon.svg');
fs.writeFileSync(path.join(__dirname, 'public', 'favicon.svg'), faviconSvg.svg);

console.log('✅ Generated favicon.svg');

// Generate placeholder screenshots
const screenshotsDir = path.join(__dirname, 'public', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Desktop screenshot placeholder
const desktopScreenshot = `
<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
    <rect width="1280" height="720" fill="#f5f5f5"/>
    <rect x="40" y="40" width="1200" height="640" fill="white" rx="10"/>
    <rect x="40" y="40" width="1200" height="80" fill="#4CAF50" rx="10 10 0 0"/>
    <text x="640" y="90" font-family="Arial, sans-serif" font-size="32" font-weight="bold" 
          text-anchor="middle" fill="white">NutriConnect Dashboard</text>
    <text x="640" y="400" font-family="Arial, sans-serif" font-size="24" 
          text-anchor="middle" fill="#666">Your Personal Nutrition Companion</text>
</svg>
`;

fs.writeFileSync(path.join(screenshotsDir, 'desktop-screenshot.svg'), desktopScreenshot);

// Mobile screenshot placeholder
const mobileScreenshot = `
<svg width="390" height="844" xmlns="http://www.w3.org/2000/svg">
    <rect width="390" height="844" fill="#f5f5f5"/>
    <rect x="20" y="60" width="350" height="760" fill="white" rx="20"/>
    <rect x="20" y="60" width="350" height="100" fill="#4CAF50" rx="20 20 0 0"/>
    <text x="195" y="120" font-family="Arial, sans-serif" font-size="20" font-weight="bold" 
          text-anchor="middle" fill="white">NutriConnect</text>
    <text x="195" y="450" font-family="Arial, sans-serif" font-size="16" 
          text-anchor="middle" fill="#666">Mobile View</text>
</svg>
`;

fs.writeFileSync(path.join(screenshotsDir, 'mobile-screenshot.svg'), mobileScreenshot);

console.log('✅ Generated screenshot placeholders');

console.log(`
🎉 PWA Icons Generation Complete!

📁 Generated files in /public/icons/:
${iconSizes.map(icon => `   • ${icon.name}`).join('\n')}

📱 Shortcut icons:
   • shortcut-book.svg
   • shortcut-progress.svg  
   • shortcut-diet.svg

📸 Screenshot placeholders:
   • desktop-screenshot.svg
   • mobile-screenshot.svg

🌟 Additional files:
   • favicon.svg

💡 Note: SVG files are generated as they're more scalable. For production, 
   consider converting them to PNG using tools like sharp or imagemagick.

Next steps:
1. Add PWA meta tags to your HTML
2. Configure service worker
3. Test "Add to Home Screen" functionality
`);