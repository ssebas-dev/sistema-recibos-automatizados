import {env} from "../config.js";
import express from 'express';
import procesarRecibos from '../jobs/main.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    const hoy = new Date();
    res.send(`La fecha de hoy es: ${hoy.toISOString()}`);
});

function verificarApiKey(req, res, next) {
    const authHeader = req.headers['authorization'] || req.headers['x-api-key'];
    
    if (authHeader !== `Bearer ${env.CRON_SECRET}` && authHeader !== env.CRON_SECRET) {
        return res.status(401).json({ error: "Acceso no autorizado" });
    }
    
    next();
}

app.post('/procesar-recibos', verificarApiKey, async (req, res) => {    

    try {
        await procesarRecibos();
        return res.status(200).json({ ok: true, mensaje: "Recibos procesados correctamente" });
    } catch (error) {
        console.error("Error al procesar:", error);
        return res.status(500).json({ ok: false, error: error.message });
    }
})

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});