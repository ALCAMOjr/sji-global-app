import { pool } from "../db.js";

export const getPositionExpedientes = async (req, res) => {
    try {
        const { userId } = req;

        const [users] = await pool.query('SELECT * FROM abogados WHERE id = ?', [userId]);
        if (users.length <= 0) {
            return res.status(400).json({ message: 'Invalid user id' });
        }

        const user = users[0];
        if (user.user_type !== 'coordinador') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const [results] = await pool.query(`
        -- Consulta 1: Tomar datos de CreditosSIAL y EtapasSial
        WITH CreditosEtapas AS (
            SELECT 
                c.num_credito,
                c.ultima_etapa_aprobada,
                c.fecha_ultima_etapa_aprobada,
                e.secuencia AS secuencia_etapa_aprobada
            FROM CreditosSIAL c
            LEFT JOIN EtapasSial e ON c.ultima_etapa_aprobada = e.etapa
        ),
        
        -- Consulta 2: Tomar datos de expTribunalDetA y EtapasTv, y obtener registros con la fecha más reciente
        ExpTribunalEtapas AS (
            SELECT 
                etd.numeroexp,
                etd.fecha,
                etd.etapa,
                etd.termino,
                etv.secuencia AS secuencia_etapa_tv,
                ROW_NUMBER() OVER (PARTITION BY etd.numeroexp ORDER BY STR_TO_DATE(etd.fecha, '%d/%b./%Y') DESC) AS row_num
            FROM expTribunalDetA etd
            LEFT JOIN EtapasTv etv ON etd.etapa = etv.etapa AND etd.termino = etv.termino
        ),
        
        -- Seleccionar registros con la fecha más reciente para cada numeroexp
        Coincidentes AS (
        SELECT 
            ce.num_credito,
            ce.ultima_etapa_aprobada,
            ce.fecha_ultima_etapa_aprobada,
            ce.secuencia_etapa_aprobada,
            ete.numeroexp,
            ete.fecha,
            ete.etapa,
            ete.termino,
            ete.secuencia_etapa_tv
        FROM CreditosEtapas ce
        JOIN ExpTribunalEtapas ete ON ce.num_credito = ete.numeroexp
        WHERE ete.row_num = 1),
        
        NoCoincidentes AS (
            SELECT 
                c.num_credito,
                c.ultima_etapa_aprobada,
                c.fecha_ultima_etapa_aprobada,
                NULL AS secuencia_etapa_aprobada,
                NULL AS numeroexp,
                NULL AS fecha,
                NULL AS etapa,
                NULL AS termino,
                NULL AS secuencia_etapa_tv
            FROM CreditosSIAL c
            LEFT JOIN expTribunalDetA etd ON c.num_credito = etd.numeroexp
            WHERE etd.numeroexp IS NULL
        
        )
        
        -- Combinar ambos resultados
        SELECT 
            num_credito,
            ultima_etapa_aprobada,
            fecha_ultima_etapa_aprobada,
            secuencia_etapa_aprobada,
            numeroexp,
            fecha,
            etapa,
            termino,
            secuencia_etapa_tv
        FROM Coincidentes
        
        UNION ALL
        
        SELECT 
            num_credito,
            ultima_etapa_aprobada,
            fecha_ultima_etapa_aprobada,
            secuencia_etapa_aprobada,
            numeroexp,
            fecha,
            etapa,
            termino,
            secuencia_etapa_tv
        FROM NoCoincidentes;
            
        `);

        res.status(200).json(results);

    } catch (error) {
        console.error('Error retrieving position expedientes:', error);
        res.status(500).json({ message: 'Error retrieving position expedientes', error });
    }
};
