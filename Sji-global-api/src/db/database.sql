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
    numero INT NOT NULL,
    nombre VARCHAR(255),
    url VARCHAR(255),
    expediente VARCHAR(50),
    juzgado VARCHAR(50),
    juicio VARCHAR(100),
    ubicacion VARCHAR(150),
    partes TEXT
);

select * from expTribunalA;
-- Crear la tabla 'expTribunalDetA'
CREATE TABLE expTribunalDetA (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numeroexp INT NOT NULL,
    ver_acuerdo VARCHAR(50) NULL,
    fecha VARCHAR(20) NULL,
    etapa VARCHAR(50) NULL,
    termino VARCHAR(250) NULL,
    notificacion VARCHAR(250) NULL,
    seleccionar VARCHAR(50) NULL,
    expediente VARCHAR(50) NULL,
    expTribunalA_id INT,
    FOREIGN KEY (expTribunalA_id) REFERENCES expTribunalA(id)
);


CREATE TABLE Tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exptribunalA_id INT NOT NULL,
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

describe expTribunalA;