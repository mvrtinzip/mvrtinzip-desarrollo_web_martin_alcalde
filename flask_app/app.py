from flask import Flask, request, render_template, redirect, url_for, jsonify
from database import db
from database.db import SessionLocal, Region, AvisoAdopcion
from utils.validations import validar_aviso
from werkzeug.utils import secure_filename 
import hashlib
import filetype
import os

app = Flask(__name__)
app.secret_key = "clave_secretaxd"
app.config['UPLOAD_FOLDER'] = 'static/uploads'

@app.route("/", methods=["GET"])
def index():
    ultimos = []
    for aviso in db.get_ultimos_avisos(5):
        fotos = db.get_fotos(aviso.id)
        foto = fotos[0] if fotos else None

        ultimos.append({
            "fecha_ingreso": aviso.fecha_ingreso,
            "comuna": db.get_comuna(aviso.comuna_id).nombre,
            "sector": aviso.sector or "—",
            "cantidad": aviso.cantidad,
            "tipo": aviso.tipo.value.capitalize() if hasattr(aviso.tipo, "value") else aviso.tipo,
            "edad": aviso.edad,
            "unidad_medida": aviso.unidad_medida.value if hasattr(aviso.unidad_medida, "value") else aviso.unidad_medida,
            "foto": url_for('static', filename='uploads/' + foto.nombre_archivo) if foto else None
        })

    return render_template("index.html", ultimos=ultimos)

@app.route("/agregar", methods=["GET", "POST"])
def agregar_aviso():
    print("Ruta /agregar cargada")

    regiones = db.get_todas_regiones()
    comunas = db.get_comunas()
    
    if request.method == "POST":
        # Recolección de datos
        region_id = request.form.get("region")
        comuna_id = request.form.get("comuna")
        sector = request.form.get("Sector")
        nombre = request.form.get("Nombre")
        email = request.form.get("Email")
        celular = request.form.get("Numero")
        tipo = request.form.get("Tipo")
        cantidad = request.form.get("Cantidad")
        edad = request.form.get("Edad")
        unidad_edad = request.form.get("Unidad_medida_edad")
        fecha_entrega = request.form.get("Fecha_entrega")
        descripcion = request.form.get("Descripción")
        fotos = request.files.getlist("Foto")
        contacto_tipo = request.form.get("Contacto")
        contacto_id = request.form.get("ID")

        print("DEBUG => Región ID:", region_id)
        print("DEBUG => Comuna ID:", comuna_id)

        aviso = {
            "region": region_id,
            "comuna": comuna_id,
            "sector": sector,
            "nombre": nombre,
            "email": email,
            "celular": celular,
            "tipo": tipo,
            "cantidad": cantidad,
            "edad": edad,
            "unidad_edad": unidad_edad,
            "fecha_entrega": fecha_entrega,
            "descripcion": descripcion,
            "fotos": fotos,
            "contactos": [{"tipo": contacto_tipo, "id": contacto_id}]
        }

        # Validación
        if validar_aviso(aviso, fotos):
            aviso_id = db.crear_aviso(
                comuna_id=comuna_id,
                sector=sector,
                nombre=nombre,
                email=email,
                celular=celular,
                tipo=tipo,
                cantidad=int(cantidad),
                edad=int(edad),
                unidad_medida=unidad_edad,
                fecha_entrega=fecha_entrega,
                descripcion=descripcion
            )

            # Guardar fotos
            for f in fotos:
                if f.filename:
                    _filename = hashlib.sha256(secure_filename(f.filename).encode("utf-8")).hexdigest()
                    _extension = filetype.guess(f).extension
                    img_filename = f"{_filename}.{_extension}"
                    f.save(os.path.join(app.config["UPLOAD_FOLDER"], img_filename))
                    db.crear_foto(app.config["UPLOAD_FOLDER"], img_filename, aviso_id)

            # Guardar contacto 
            if contacto_tipo and contacto_id:
                db.crear_contacto(contacto_tipo, contacto_id, aviso_id)

            return render_template("agregar.html", mensaje_exito="Se agregó correctamente el aviso.")

        else:
            print("Errores detectados en el backend")
            return render_template("agregar.html", error=["Revisa los campos ingresados."], aviso=aviso, regiones=regiones, comunas=comunas)

    return render_template("agregar.html", regiones=regiones, comunas=comunas)


