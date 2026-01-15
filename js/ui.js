// ui.js - Módulo para renderizado dinámico de la interfaz



function escaparHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(precio);
}

/**
 * Renderiza las tarjetas de sesiones en el DOM
 */
export function renderizarSesiones(container, sesiones, callback) {

    if (!container || !Array.isArray(sesiones)) {
        console.error('Parámetros inválidos en renderizarSesiones');
        return;
    }

    if (sesiones.length === 0) {
        container.innerHTML = '<p>No hay sesiones disponibles</p>';
        return;
    }

    container.innerHTML = '<div class="cuadricula-sesiones"></div>';
    const grid = container.querySelector('.cuadricula-sesiones');

    sesiones.forEach(sesion => {

        // Validar sesión antes de renderizar
        if (!sesion || !sesion.id || !sesion.nombre) {
            console.warn('Sesión inválida omitida:', sesion);
            return;
        }
        // Imagen por defecto si no existe
        const imagenSrc = sesion.image || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
        //Crear la tarjeta
        const card = document.createElement('div');
        card.className = 'tarjeta-sesion';
        // Usar innerHTML con datos escapados para prevenir XSS
        card.innerHTML = `
            <div class="contenedor-imagen-tarjeta">
                <img src="${escaparHTML(imagenSrc)}" alt="${escaparHTML(sesion.nombre)}" class="imagen-tarjeta">
                <div class="insignia-precio-tarjeta">${formatearPrecio(sesion.precio)}</div>
            </div>
            
            <div class="contenido-tarjeta">
                <h3>${escaparHTML(sesion.nombre)}</h3>
                <p class="descripcion-tarjeta">${escaparHTML(sesion.descripcion)}</p>
                
                <div class="meta-tarjeta">
                    <div class="item-meta">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span>${escaparHTML(sesion.duracion)}</span>
                    </div>
                    <div class="item-meta">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        <span>${escaparHTML(sesion.instructor || 'Por asignar')}</span>
                    </div>
                </div>

                <button class="boton-agregar-carrito" data-id="${sesion.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                    Agregar al Carrito
                </button>
            </div>
        `;

        // Agregar evento al botón
        const btn = card.querySelector('.boton-agregar-carrito');
        btn.addEventListener('click', () => {
            if (callback) callback(sesion);
        });

        grid.appendChild(card);
    });
}

/**
 * Renderiza el carrito de compras en el modal lateral
 */
export function renderizarCarrito(carrito, callbackEliminar, callbackCantidad) {
    const container = document.getElementById('contenedor-items-carrito');
    const footer = document.getElementById('pie-carrito');
    const totalEl = document.getElementById('monto-total-carrito');

    // Primero comprobamos que los elementos existen
    if (!container || !footer || !totalEl) {
        console.error("Elementos del carrito no encontrados en el DOM");
        return;
    }

    container.innerHTML = ''; // Limpiar

    if (carrito.length === 0) {
        container.innerHTML = `
            <div class="estado-carrito-vacio">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icono-vacio"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <p>Tu carrito está vacío</p>
            </div>
        `;
        footer.classList.add('oculto');
        return;
    }

    footer.classList.remove('oculto');

    // Renderizar items
    carrito.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'tarjeta-item-carrito';
        const cantidad = item.cantidad || 1;
        const subtotal = (item.precio || 0) * cantidad;
        itemEl.innerHTML = `
            <div class="encabezado-item-carrito">
                <h3>${escaparHTML(item.nombre || 'Sin nombre')}</h3>
                <button class="boton-eliminar" data-id="${item.id}" aria-label="Eliminar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
            </div>
            
            <p class="meta-item-carrito">${escaparHTML(item.duracion || 'N/A')}</p>
            
            <div class="controles-item-carrito">
                <div class="controles-cantidad">
                    <button class="boton-cantidad btn-menos" data-id="${item.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>
                    </button>
                    <span class="cantidad-display">${escaparHTML(item.cantidad || 1)}</span>
                    <button class="boton-cantidad btn-mas" data-id="${item.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    </button>
                </div>
                <span class="precio-item">${formatearPrecio(subtotal)}</span>
            </div>
        `;

        // Event listeners
        itemEl.querySelector('.boton-eliminar').addEventListener('click', () => callbackEliminar(item.id));

        itemEl.querySelector('.btn-menos').addEventListener('click', () => {
            const nuevaCantidad = (item.cantidad || 1) - 1;
            if (nuevaCantidad > 0) {
                callbackCantidad(item.id, nuevaCantidad);
            } else {
                callbackEliminar(item.id);
            }
        });

        itemEl.querySelector('.btn-mas').addEventListener('click', () => {
            callbackCantidad(item.id, (item.cantidad || 1) + 1);
        });

        container.appendChild(itemEl);
    });

    // Calcular total
    const total = carrito.reduce((sum, item) => sum + (item.precio * (item.cantidad || 1)), 0);
    totalEl.textContent = `${formatearPrecio(total)}`;
}

/**
 * Muestra un indicador de carga
 */
export function mostrarCargando(container) {
    container.innerHTML = `
        <div class="cargando">
            <div class="cargador-circular"></div>
            <p style="color: #9ca3af;">Cargando sesiones...</p>
        </div>
    `;
}