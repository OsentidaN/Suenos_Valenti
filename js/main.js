// main.js - Módulo coordinador principal de la aplicación

import { cargarSesiones } from './api.js';
import { renderizarSesiones, renderizarCarrito, mostrarCargando } from './ui.js';
import {
    obtenerCarrito,
    guardarCarrito,
    eliminarDelCarrito,
    vaciarCarrito,
    agregarAlCarrito,
} from './cart.js';
import { obtenerPreferencias, guardarPreferencias } from './utils.js';

// Estado de la aplicación
let sesiones = [];


// ========== CONSTANTES ==========
const CLASES = {
    ACTIVA: 'activa',
    MOSTRAR: 'mostrar',
    ABIERTO: 'abierto',
    MODO_OSCURO: 'modo-oscuro',
    OCULTO: 'oculto'
};

const MENSAJES = {
    CONFIRMAR_BORRAR: '⚠️ Esto borrará todas tus sesiones guardadas y preferencias. ¿Continuar?',
    DATOS_BORRADOS: '✅ Todos los datos han sido borrados',
    ERROR_CARGA: 'Error al cargar las sesiones. Por favor, verifica que el archivo data/sesiones.json existe.'
};

// ========== FUNCIONES DE NAVEGACIÓN ==========
/**
 * Obtiene los elementos de las vistas de forma diferida para mayor seguridad
 */
function obtenerElementosVistas() {
    return {
        inicio: document.getElementById('vista-inicio'),
        sesiones: document.getElementById('vista-sesiones'),
        carrito: document.getElementById('vista-carrito'),
        preferencias: document.getElementById('vista-preferencias')
    };
}

/**
 * Cambia la vista activa de la aplicación
 */
function cambiarVista(nombreVista) {
    console.log('Cambiando a vista:', nombreVista);

    //Remover clase activa de todas las vistas
    document.querySelectorAll('.vista').forEach(vista => {
        vista.classList.remove(CLASES.ACTIVA);
    });

    //Activar vista seleccionada
    const vistaDestino = document.getElementById(`vista-${nombreVista}`);
    if (vistaDestino) {
        vistaDestino.classList.add(CLASES.ACTIVA);
    } else {
        console.error("Vista no encontrada: ", nombreVista);
    }
}

/**
 * Lógica del menú móvil
 */
function toggleMenuMovil() {
    const nav = document.getElementById('nav-principal');
    const overlay = document.getElementById('overlay-menu');
    if (nav) nav.classList.toggle('abierto');
    if (overlay) overlay.classList.toggle('mostrar');
}

function ocultarMenuMovil() {
    const nav = document.getElementById('nav-principal');
    const overlay = document.getElementById('overlay-menu');
    nav?.classList.remove(CLASES.ABIERTO);
    overlay?.classList.remove(CLASES.MOSTRAR);
}

// ========== FUNCIONES DE SESIONES ==========

/** Inicializa los event listeners de navegación */

function inicializarNavegacion() {
    //Navegación por data-vista
    document.querySelectorAll('[data-vista]').forEach(elemento => {
        elemento.addEventListener('click', (e) => {
            e.preventDefault();
            const vista = e.currentTarget.dataset.vista;
            console.log('Navegación solicitada:', vista);
            cambiarVista(vista);
            ocultarMenuMovil();
        });
    });

    //Navegación por logo
    document.getElementById('logo')?.addEventListener('click', () => {
        cambiarVista('inicio');
    })

    //Menú móvil
    document.getElementById('menu-toggle')?.addEventListener('click', toggleMenuMovil);
    document.getElementById('overlay-menu')?.addEventListener('click', ocultarMenuMovil);
}
/**
 * Inicializa y carga las sesiones desde el JSON
 */
async function inicializarSesiones() {
    const container = document.getElementById('contenedor-sesiones');
    if (!container) {
        console.error("Contenedor de sesiones no encontrado");
        return;
    }
    mostrarCargando(container);
    try {
        sesiones = await cargarSesiones();
        renderizarSesiones(container, sesiones, alAgregarSesion);
    } catch (error) {
        console.error("Error cargando sesiones:", error);
        container.innerHTML = '<p style="text-align:center; color: #ef4444;">Error al cargar las sesiones</p>';
    }
}

// ========== LÓGICA DEL CARRITO ==========

/**
 * Callback que se ejecuta al agregar una sesión al carrito
 */
function alAgregarSesion(sesion) {
    const exito = agregarAlCarrito(sesion);
    if (exito) {
        actualizarBadgeCarrito();
        console.log(`✓ "${sesion.nombre}" agregada al carrito`);
    } else {
        console.error("Error al agregar sesión al carrito.");
    }
}


