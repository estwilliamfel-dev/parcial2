/**
 * Universidad - Facultad de Ingeniería
 * Asignatura: Introducción a la Computación Gráfica
 * * Estudiante: William Felipe Torres Varela
 * * Tarea: Implementar los algoritmos de rasterización manual.
 */

// Función de apoyo para dibujar un píxel individual
function drawPixel(ctx, x, y, color = "#000000") {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
}

/**
 * Implementación del algoritmo de Bresenham para líneas.
 */
function bresenhamLine(ctx, x0, y0, x1, y1, color = "#000000") { 
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    
    let err = dx - dy; 

    while (true) {
        drawPixel(ctx, x0, y0, color);

        
        if (x0 === x1 && y0 === y1) break;

        let e2 = 2 * err;

        if (e2 > -dy) { 
            err -= dy; 
            x0 += sx; 
        }

        if (e2 < dx) { 
            err += dx; 
            y0 += sy; 
        }
    }
}

/**
 *  Esto va a dibujar los 8 puntos simétricos de una circunferencia
 */
function drawCirclePoints(ctx, xc, yc, x, y, color) {
    drawPixel(ctx, xc + x, yc + y, color);
    drawPixel(ctx, xc - x, yc + y, color);
    drawPixel(ctx, xc + x, yc - y, color);
    drawPixel(ctx, xc - x, yc - y, color);
    drawPixel(ctx, xc + y, yc + x, color);
    drawPixel(ctx, xc - y, yc + x, color);
    drawPixel(ctx, xc + y, yc - x, color);
    drawPixel(ctx, xc - y, yc - x, color);
}

/**
 *  Algoritmo del Punto Medio para circunferencias
 */
function midpointCircle(ctx, xc, yc, radius, color = "#000000") {
    let x = 0;
    let y = radius;
    
    let p = 1 - radius; 

    drawCirclePoints(ctx, xc, yc, x, y, color);

    while (x < y) {
        x++;
        if (p < 0) {
            p += 2 * x + 1;
        } else {
            y--;
            p += 2 * (x - y) + 1;
        }
        drawCirclePoints(ctx, xc, yc, x, y, color);
    }
}

/**
 * Calcula los vértices de un polígono regular.
 */
function getPolygonVertices(centerX, centerY, sides, radius) {
    const vertices = [];
    
    const angleStep = (2 * Math.PI) / sides;

    for (let i = 0; i < sides; i++) {
        let currentAngle = (i * angleStep) - (Math.PI / 2);
        
        let x = centerX + radius * Math.cos(currentAngle);
        let y = centerY + radius * Math.sin(currentAngle);
        
        vertices.push({ 
            x: Math.round(x), 
            y: Math.round(y) 
        });
    }
    
    return vertices;
}

/**
 * Lógica principal ejecutada al cargar la página
 */
window.onload = function() {
    const canvas = document.getElementById("lienzo");
    const ctx = canvas.getContext("2d");

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const R = 150;
    const rCirculo = Math.floor(R / 4);
    
    const n = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
    
    console.log(`Generando polígono de ${n} lados.`);

    const vertices = getPolygonVertices(centerX, centerY, n, R);

    for (let i = 0; i < vertices.length; i++) {
        let p1 = vertices[i];
        let p2 = vertices[(i + 1) % vertices.length]; 
        
        bresenhamLine(ctx, p1.x, p1.y, p2.x, p2.y, "#0000FF");
    }

    for (let i = 0; i < vertices.length; i++) {
        let v = vertices[i];
        midpointCircle(ctx, v.x, v.y, rCirculo, "#FF0000");
    }
};