@app.route("/listado")
def listado():
    pagina = request.args.get("page", 1, type=int)
    avisos, total = db.get_avisos_paginados(pagina=pagina, por_pagina=5)

    resumen = []
    for aviso in avisos:
        fotos = db.get_fotos(aviso.id)
        resumen.append({
            "id": aviso.id,
            "fecha_publicacion": aviso.fecha_ingreso.strftime("%Y-%m-%d %H:%M"),
            "fecha_entrega": aviso.fecha_entrega.strftime("%Y-%m-%d %H:%M"),
            "comuna": aviso.comuna.nombre if aviso.comuna else "",
            "sector": aviso.sector or "—",
            "cantidad": aviso.cantidad,
            "tipo": aviso.tipo.value.capitalize() if hasattr(aviso.tipo, "value") else aviso.tipo,
            "edad": aviso.edad,
            "unidad_medida": "meses" if aviso.unidad_medida.value == "m" else "años",
            "nombre_contacto": aviso.nombre,
            "cantidad_fotos": len(fotos)
        })

    total_paginas = max(1, (total + 4) // 5)
    return render_template("listado.html", avisos=resumen, page=pagina, total_pages=total_paginas)


@app.route("/aviso/<int:aviso_id>")
def detalle_aviso(aviso_id):
    session = SessionLocal()
    aviso = session.query(AvisoAdopcion).filter_by(id=aviso_id).first()
    
    if not aviso:
        session.close()
        return "Aviso no encontrado", 404
    
    comuna = aviso.comuna
    region = comuna.region if comuna else None
    fotos = db.get_fotos(aviso.id)
    contactos = aviso.contactos
    
    datos = {
        "id": aviso.id,
        "fecha_publicacion": aviso.fecha_ingreso.strftime("%Y-%m-%d %H:%M"),
        "fecha_entrega": aviso.fecha_entrega.strftime("%Y-%m-%d %H:%M"),
        "region": region.nombre if region else "—",
        "comuna": comuna.nombre if comuna else "—",
        "sector": aviso.sector or "—",
        "cantidad": aviso.cantidad,
        "tipo": aviso.tipo.value.capitalize() if hasattr(aviso.tipo, "value") else aviso.tipo,
        "edad": aviso.edad,
        "unidad_medida": "meses" if aviso.unidad_medida.value == "m" else "años",
        "nombre": aviso.nombre,
        "email": aviso.email,
        "celular": aviso.celular or "—",
        "descripcion": aviso.descripcion or "Sin descripción",
        "fotos": [url_for('static', filename='uploads/' + f.nombre_archivo) for f in fotos],
        "contactos": contactos
    }
    
    session.close()
    return render_template("aviso.html", aviso=datos)


# COMENTARIOS 
@app.route("/api/comentarios/<int:aviso_id>", methods=["GET"])
def obtener_comentarios(aviso_id):
    """Obtener comentarios de un aviso (llamada AJAX)"""
    try:
        comentarios = db.get_comentarios(aviso_id)
        return jsonify({"success": True, "comentarios": comentarios})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/comentarios/<int:aviso_id>", methods=["POST"])
def agregar_comentario(aviso_id):
    """Agregar un comentario (llamada AJAX)"""
    try:
        data = request.get_json()
        nombre = data.get('nombre', '').strip()
        texto = data.get('texto', '').strip()
        
        # Validaciones del servidor
        errores = []
        
        if not nombre or len(nombre) < 3 or len(nombre) > 80:
            errores.append("El nombre debe tener entre 3 y 80 caracteres")
        
        if not texto or len(texto) < 5 or len(texto) > 300:
            errores.append("El comentario debe tener entre 5 y 300 caracteres")
        
        if errores:
            return jsonify({"success": False, "errores": errores}), 400
        
        # Crear comentario
        db.crear_comentario(nombre, texto, aviso_id)
        
        # Obtener todos los comentarios actualizados
        comentarios = db.get_comentarios(aviso_id)
        
        return jsonify({
            "success": True, 
            "mensaje": "Comentario agregado exitosamente",
            "comentarios": comentarios
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ESTADÍSTICAS 
@app.route("/api/estadisticas/avisos-por-dia", methods=["GET"])
def api_avisos_por_dia():
    """Obtener avisos por día para gráfico de líneas"""
    try:
        datos = db.get_avisos_por_dia()
        return jsonify({"success": True, "datos": datos})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/estadisticas/avisos-por-tipo", methods=["GET"])
def api_avisos_por_tipo():
    """Obtener avisos por tipo para gráfico de torta"""
    try:
        datos = db.get_avisos_por_tipo()
        return jsonify({"success": True, "datos": datos})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/estadisticas/avisos-por-mes-tipo", methods=["GET"])
def api_avisos_por_mes_tipo():
    """Obtener avisos por mes y tipo para gráfico de barras"""
    try:
        datos = db.get_avisos_por_mes_y_tipo()
        return jsonify({"success": True, "datos": datos})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/estadisticas")
def estadisticas():
    graficos = [
        url_for('static', filename='img/barras.png'),
        url_for('static', filename='img/lineas.png'),
        url_for('static', filename='img/torta.png')
    ]
    return render_template("estadisticas.html", graficos=graficos)

if __name__ == "__main__":
    app.run(debug=True)