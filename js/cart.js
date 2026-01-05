// carrito.js - Módulo para gestión del carrito con localStorage

const CARRITO_KEY = 'carrito_espiritual';

/**
 * Obtiene el carrito desde localStorage
 * devuelve un Array con los items del carrito
 */
export function obtenerCarrito() {
    try {
        const carrito = localStorage.getItem(CARRITO_KEY);
        return carrito ? JSON.parse(carrito) : [];
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        return [];
    }
}

/**
 * Guarda el carrito en localStorage
 */
export function guardarCarrito(carrito) {
    try {
        localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
    } catch (error) {
        console.error('Error al guardar carrito:', error);
    }
}

/**
 * Agrega una sesión al carrito o incrementa su cantidad
 */
export function agregarAlCarrito(sesion) {
    const carrito = obtenerCarrito();
    const existe = carrito.find(item => item.id === sesion.id);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ ...sesion, cantidad: 1 });
    }

    guardarCarrito(carrito);
}



/**
 * Elimina una sesión del carrito
 */
export function eliminarDelCarrito(id) {
    const carrito = obtenerCarrito();
    const nuevoCarrito = carrito.filter(item => item.id !== id);
    guardarCarrito(nuevoCarrito);
}

/**
 * Vacía completamente el carrito
 */
export function vaciarCarrito() {
    guardarCarrito([]);
}

/**
 * Calcula el total del carrito
 */
export function calcularTotal(carrito) {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}