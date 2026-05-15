// Cyberpunk Mouse Trail Effects (With Silver Cursor)
function initCyberpunkCursor() {
    const cyberTrailContainer = document.getElementById('cyberTrailContainer');
    const silverCursor = document.getElementById('silverCursor');

    if (!cyberTrailContainer) return;

    // Create cursor dot for silver cursor
    if (silverCursor) {
        const cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        silverCursor.appendChild(cursorDot);
    }

    const colors = ['cyan', 'blue', 'purple'];
    const shapes = ['dot', 'line', 'pixel'];
    let mouseX = 0;
    let mouseY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let trailParticles = [];
    let isMouseInWindow = false;
    let cursorTimeout;
    const maxParticles = 10;
    const particleLife = 400;

    function createParticle() {
        const dx = mouseX - lastMouseX;
        const dy = mouseY - lastMouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 8) return;

        const particle = document.createElement('div');
        particle.className = `cyber-particle ${colors[Math.floor(Math.random() * colors.length)]} ${shapes[Math.floor(Math.random() * shapes.length)]}`;
        const size = Math.random() * 5 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = mouseX - size / 2 + 'px';
        particle.style.top = mouseY - size / 2 + 'px';

        if (particle.classList.contains('line')) {
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            particle.style.transform = `rotate(${angle}deg)`;
            particle.style.width = (size * 1.5) + 'px';
            particle.style.height = '2px';
        }

        cyberTrailContainer.appendChild(particle);
        trailParticles.push({ element: particle, createdAt: Date.now() });

        if (trailParticles.length > maxParticles) {
            const oldest = trailParticles.shift();
            oldest.element.remove();
        }

        animateParticle(particle);
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }

    function animateParticle(particle) {
        let opacity = 1, scale = 1;
        const startTime = Date.now();
        function animate() {
            const progress = Math.min((Date.now() - startTime) / particleLife, 1);
            opacity = 1 - progress;
            scale = 1 + progress * 0.3;
            particle.style.opacity = opacity;
            particle.style.transform = `scale(${scale})`;
            if (progress < 1) requestAnimationFrame(animate);
            else { particle.remove(); trailParticles = trailParticles.filter(p => p.element !== particle); }
        }
        animate();
    }

    function createDataStream() {
        if (trailParticles.length < 2) return;
        const recent = trailParticles.slice(-3);
        for (let i = 0; i < recent.length - 1; i++) {
            const p1 = recent[i], p2 = recent[i+1];
            const stream = document.createElement('div');
            stream.className = 'cyber-data-stream';
            const x1 = parseFloat(p1.element.style.left) + 3, y1 = parseFloat(p1.element.style.top) + 3;
            const x2 = parseFloat(p2.element.style.left) + 3, y2 = parseFloat(p2.element.style.top) + 3;
            const length = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
            const angle = Math.atan2(y2-y1, x2-x1) * 180 / Math.PI;
            stream.style.left = x1 + 'px';
            stream.style.top = y1 + 'px';
            stream.style.width = length + 'px';
            stream.style.transform = `rotate(${angle}deg)`;
            stream.style.transformOrigin = 'left center';
            cyberTrailContainer.appendChild(stream);
            setTimeout(() => stream.remove(), 100);
        }
    }

    function trailLoop() {
        createParticle();
        if (Math.random() > 0.75) createDataStream();
        requestAnimationFrame(trailLoop);
    }

    function showCursor() {
        if (silverCursor) {
            silverCursor.classList.add('visible');
        }
        clearTimeout(cursorTimeout);
    }

    function hideCursor() {
        if (silverCursor) {
            silverCursor.classList.remove('visible');
        }
    }

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (silverCursor) {
            silverCursor.style.left = (mouseX - 10) + 'px';
            silverCursor.style.top = (mouseY - 10) + 'px';
        }

        if (!isMouseInWindow) {
            isMouseInWindow = true;
            showCursor();
        }

        clearTimeout(cursorTimeout);
        cursorTimeout = setTimeout(() => {
            if (silverCursor) {
                silverCursor.classList.remove('visible');
            }
        }, 1500);
    });

    window.addEventListener('mouseenter', () => {
        isMouseInWindow = true;
        showCursor();
    });

    window.addEventListener('mouseleave', () => {
        isMouseInWindow = false;
        hideCursor();
    });

    trailLoop();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initCyberpunkCursor);