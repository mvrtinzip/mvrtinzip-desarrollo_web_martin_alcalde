# Tarea 3 — Desarrollo de Aplicaciones Web

**Alumno:** Martín Alcalde  

---

## 1. Estructura del Proyecto

```
tarea2/
└── flask_app/                      # Decidí ponerle este nombre porque es el que utilizamos en los aux
    ├── app.py                      # Aplicación Flask 
    ├── requirements.txt            # Dependencias Python
    ├── database/
    │   ├── db.py                   # Modelos SQLAlchemy y funciones de BD
    │   ├── tarea2.sql              # Script de creación de tablas
    │   ├── tabla-comentario.sql    # Nueva tabla de comentarios
    │   ├── region-comuna.sql       # Datos de regiones y comunas
    │   ├── create_user.sql         # Creación de usuario MySQL
    │   └── drop_db.sql             # Script para eliminar BD
    ├── static/
    │   ├── css/
    │   │   └── styles.css          # Estilos 
    │   ├── js/
    │   │   ├── app.js              # Validaciones frontend
    │   │   ├── comentarios.js      # Sistema de comentarios con fetch
    │   │   ├── estadisticas.js     # Gráficos con Highcharts
    │   │   └── region_comuna.js    # Datos de regiones/comunas
    │   ├── img/                    # Imágenes para subir 
    │   └── uploads/                # Fotos subidas por usuarios
    ├── templates/
    │   ├── index.html              # Portada con últimos 5 avisos
    │   ├── agregar.html            # Formulario de nuevo aviso
    │   ├── listado.html            # Listado de avisos
    │   ├── aviso.html              # Detalle de un aviso + formulario de comentarios
    │   └── estadisticas.html       # Gráficos dinámicos
    ├── utils/
    │   └── validations.py          # Validaciones del lado del servidor
    └── venv/                       # Entorno virtual Python
```

---

### 2. Instalación de Dependencias

```bash
# Crear y activar entorno virtual
python3 -m venv venv
source venv/bin/activate  # Por lo menos asi es en MAC

# Instalar dependencias
pip install -r requirements.txt
```

### 3. Configuración de Base de Datos

```bash
# Crear usuario y base de datos
mysql -u root -p < database/create_user.sql

# Crear estructura de tablas
mysql -u cc5002 -pprogramacionweb tarea2 < database/tarea2.sql

# Crear tabla de comentarios
mysql -u cc5002 -pprogramacionweb tarea2 < database/tabla-comentario.sql

# Cargar datos de regiones y comunas
mysql -u cc5002 -pprogramacionweb tarea2 < database/region-comuna.sql
```

**Credenciales de BD:**
- Host: `localhost`
- Puerto: `3306`
- Base de datos: `tarea2`
- Usuario: `cc5002`
- Contraseña: `programacionweb`

### 4. Ejecutar la Aplicación

```bash
flask run
```

La aplicación estará disponible en: `http://127.0.0.1:5000`

---

## Funcionalidades Implementadas

### 1. Portada 
- Mensaje de bienvenida
- Menú de navegación (Portada, +Agregar aviso, Ver listado, Estadísticas)
- Tabla con los últimos 5 avisos de adopción desde la BD
- Muestra: fecha, comuna, sector, cantidad, tipo, edad y foto

### 2. Agregar Aviso de Adopción 

- **Validaciones JavaScript** mantenidas del frontend
- **Validaciones del servidor** en Python (`utils/validations.py`) 
- Inserción en tabla `aviso_adopcion` 
- Inserción en tabla `contactar_por` 
- Inserción en tabla `foto` 
- Almacenamiento de archivos de fotos 
- Confirmación antes del envío
- Mensaje de éxito al completar el registro

### 3. Listado de Avisos de Adopción 
- Obtención de avisos desde BD con paginación 
- Navegación entre páginas (5 avisos por página) 
- Click en fila redirige al detalle del aviso 

### 4. Detalle del Aviso
- Muestra toda la información del aviso desde BD
- Fotos clickeables
- Botones para volver al listado o portada
- Muestra medios de contacto adicionales si existen

### 5. Agregar Comentario 
- Formulario con nombre (3-80 caracteres) y texto del comentario (5-300 caracteres)
- **Validaciones JavaScript** en el cliente
- **Validaciones del servidor** en Python
- Inserción en tabla `comentario` mediante llamadas asíncronas con fetch
- Actualización dinámica del listado sin recargar la página
- Mensajes de éxito y error

### 6. Listado de Comentarios 
- Carga asíncrona de comentarios al visualizar un aviso
- Muestra fecha, nombre y texto del comentario
- Ordenados por fecha, el más recientes primero
- Actualización automática al agregar nuevos comentarios

### 7. Estadísticas 
- **Gráfico de líneas:** Avisos por día (últimos 30 días)
- **Gráfico de torta:** Distribución de avisos por tipo de mascota (perro/gato)
- **Gráfico de barras:** Avisos por mes y tipo (últimos 12 meses)
- Generación dinámica con Highcharts usando fetch para obtener datos desde el servidor

---

## Consideraciones Importantes

## 1. Contacto Adicional Único
Decidí implementar un solo medio de contacto adicional en lugar de hasta 5 como indicaba el enunciado de la Tarea 1. Esta decisión la tomé para simplificar el formulario

Consideré que:

- Un medio adicional es suficiente para que los adoptantes puedan contactar al publicante
- Ya se cuenta con nombre, email y celular como contactos principales obligatorios
- Simplifica la experiencia de usuario al no sobrecargar el formulario
- La tabla contactar_por sigue permitiendo múltiples registros por diseño, pero la interfaz solo solicita uno

## 2. Validaciones Dobles (Cliente y Servidor)
- Frontend (JavaScript): Validaciones inmediatas con feedback visual antes del submit
- Backend (Python): Validaciones robustas en utils/validations.py para prevenir datos maliciosos

## 3. Fotos de Gatos y Perros en Carpeta img
- Para facilitar el uso del ayudante, dejé imagenes de gatos y perros en la carpeta img, para que se utilicen a la hora de llenar el formulario.

## 4. Seguridad
Implementé función escapeHtml() en JavaScript para prevenir ataques XSS al mostrar comentarios de usuarios.

---

## Pruebas y Validación

- Validado en navegadores: Chrome, Firefox, Safari, Edge
- Probado en diferentes resoluciones de pantalla
- HTML5 y CSS3 validados con W3C Validator
- Manejo de errores para entradas maliciosas
- Validación de tipos de archivo
- Pruebas de llamadas AJAX con conexiones lentas

---

## Dependencias Principales

```
Flask==3.0.0
SQLAlchemy==2.0.23
PyMySQL==1.1.0
Werkzeug==3.0.1
filetype==1.2.0
```

Ver archivo `requirements.txt` completo para todas las dependencias.

---

## Comandos Útiles para evitar problemas

```bash
# Activar entorno virtual
source venv/bin/activate

# Ejecutar aplicación
flask run

# Recrear base de datos
mysql -u root -p < database/drop_db.sql
mysql -u root -p < database/create_user.sql
mysql -u cc5002 -pprogramacionweb tarea2 < database/tarea2.sql
mysql -u cc5002 -pprogramacionweb tarea2 < database/tabla-comentario.sql
mysql -u cc5002 -pprogramacionweb tarea2 < database/region-comuna.sql
```