from datetime import datetime
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from sqlalchemy import create_engine 
from sqlalchemy import Column, Integer, BigInteger, String, ForeignKey, DateTime, Enum, Text
import enum

# Setting base de datos
DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306

DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


class TipoAnimal(enum.Enum):
    perro = "perro"
    gato = "gato"

class MedioContacto(enum.Enum):
    instagram = "instagram"
    whatsapp = "whatsapp"
    telegram = "telegram"
    X = "X"
    tiktok = "tiktok"
    otra = "otra" 

class UnidadEdad(enum.Enum):
    a = "a"
    m = "m"

class Region(Base):
    __tablename__ = 'region'
    id = Column(BigInteger, primary_key=True)
    nombre = Column(String(200), nullable=False)
    comunas = relationship("Comuna", back_populates="region", cascade="all, delete")

class Comuna(Base):
    __tablename__ = 'comuna'
    id = Column(BigInteger, primary_key=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(BigInteger, ForeignKey('region.id'), nullable=False)
    region = relationship("Region", back_populates="comunas")
    avisos = relationship("AvisoAdopcion", back_populates="comuna", cascade="all, delete")

class AvisoAdopcion(Base):
    __tablename__ = 'aviso_adopcion'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    fecha_ingreso = Column(DateTime, default=datetime.now, nullable=False)
    comuna_id = Column(BigInteger, ForeignKey('comuna.id'))
    sector = Column(String(100), nullable=True)
    nombre = Column(String(200), nullable=False)
    email = Column(String(100), nullable=False)
    celular = Column(String(15), nullable=True)
    tipo = Column(Enum(TipoAnimal), nullable=False)
    cantidad = Column(Integer, nullable=False)
    edad = Column(Integer, nullable=False)
    unidad_medida = Column(Enum(UnidadEdad), nullable=False)
    fecha_entrega = Column(DateTime, default=datetime.now, nullable=False)
    descripcion = Column(Text(500), nullable=True)

    fotos = relationship("Foto", back_populates="aviso", cascade="all, delete")
    contactos = relationship("ContactarPor", back_populates="aviso", cascade="all, delete")
    comuna = relationship("Comuna", back_populates="avisos")

class Foto(Base):
    __tablename__ = 'foto'
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    ruta_archivo = Column(String(300), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)
    aviso_id = Column(BigInteger, ForeignKey('aviso_adopcion.id'), nullable=False)
    aviso = relationship("AvisoAdopcion", back_populates="fotos")

class ContactarPor(Base):
    __tablename__ = 'contactar_por'
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    nombre = Column(Enum(MedioContacto), nullable=False)
    identificador = Column(String(150), nullable=False)
    aviso_id = Column(BigInteger, ForeignKey('aviso_adopcion.id'), nullable=False)
    aviso = relationship("AvisoAdopcion", back_populates="contactos")

# Funciones crear

def crear_aviso(comuna_id, sector, nombre, email, celular, tipo, cantidad, edad, unidad_medida, fecha_entrega, descripcion):
    session = SessionLocal()
    nuevo_aviso = AvisoAdopcion(
        comuna_id=comuna_id,
        sector=sector,
        nombre=nombre,
        email=email,
        celular=celular,
        tipo=tipo,
        cantidad=cantidad,
        edad=edad,
        unidad_medida=unidad_medida,
        fecha_entrega=fecha_entrega,
        descripcion=descripcion
    )
    session.add(nuevo_aviso)
    session.commit()
    aviso_id = nuevo_aviso.id
    session.close()
    return aviso_id

def crear_foto(ruta_archivo, nombre_archivo, aviso_id):
    session = SessionLocal()
    foto = Foto(ruta_archivo=ruta_archivo, nombre_archivo=nombre_archivo, aviso_id=aviso_id)
    session.add(foto)
    session.commit()
    session.close()

def crear_contacto(nombre, identificador, aviso_id):
    session = SessionLocal()
    contacto = ContactarPor(nombre=nombre, identificador=identificador, aviso_id=aviso_id)
    session.add(contacto)
    session.commit()
    session.close()

# Funciones get

def get_comuna(id):
    session = SessionLocal()
    result = session.query(Comuna).filter_by(id=id).first()
    session.close()
    return result

def get_comunas():
    session = SessionLocal()
    comunas = session.query(Comuna).all()
    session.close()
    return comunas

def get_region(id):
    session = SessionLocal()
    result = session.query(Region).filter_by(id=id).first()
    session.close()
    return result

def get_todas_regiones():
    session = SessionLocal()
    regiones = session.query(Region).all()
    session.close()
    return regiones

def get_comunas_por_region(region_id):
    session = SessionLocal()
    comunas = session.query(Comuna).filter_by(region_id=region_id).all()
    session.close()
    return comunas

def get_fotos(aviso_id):
    session = SessionLocal()
    fotos = session.query(Foto).filter_by(aviso_id=aviso_id).all()
    session.close()
    return fotos

def get_ultimos_avisos(n):
    session = SessionLocal()
    avisos = session.query(AvisoAdopcion).order_by(AvisoAdopcion.fecha_ingreso.desc()).limit(n).all()
    session.close()
    return avisos

def get_avisos_paginados(pagina=1, por_pagina=5):
    session = SessionLocal()
    query = session.query(AvisoAdopcion).order_by(AvisoAdopcion.fecha_ingreso.desc())
    total = query.count()
    avisos = query.offset((pagina - 1) * por_pagina).limit(por_pagina).all()
    for aviso in avisos:
        aviso.comuna
        aviso.fotos
    session.close()
    return avisos, total

def get_todas_comunas():
    session = SessionLocal()
    comunas = session.query(Comuna).all()
    session.close()
    return comunas

def validar_comuna_region(id_comuna, id_region):
    session = SessionLocal()
    comuna = session.query(Comuna).filter_by(id=id_comuna, region_id=id_region).first()
    session.close()
    return comuna is not None