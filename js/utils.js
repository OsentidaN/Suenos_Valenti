// utils.js - Módulo con utilidades y funciones auxiliares

const PREFERENCIAS_KEY = 'preferencias_usuario';

/**
 * Obtiene las preferencias del usuario desde localStorage
 */
export function obtenerPreferencias() {
    try {
        const prefs = localStorage.getItem(PREFERENCIAS_KEY);
        return prefs ? JSON.parse(prefs) : { tema: 'claro', notificaciones: true };
    } catch (error) {
        console.error('Error al obtener preferencias:', error);
        return { tema: 'claro', notificaciones: true };
    }
}

/**
 * Guarda las preferencias del usuario en localStorage
 */
export function guardarPreferencias(preferencias) {
    try {
        localStorage.setItem(PREFERENCIAS_KEY, JSON.stringify(preferencias));
    } catch (error) {
        console.error('Error al guardar preferencias:', error);
    }
}