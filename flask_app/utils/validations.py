import re
import filetype
from datetime import datetime
from database import db

def revisar_sector(sector):
    return sector is not None and len(sector.strip()) <= 100

def revisar_nombre(nombre):
    return nombre is not None and 3 <= len(nombre.strip()) <= 200

def revisar_email(email):
    return email is not None and len(email.strip()) <= 100 and bool(re.match(r"^[\w\.-]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$", email))

def revisar_celular(numero):
    return numero is not None and bool(re.match(r"^\+569\d{8}$", numero))

def revisar_tipo(tipo):
    return tipo in ["Perro", "Gato", "perro", "gato"]

def revisar_entero_positivo(valor):
    if valor is None or valor == "":
        return False
    if isinstance(valor, str) and not valor.isdigit():
        return False
    return int(valor) >= 1

def revisar_unidad(unidad):
    return unidad in ["años", "meses", "a", "m"]

def revisar_fecha(fecha_str):
    if not fecha_str:
        return False
    try:
        fecha = datetime.strptime(fecha_str, "%Y-%m-%dT%H:%M")
        ahora = datetime.now()
        return fecha >= ahora
    except:
        return False

def revisar_fotos(fotos):
    if not fotos or len(fotos) < 1:
        return False
    ALLOWED_EXT = {"png", "jpg", "jpeg", "gif"}
    ALLOWED_MIME = {"image/png", "image/jpeg", "image/gif"}
    for foto in fotos:
        tipo = filetype.guess(foto)
        if not tipo or tipo.extension not in ALLOWED_EXT or tipo.mime not in ALLOWED_MIME:
            return False
    return True

def validar_aviso(data, fotos):
    errores = []

    # Debugging prints, sacar cuando ya tenga todo listo 
    print("DEBUG => Región ID:", data.get("Región"))
    print("DEBUG => Comuna ID:", data.get("Comuna"))

    if not db.validar_comuna_region(data.get("Comuna"), data.get("Región")):
        errores.append("Comuna no pertenece a la región seleccionada.")
    if not revisar_nombre(data.get("Nombre")):
        errores.append("Nombre debe tener entre 3 y 200 caracteres.")
    if not revisar_email(data.get("Email")):
        errores.append("Email con formato inválido o demasiado largo.")
    if not revisar_celular(data.get("Numero")):
        errores.append("Número celular inválido. Debe ser como +56912345678.")
    if not revisar_tipo(data.get("Tipo")):
        errores.append("Tipo de mascota inválido (perro/gato).")
    if not revisar_entero_positivo(data.get("Cantidad")):
        errores.append("Cantidad debe ser un entero positivo.")
    if not revisar_entero_positivo(data.get("Edad")):
        errores.append("Edad debe ser un entero positivo.")
    if not revisar_unidad(data.get("Unidad_medida_edad")):
        errores.append("Unidad de edad inválida (a/m).")
    if not revisar_fecha(data.get("Fecha_entrega")):
        errores.append("Fecha entrega: pon una válida (≥ hoy).")
    if not revisar_fotos(fotos):
        errores.append("Debes adjuntar al menos 1 foto válida.")

    return errores