// ========== FUNCIONES DEL CARRITO ==========

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
        }
    );
    document.getElementById('modal-carrito')?.classList.add(CLASES.MOSTRAR);
}

function ocultarCarritoModal() {
    document.getElementById('modal-carrito')?.classList.remove(CLASES.MOSTRAR);
}

/**
 * Inicializa los event listeners del carrito
 */
function inicializarCarrito() {
    document.getElementById('btn-carrito')?.addEventListener('click', mostrarCarrito);
    document.getElementById('btn-cerrar-carrito')?.addEventListener('click', ocultarCarritoModal);
    document.getElementById('btn-cerrar-fondo-carrito')?.addEventListener('click', ocultarCarritoModal);
    document.getElementById('btn-vaciar-carrito')?.addEventListener('click', () => {
        if (confirm('¿Deseas vaciar todo el carrito?')) {
            vaciarCarrito();
            mostrarCarrito();
            actualizarBadgeCarrito();
        }
    });
}


// ========== PREFERENCIAS ==========

/**
 * Inicializa la gestión de preferencias
 */
function inicializarPreferencias() {
    const prefs = obtenerPreferencias();

    //Aplicar tema inicial
    aplicarTema(prefs.tema);

    //Aplicar notificaciones inicial 
    const toggle = document.getElementById('interruptor-notificaciones');
    if (toggle) {
        toggle.classList.toggle(CLASES.ACTIVA, prefs.notificaciones);
    }

    //Event Listeners
    configurarEventoTema();
    configurarEventoNotificaciones();
    configurarEventoBorrarDatos();
}

/**
* Aplica el tema visual
*/
function aplicarTema(tema) {
    const esOscuro = tema === 'oscuro';
    document.body.classList.toggle(CLASES.MODO_OSCURO, esOscuro);

    const btnTema = document.getElementById('btn-tema');
    if (btnTema) {
        btnTema.textContent = esOscuro ? '🌙 Oscuro' : '☀️ Claro';
    }
}

/**
 * Configura el evento de cambio de tema
 */
function configurarEventoTema() {
    const btnTema = document.getElementById('btn-tema');
    if (!btnTema) return;

    btnTema.addEventListener('click', () => {
        const prefs = obtenerPreferencias();
        const nuevoTema = prefs.tema === 'claro' ? 'oscuro' : 'claro';

        prefs.tema = nuevoTema;
        guardarPreferencias(prefs);
        aplicarTema(nuevoTema);
    });
}

/**
 * Configura el evento de cambio de notificaciones
 */
function configurarEventoNotificaciones() {
    const contenedor = document.getElementById('contenedor-interruptor-notif');
    const toggle = document.getElementById('interruptor-notificaciones');

    const elemento = contenedor || toggle;
    if (!elemento) return;

    elemento.addEventListener('click', () => {
        const prefs = obtenerPreferencias();
        prefs.notificaciones = !prefs.notificaciones;
        guardarPreferencias(prefs);

        if (toggle) {
            toggle.classList.toggle(CLASES.ACTIVA, prefs.notificaciones);
        }
    });
}

/**
 * Configura el evento de borrar datos
 */
function configurarEventoBorrarDatos() {
    const btnBorrar = document.getElementById('btn-borrar-datos');
    if (!btnBorrar) return;

    btnBorrar.addEventListener('click', () => {
        if (confirm(MENSAJES.CONFIRMAR_BORRAR)) {
            // Limpiar todo el localStorage
            localStorage.clear();

            // Resetear interfaz
            document.body.classList.remove(CLASES.MODO_OSCURO);

            const btnTema = document.getElementById('btn-tema');
            if (btnTema) btnTema.textContent = '☀️ Claro';

            const toggle = document.getElementById('interruptor-notificaciones');
            if (toggle) toggle.classList.add(CLASES.ACTIVA);

            actualizarInterfazCarrito();

            alert(MENSAJES.DATOS_BORRADOS);
        }
    });
}

// ========== INICIALIZACIÓN PRINCIPAL ==========

function inicializarApp() {
    console.log('🚀 Inicializando Sueños Valenti...');

    // Inicializar módulos
    inicializarNavegacion();
    inicializarCarrito();
    inicializarPreferencias();
    inicializarSesiones();

    // Actualizar UI inicial
    actualizarBadgeCarrito();

    console.log('✓ Aplicación inicializada correctamente');
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarApp);
} else {
    inicializarApp();
}