# Tarea 4 — Desarrollo de Aplicaciones Web  

**Alumno:** Martín Alcalde  
**Curso:** CC5002  

---

## 1. Estructura del Proyecto

```
tarea4web/
└── src/
    ├── main/
    │   ├── java/com/sistemaadopcion/tarea4/
    │   │   ├── controladores/
    │   │   │   ├── ControladorAPI.java           # API REST para evaluaciones
    │   │   │   └── ControladorListado.java       # Controlador de vistas
    │   │   ├── modelos/
    │   │   │   ├── AvisoAdopcion.java            # Entidad JPA de avisos
    │   │   │   ├── Evaluacion.java               # Entidad JPA de evaluaciones
    │   │   │   ├── Comuna.java                   # Entidad JPA de comunas
    │   │   │   └── Region.java                   # Entidad JPA de regiones
    │   │   ├── repositorio/
    │   │   │   ├── RepositorioAvisos.java        # Repositorio JPA de avisos
    │   │   │   └── RepositorioEvaluaciones.java  # Repositorio JPA 
    │   │   ├── servicios/
    │   │   │   ├── ServicioAvisos.java           
    │   │   │   └── ServicioEvaluaciones.java     
    │   │   └── AplicacionPrincipal.java          # Aplicacion principal de Spring Boot
    │   └── resources/
    │       ├── static/
    │       │   ├── css/
    │       │   │   └── estilos.css               
    │       │   └── js/
    │       │       └── evaluacion.js            
    │       ├── templates/
    │       │   └── listado.html                  # Vista Thymeleaf del listado
    │       └── application.properties            # Configuración de Spring Boot
    └── test/
        └── java/com/sistemaadopcion/tarea4/
            └── Tarea4ApplicationTests.java
```

## 2. Instalación y Configuración

### 2.1. Configuración de Base de Datos

```bash
# Crear base de datos y usuario
mysql -u root -p

# En el prompt de MySQL:
CREATE DATABASE tarea4 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'cc5002'@'localhost' IDENTIFIED BY 'programacionweb';
GRANT ALL PRIVILEGES ON tarea4.* TO 'cc5002'@'localhost';
FLUSH PRIVILEGES;
# Cargar datos iniciales como avisos, regiones, comunas
# Spring Boot creará automáticamente la tabla 'nota' al iniciar
```

### 2.2. Configuración de `application.properties`

```properties
spring.application.name=tarea4

# Configuración de base de datos
spring.datasource.url=jdbc:mysql://localhost:3306/tarea4?useSSL=false&serverTimezone=UTC
spring.datasource.username=cc5002
spring.datasource.password=programacionweb

# Configuración de JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### 2.3. Ejecutar la Aplicación

```bash
# Compilar y ejecutar con Maven
mvn spring-boot:run
```
La aplicación estará disponible en: `http://localhost:8080`

## 3. Funcionalidades Implementadas

### 3.1. Listado de Avisos de Adopción 

- **Tabla con columnas requeridas:**
  - ID, Fecha Publicación, Sector, Cantidad, Tipo, Edad, Comuna, Nota, Acción
- **Carga de datos desde BD** mediante Spring Data JPA
- **Cálculo de promedio de evaluaciones** por cada aviso
- Muestra "-" cuando no hay evaluaciones

### 3.2. Evaluación de Avisos 

- **Modal de evaluación** al hacer clic en "Evaluar"
- **Selector de calificación** con botones del 1 al 7
- **Validaciones:**
  - Cliente: JavaScript verifica selección antes de enviar
  - Servidor: Java valida que la calificación efectivamente esté entre 1 y 7 
- **Inserción en base de datos** mediante JPA
- **Manejo de errores** En el caso de que no se seleccione ninguna calificación

### 3.3. Actualización Dinámica del Promedio

- **Llamada** con JavaScript Fetch API
- **Recalculo automático** del promedio en el backend
- **Actualización de la interfaz** sin recargar la página
- **Feedback visual** con mensaje de exito y de error

## 4. Validación Doble

Implementé validaciones doble:

**Frontend (JavaScript):**
```javascript
if (!calificacionSeleccionada) {
    mostrarAlerta('Por favor seleccione una calificación', 'error');
    return;
}
```
**Backend (Java):**
```java
if (calificacion == null || calificacion < 1 || calificacion > 7) {
    respuesta.put("exito", false);
    respuesta.put("mensaje", "La calificación debe ser entre 1 y 7");
    return ResponseEntity.badRequest().body(respuesta);
}
``` 