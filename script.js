/**
 * Universidad Militar Nueva Granada - Facultad de Ingeniería
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
function bresenhamLine(ctx,x0, y0, x1, y1, color = "#000000") {
    // Diferencias absolutas para determinar la dirección principal de avance
    // dx y dy representan la distancia horizontal y vertical entre el punto inicial y final de la línea. 
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    
    // Direcciones de paso (1 o -1) dependiendo de hacia dónde va la línea
    //sx y sy indican la dirección en la que se debe avanzar: +1 si va hacia la derecha/abajo, -1 si va hacia la izquierda/arriba. 
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    
    // Parámetro de decisión inicial (error). 
    // Matemáticamente, evalúa la distancia entre la línea ideal y los píxeles reales.
    //err es el "error acumulado", que mide qué tan lejos estamos de la línea ideal en cada paso.
    let err = dx - dy; 

    while (true) {
        drawPixel(ctx, x0, y0, color);

        // Condición de parada: llegamos al punto final
        if (Math.abs(x0 - x1) < 0.1 && Math.abs(y0 - y1) < 0.1) break;

        // Se calcula 2 * error para evitar el uso de punto flotante en la toma de decisiones
        let e2 = 2 * err;

        // Ajuste del error y avance en X (Octantes donde la pendiente es menor a 1)
        // Si el error indica que estamos más lejos en X, avanzamos horizontalmente.
        if (e2 > -dy) { 
            err -= dy; 
            x0 += sx; 
        }
        // Ajuste del error y avance en Y (Octantes donde la pendiente es mayor a 1)
        //Si el error indica que estamos más lejos en Y, avanzamos verticalmente.
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
    
    // Parámetro de decisión inicial: p = 5/4 - r (aproximado a 1 - r para enteros)
    let p = 1 - radius; 

    drawCirclePoints(ctx, xc, yc, x, y, color);

    while (x < y) {
        x++;
        // Si p < 0, el punto medio está dentro del círculo, el píxel en Y se mantiene.
        if (p < 0) {
            p += 2 * x + 1;
        } 
        // Si p >= 0, el punto medio está fuera, debemos reducir Y.
        else {
            y--;
            p += 2 * (x - y) + 1;
        }
        drawCirclePoints(ctx, xc, yc, x, y, color);
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
    const vertices = [];
    
    // El círculo completo tiene 2 * PI radianes. 
    // Entonces dividimos eso por el número de lados para saber cuánto rotar en cada paso.
    const angleStep = (2 * Math.PI) / sides;

    // Usamos un bucle para calcular cada punto (x, y)
    for (let i = 0; i < sides; i++) {
        // Calculamos el ángulo actual (restamos PI/2 para que el primer punto esté arriba)
        let currentAngle = (i * angleStep) - (Math.PI / 2);
        
        // Fórmulas de conversión de coordenadas polares a cartesianas:
        // x = centro + radio * cos(ángulo)
        // y = centro + radio * sin(ángulo)
        let x = centerX + radius * Math.cos(currentAngle);
        let y = centerY + radius * Math.sin(currentAngle);
        
        // Guardamos el objeto {x, y} en el arreglo, redondeando para el dibujo de píxeles
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

    // Parámetros principales del lienzo y figura
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const R = 150; // Radio del polígono
    const rCirculo = Math.floor(R / 4); // Radio de las circunferencias (R/4)
    
    // Número aleatorio de lados entre 5 y 10
    const n = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
    
    console.log(`Generando polígono de ${n} lados.`);

    //Obtener vértices
    const vertices = getPolygonVertices(centerX, centerY, n, R);

    //Dibujar líneas del polígono usando Bresenham
    for (let i = 0; i < vertices.length; i++) {
        let p1 = vertices[i];
        // Conectar con el siguiente vértice, y el último con el primero
        let p2 = vertices[(i + 1) % vertices.length]; 
        
        bresenhamLine(ctx, p1.x, p1.y, p2.x, p2.y, "#0000FF"); // Líneas azules
    }

    // Dibujar las circunferencias en cada vértice
    for (let i = 0; i < vertices.length; i++) {
        let v = vertices[i];
        midpointCircle(ctx, v.x, v.y, rCirculo, "#FF0000"); // Círculos rojos
    }
};