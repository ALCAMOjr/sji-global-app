import fs from 'fs';
import csv from 'csv-parser';
import { pool } from "../db.js";

// const csvFilePath = 'RUTA DE EJEMPLO: /home/alfredo/Documentos/sji-global-app/Sji-global-api/src/expTribunalF.csv';

async function readCSVToJson(filePath) {
    const results = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

async function insertData(data) {
    for (const row of data) {
        const numero = parseInt(Object.values(row)[0], 10);
        const nombre = Object.values(row)[1];
        const url = Object.values(row)[2];

        try {
            await pool.query(`
                INSERT INTO expTribunalA (numero, nombre, url)
                VALUES (?, ?, ?)
            `, [numero, nombre, url]);
            console.log(`Inserted: ${numero}`);
        } catch (error) {
            console.error(`Error inserting ${numero}:`, error);
        }
    }
}

export const UploadFileasync = async () => {
    try {
        const jsonData = await readCSVToJson(csvFilePath);

        console.log(jsonData);

        await insertData(jsonData);

        console.log('All data inserted successfully.');
    } catch (error) {
        console.error('Error:', error);
    }
}


