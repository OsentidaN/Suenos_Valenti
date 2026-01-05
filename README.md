# 🌟 Sueños Valenti - Portal de Sesiones Interactivas

Portal web moderno para la gestión y reserva de sesiones de supra consciencia, desarrollado como proyecto de Desarrollo Web en Entorno Cliente (DWEC).

## 📋 Descripción

Sueños Valenti es una aplicación web que permite a los usuarios explorar y reservar sesiones espirituales de meditación, yoga y sanación energética. La plataforma ofrece una experiencia interactiva con un diseño moderno, gestión de carrito de compras y personalización de preferencias.

## ✨ Características

- **Catálogo de Sesiones**: Visualización de sesiones con información detallada (nombre, descripción, duración, instructor, precio)
- **Carrito de Compras**: Sistema completo de gestión de carrito con persistencia en localStorage
- **Modo Oscuro**: Tema claro/oscuro personalizable
- **Diseño Responsive**: Interfaz adaptable a diferentes dispositivos
- **Gestión de Preferencias**: Configuración de tema y notificaciones
- **Hero Section**: Página de inicio impactante con imagen de fondo
- **Navegación Intuitiva**: Sistema de vistas con navegación fluida

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con gradientes, animaciones y transiciones
- **JavaScript ES6+**: Módulos, async/await, manipulación del DOM
- **LocalStorage**: Persistencia de datos del carrito y preferencias
- **JSON**: Almacenamiento de datos de sesiones

## 📁 Estructura del Proyecto

```
suenos-valenti/
│
├── index.html              # Página principal
├── css/
│   └── styles.css          # Estilos de la aplicación
├── js/
│   ├── main.js            # Módulo coordinador principal
│   ├── api.js             # Módulo para carga de datos
│   ├── cart.js            # Gestión del carrito
│   ├── ui.js              # Renderizado de interfaz
│   └── utils.js           # Utilidades y preferencias
├── data/
│   └── sessions.json      # Datos de las sesiones
└── img/
    └── hombre_meditando.jpg
```

## 🚀 Instalación y Uso

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor local (Live Server, http-server, etc.)

### Pasos de Instalación

1. **Clonar o descargar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/suenos-valenti.git
   cd suenos-valenti
   ```

2. **Iniciar servidor local**
   
   Con Live Server (VSCode):
   - Clic derecho en `index.html` → "Open with Live Server"
   
   Con http-server (Node.js):
   ```bash
   npx http-server
   ```

3. **Abrir en navegador**
   
   Navega a `http://localhost:5500` (o el puerto que uses)

## 💡 Uso de la Aplicación

### Navegación Principal

- **Inicio**: Página de bienvenida con hero section
- **Sesiones**: Catálogo completo de sesiones disponibles
- **Preferencias**: Configuración de tema y notificaciones
- **Carrito**: Icono en la cabecera con badge de contador

### Gestión del Carrito

1. Navega a "Sesiones"
2. Haz clic en "Agregar al Carrito" en cualquier sesión
3. El carrito se abre automáticamente mostrando el ítem agregado
4. Puedes:
   - Aumentar/disminuir cantidad con los botones +/-
   - Eliminar ítems individuales
   - Ver el total actualizado

### Personalización

En la sección **Preferencias**:

- **Apariencia**: Cambia entre tema claro y oscuro
- **Notificaciones**: Activa/desactiva alertas
- **Zona de Peligro**: Borra todos los datos almacenados

## 🔧 Módulos JavaScript

### `main.js`
Módulo coordinador principal que:
- Inicializa la aplicación
- Gestiona el cambio entre vistas
- Coordina eventos del carrito y preferencias

### `api.js`
Maneja la carga de datos:
- Función `cargarSesiones()`: Lee el archivo JSON con las sesiones

### `cart.js`
Gestión del carrito de compras:
- `obtenerCarrito()`: Recupera carrito de localStorage
- `guardarCarrito()`: Persiste carrito en localStorage
- `agregarAlCarrito()`: Añade o incrementa ítems
- `eliminarDelCarrito()`: Elimina ítems
- `vaciarCarrito()`: Limpia todo el carrito
- `calcularTotal()`: Suma el total del carrito

### `ui.js`
Renderizado de componentes:
- `renderizarSesiones()`: Crea tarjetas de sesiones
- `renderizarCarrito()`: Muestra ítems del carrito
- `mostrarCargando()`: Indicador de carga

### `utils.js`
Utilidades y preferencias:
- `obtenerPreferencias()`: Lee preferencias de usuario
- `guardarPreferencias()`: Guarda configuración

## 🎨 Características de Diseño

- **Paleta de colores**: Tonos azules (blue-50 a blue-900)
- **Gradientes**: Fondos y botones con gradientes suaves
- **Animaciones**: Transiciones en hover y cambio de vistas
- **Glassmorphism**: Efecto de vidrio en la cabecera
- **Sombras**: Box shadows para profundidad
- **Fuente personalizada**: Cormorant Garamond para títulos principales

## 📱 Responsive Design

- **Desktop**: Grid de 3 columnas para sesiones
- **Tablet**: Grid adaptable (auto-fit)
- **Mobile**: Navegación oculta, carrito de ancho completo

## 🔐 Almacenamiento de Datos

El proyecto utiliza `localStorage` para persistir:

- **Carrito**: `carrito_espiritual`
- **Preferencias**: `preferencias_usuario`

Formato de datos:
```javascript
// Carrito
[
  {
    id: 1,
    nombre: "Sesión",
    precio: 25.00,
    cantidad: 2,
    duracion: "60 min",
    instructor: "Nombre"
  }
]

// Preferencias
{
  tema: "claro", // "claro" | "oscuro"
  notificaciones: true // true | false
}
```

## 🐛 Solución de Problemas

### Las sesiones no se cargan
- Verifica que `data/sessions.json` existe y tiene el formato correcto
- Comprueba la consola del navegador para errores
- Asegúrate de usar un servidor local (no `file://`)

### El carrito no persiste
- Verifica que localStorage está habilitado en el navegador
- Comprueba que no estás en modo incógnito/privado

### Los estilos no se aplican
- Verifica la ruta de `css/styles.css`
- Limpia la caché del navegador (Ctrl+F5)

## 📄 Licencia

© 2025 Sueños Valenti. Todos los derechos reservados.

Proyecto educativo DWEC - Desarrollo Web Entorno Cliente

## 👥 Autor

Proyecto desarrollado como parte del curso de Desarrollo Web en Entorno Cliente por Osentida Nguema.

