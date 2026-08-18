import postgres from 'postgres';

export class Db {
    constructor() {
        this.sql = postgres(process.env.DATABASE_URL);
    }

    async agregarRecibo(recibo, servicio, periodo) {
        const {fVencimiento } = recibo
        const result = await this.sql`
            INSERT INTO recibos (periodo, servicio, fVencimiento, detalle)
            VALUES (${periodo}, ${servicio}, ${fVencimiento}, ${recibo}) returning id;
        `;
        return result;
    }

    async obtenerRecibosAVencer() {
        const result = await this.sql`
            SELECT * FROM recibos WHERE nVencimiento = FALSE;
        `;
        return result;
    }

    async obtenerRecibosPeriodo(periodo) {
        const result = await this.sql`
            SELECT * FROM recibos WHERE periodo = ${periodo};
        `;
        return result;
    }


    async marcarReciboEnviado(id) {
        const result = await this.sql`
            UPDATE recibos SET nEnviado = TRUE WHERE id = ${id} returning id;
        `;
        return result;
    }

    async marcarReciboVencimiento(id) {
        const result = await this.sql`
            UPDATE recibos SET nVencimiento = TRUE WHERE id = ${id} returning id;
        `;
        return result;
    }
}
