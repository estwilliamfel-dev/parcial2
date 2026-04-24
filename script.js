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
 * @param {number} x0, y0 - Coordenadas iniciales
 * @param {number} x1, y1 - Coordenadas finales
 * @returns {void}
 */
function bresenhamLine(x0, y0, x1, y1, color = "#000000") {
    // Diferencias absolutas para determinar la dirección principal de avance
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    
    // Direcciones de paso (1 o -1) dependiendo de hacia dónde va la línea
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    
    // Parámetro de decisión inicial (error). 
    // Matemáticamente, evalúa la distancia entre la línea ideal y los píxeles reales.
    let err = dx - dy; 

    while (true) {
        drawPixel(ctx, x0, y0, color);

        // Condición de parada: llegamos al punto final
        if (Math.abs(x0 - x1) < 0.1 && Math.abs(y0 - y1) < 0.1) break;

        // Se calcula 2 * error para evitar el uso de punto flotante en la toma de decisiones
        let e2 = 2 * err;

        // Ajuste del error y avance en X (Octantes donde la pendiente es menor a 1)
        if (e2 > -dy) { 
            err -= dy; 
            x0 += sx; 
        }
        // Ajuste del error y avance en Y (Octantes donde la pendiente es mayor a 1)
        if (e2 < dx) { 
            err += dx; 
            y0 += sy; 
        }
    }
}

/**
 * Calcula los vértices de un polígono regular.
 * @param {number} centerX, centerY - Centro
 * @param {number} sides - Número de lados
 * @param {number} radius - Radio
 * @returns {Array} Arreglo de objetos {x, y}
 */
function getPolygonVertices(centerX, centerY, sides, radius) {
    // Desarrollo del estudiante (Uso de Math.sin/Math.cos y retorno de datos)
}
