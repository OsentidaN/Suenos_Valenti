
/**
 * Carga las sesiones desde el archivo JSON
 */
export async function cargarSesiones() {
    try {
        const response = await fetch('data/sessions.json');
        if (!response.ok) {
            throw new Error('Error al cargar sesiones');
        }
        const sesiones = await response.json();
        return sesiones;
    } catch (error) {
        console.error('Error cargando sesiones:', error);
        throw error;
    }
}
