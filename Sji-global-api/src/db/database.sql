-- Crear la base de datos
CREATE DATABASE Tribunal;

-- Usar la base de datos
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
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Numero INT NOT NULL,
    Nombre VARCHAR(255),
    URL VARCHAR(255),
    Expediente VARCHAR(50),
    NumeroExp INT NOT NULL,
    Juzgado VARCHAR(50),
    Juicio VARCHAR(100),
    Ubicacion VARCHAR(150),
    Partes TEXT
);

-- Crear la tabla 'expTribunalDetA'
CREATE TABLE expTribunalDetA (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    NumeroExp INT NOT NULL,
    Ver_Acuerdo VARCHAR(50) NULL,
    Fecha VARCHAR(20) NULL,
    Etapa VARCHAR(50) NULL,
    Termino VARCHAR(250) NULL,
    Notificacion VARCHAR(250) NULL,
    Seleccionar VARCHAR(50) NULL,
    Expediente VARCHAR(50) NULL,
    expTribunalA_Id INT,
    FOREIGN KEY (expTribunalA_Id) REFERENCES expTribunalA(Id)
);

-- Crear la tabla 'Tareas'
CREATE TABLE Tareas (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    expTribunalA_Id INT NOT NULL,
    URL VARCHAR(255) NULL,
    Abogado_ID INT,
    Tarea TEXT NULL,
    Fecha_Registro DATE NULL,
    Fecha_Estimada_Entrega DATE NULL,
    Fecha_Real_Entrega DATE NULL,
    Fecha_Estimada_Respuesta DATE NULL,
    Estado_Tarea ENUM('Asignada', 'Iniciada', 'Terminada') NULL,
    Fecha_Inicio DATE NULL,  
    Observaciones TEXT NULL,
    FOREIGN KEY (Abogado_ID) REFERENCES abogados(Id),
    FOREIGN KEY (expTribunalA_Id) REFERENCES expTribunalA(Id)
);
