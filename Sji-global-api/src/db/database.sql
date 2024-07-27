CREATE DATABASE Tribunal;

USE Tribunal;



-- Crear la tabla 'abogados'
CREATE TABLE abogados (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(45) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    cedula VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefono VARCHAR(100) NOT NULL,
    user_type ENUM('coordinador', 'abogado') NOT NULL,
    PRIMARY KEY (id)
);


-- Crear la tabla 'expTribunalA'
CREATE TABLE expTribunalA (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero BIGINT NOT NULL,
    nombre VARCHAR(255),
    url VARCHAR(255),
    expediente VARCHAR(255),
    juzgado VARCHAR(255),
    juicio VARCHAR(255),
    ubicacion VARCHAR(255),
    partes TEXT
);

-- Crear la tabla 'expTribunalDetA'
CREATE TABLE expTribunalDetA (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numeroexp BIGINT NOT NULL,
    ver_acuerdo VARCHAR(50) NULL,
    fecha VARCHAR(20) NULL,
    etapa VARCHAR(50) NULL,
    termino VARCHAR(250) NULL,
    notificacion VARCHAR(250) NULL,
    expediente VARCHAR(50) NULL,
    expTribunalA_id INT,
    FOREIGN KEY (expTribunalA_id) REFERENCES expTribunalA(id)
);


CREATE TABLE Tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exptribunalA_id BIGINT NOT NULL,
    url VARCHAR(255) NULL,
    abogado_id INT,
    tarea TEXT NULL,
    fecha_registro DATE NULL,
    fecha_estimada_entrega DATE NULL,
    fecha_real_entrega DATE NULL,
    fecha_estimada_respuesta DATE NULL,
    estado_tarea ENUM('Asignada', 'Iniciada', 'Terminada') NULL,
    fecha_inicio DATE NULL,  
    observaciones TEXT NULL,
    FOREIGN KEY (abogado_id) REFERENCES abogados(id),
    FOREIGN KEY (expTribunalA_id) REFERENCES expTribunalA(id)
);


CREATE TABLE CreditosSIAL (
  id BIGINT,
  num_credito BIGINT NOT NULL,
  estatus VARCHAR(250),
  acreditado VARCHAR(250),
  omisos INT,
  estado VARCHAR(250),
  municipio VARCHAR(250),
  calle_y_numero VARCHAR(250),
  fraccionamiento_o_colonia VARCHAR(250),
  codigo_postal VARCHAR(250),
  ultima_etapa_reportada VARCHAR(250),
  fecha_ultima_etapa_reportada DATE,
  estatus_ultima_etapa VARCHAR(250),
  macroetapa_aprobada VARCHAR(250),
  ultima_etapa_aprobada VARCHAR(250),
  fecha_ultima_etapa_aprobada VARCHAR(20),
  etapa_construida VARCHAR(250),
  siguiente_etapa VARCHAR(250),
  despacho VARCHAR(250),
  semaforo VARCHAR(250),
  descorto VARCHAR(250),
  abogado VARCHAR(250),
  expediente VARCHAR(250),
  juzgado VARCHAR(250)
);


CREATE TABLE EtapasTv (
    etapa VARCHAR(50) NULL,
    termino VARCHAR(250) NULL,
    secuencia VARCHAR(5)
);


CREATE TABLE EtapasSial (
    etapa VARCHAR(250) NULL,
    secuencia VARCHAR(5)
);
