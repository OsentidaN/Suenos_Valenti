// main.js - Módulo coordinador principal de la aplicación

import { cargarSesiones } from './api.js';
import { renderizarSesiones, renderizarCarrito, mostrarCargando } from './ui.js';
import {
    obtenerCarrito,
    guardarCarrito,
    eliminarDelCarrito,
    vaciarCarrito,
    agregarAlCarrito,
    calcularTotal
} from './cart.js';
import { obtenerPreferencias, guardarPreferencias } from './utils.js';

// Estado de la aplicación
let sesiones = [];

// Elementos del DOM
const vistas = {
    inicio: document.getElementById('vista-inicio'),
    sesiones: document.getElementById('vista-sesiones'),
    carrito: document.getElementById('vista-carrito'),
    preferencias: document.getElementById('vista-preferencias')
};

/**
 * Cambia la vista activa de la aplicación
 */
function cambiarVista(nombreVista) {
    Object.keys(vistas).forEach(key => {
        vistas[key].classList.remove('activa');
    });
    vistas[nombreVista].classList.add('activa');
}

// Hacer la función global para que pueda ser llamada desde onclick en HTML
window.cambiarVistaGlobal = cambiarVista;



/**
 * Inicializa y carga las sesiones desde el JSON
 */
async function inicializarSesiones() {
    const container = document.getElementById('contenedor-sesiones');
    mostrarCargando(container);

    try {
        sesiones = await cargarSesiones();
        mostrarSesiones();
    } catch (error) {
        container.innerHTML = '<p style="text-align:center; color: #ef4444;">Error al cargar las sesiones</p>';
    }
}

// Función para mostrar sesiones 
function mostrarSesiones() {

    const container = document.getElementById('contenedor-sesiones');
    renderizarSesiones(container, sesiones, agregarSesionAlCarrito); // Muestra todas las sesiones directamente
}

// ========== LÓGICA DEL CARRITO ==========

function actualizarBadgeCarrito() {
    const carrito = obtenerCarrito();
    const totalItems = carrito.reduce((acc, item) => acc + (item.cantidad || 1), 0);
    const badge = document.getElementById('insignia-carrito');
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    document.querySelectorAll('.insignia').forEach(el => el.textContent = totalItems);
}

function mostrarCarrito() {
    const carrito = obtenerCarrito();
    renderizarCarrito(
        carrito,
        // Callback Eliminar
        (id) => {
            eliminarDelCarrito(id);
            mostrarCarrito(); // Re-render
            actualizarBadgeCarrito();
        },
        // Callback Cantidad
        (id, cantidad) => {
            const item = carrito.find(i => i.id === id);
            if (item) item.cantidad = cantidad;
            guardarCarrito(carrito);
            mostrarCarrito();
            actualizarBadgeCarrito();
        },
        // Callback Vaciar
        () => {
            if (confirm('¿Deseas vaciar todo el carrito?')) {
                vaciarCarrito();
                mostrarCarrito();
                actualizarBadgeCarrito();
            }
        }
    );
    const overlay = document.getElementById('modal-carrito');
    if (overlay) overlay.classList.add('mostrar');
}

function ocultarCarritoModal() {
    const overlay = document.getElementById('modal-carrito');
    if (overlay) overlay.classList.remove('mostrar');
}

/**
 * Agrega una sesión al carrito
 */
function agregarSesionAlCarrito(sesion) {
    const carrito = obtenerCarrito();
    const existe = carrito.find(i => i.id === sesion.id);
    if (existe) {
        existe.cantidad = (existe.cantidad || 1) + 1;
    } else {
        sesion.cantidad = 1;
        carrito.push(sesion);
    }

    guardarCarrito(carrito);
    actualizarBadgeCarrito();
    mostrarCarrito(); // Abrir carrito al agregar
}

/**
 * Inicializa la gestión de preferencias
 */
function inicializarPreferencias() {
    const prefs = obtenerPreferencias();
    const btnTema = document.getElementById('btn-tema');
    const toggleNotif = document.getElementById('interruptor-notificaciones');
    const toggleWrapper = document.getElementById('contenedor-interruptor-notif') || toggleNotif; // Usa el wrapper si existe, sino el elemento

    // Aplicar tema inicial
    const esOscuro = prefs.tema === 'oscuro';
    document.body.classList.toggle('modo-oscuro', esOscuro);
    if (btnTema) {
        btnTema.textContent = esOscuro ? '🌙 Oscuro' : '☀️ Claro';
    }

    // Aplicar notificaciones inicial
    if (toggleNotif) {
        toggleNotif.classList.toggle('activo', prefs.notificaciones);
    }

    // Evento para cambiar tema
    if (btnTema) {
        btnTema.addEventListener('click', () => {
            const current = obtenerPreferencias();
            const nuevoTema = current.tema === 'claro' ? 'oscuro' : 'claro';

            // Actualizar estado
            current.tema = nuevoTema;
            guardarPreferencias(current);

            // Aplicar cambios UI
            const esAhoraOscuro = nuevoTema === 'oscuro';
            document.body.classList.toggle('modo-oscuro', esAhoraOscuro);
            btnTema.textContent = esAhoraOscuro ? '🌙 Oscuro' : '☀️ Claro';
        });
    }

    // Evento para cambiar notificaciones
    if (toggleWrapper) {
        toggleWrapper.addEventListener('click', () => {
            const current = obtenerPreferencias();
            current.notificaciones = !current.notificaciones;
            guardarPreferencias(current);

            if (toggleNotif) {
                toggleNotif.classList.toggle('activo', current.notificaciones);
            }
        });
    }

    // Evento para borrar todos los datos
    const btnBorrar = document.getElementById('btn-borrar-datos');
    if (btnBorrar) {
        btnBorrar.addEventListener('click', () => {
            if (confirm('⚠️ Esto borrará todas tus sesiones guardadas y preferencias. ¿Continuar?')) {
                localStorage.clear();
                vaciarCarrito();
                alert('✅ Todos los datos han sido borrados');

                // Reset visuales
                document.body.classList.remove('modo-oscuro');
                if (btnTema) btnTema.textContent = '☀️ Claro';
                if (toggleNotif) toggleNotif.classList.add('activo'); // Por defecto true


                actualizarBadgeCarrito();
            }
        });
    }
}

// ========== EVENT LISTENERS ==========

// Navegación principal
const logoBtn = document.getElementById('logo');
if (logoBtn) {
    logoBtn.addEventListener('click', () => cambiarVista('inicio'));
}

// Listeners para botones del carrito 
const btnCarrito = document.getElementById('btn-carrito');
if (btnCarrito) {
    btnCarrito.addEventListener('click', mostrarCarrito);
}

const btnCerrarCarrito = document.getElementById('btn-cerrar-carrito');
if (btnCerrarCarrito) {
    btnCerrarCarrito.addEventListener('click', ocultarCarritoModal);
}

const btnCerrarBackdrop = document.getElementById('btn-cerrar-fondo-carrito');
if (btnCerrarBackdrop) {
    btnCerrarBackdrop.addEventListener('click', ocultarCarritoModal);
}


// ========== INICIALIZACIÓN ==========
inicializarSesiones();
inicializarPreferencias();
actualizarBadgeCarrito();
