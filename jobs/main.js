import { ApiCalidda } from "../services/calidda.js"
import { ApiSedapal } from "../services/sedapal.js"
import { ApiTelegram } from "../services/telegram.js"
import { ApiGemini } from "../services/google-ai.js"
import { Db } from '../services/db.js'

import dayjs from "dayjs"

async function procesarRecibos(){
    const db = new Db()
    const gemini = new ApiGemini()
    const telegram = new ApiTelegram()
    
    async function notificarReciboNuevo(reciboBase64, periodo, servicio) {
        const respuesta = await gemini.obtenerDetalleRecibo(reciboBase64)
        const reciboDetalle = JSON.parse(respuesta)
        if (reciboDetalle?.error){
            console.error(reciboDetalle.error)
            return
        }

        try {
            const recibo = await db.agregarRecibo(reciboDetalle, servicio, periodo)
            await telegram.enviarDocumento(reciboBase64, reciboDetalle, servicio)
            await db.marcarReciboEnviado(recibo[0].id)
        } catch (error) {
            console.error("Error al agregar recibo:", error)
        }
        
    }
    
    const hoy = dayjs()
    const periodo = hoy.format("YYYY-MM-01")
    
    const recibos = await db.obtenerRecibosAVencer()

    for (const recibo of recibos) {
        const {id, servicio, nvencimiento, fvencimiento} = recibo
                
        console.log(`* Notificando vencimiento ${servicio} - ${fvencimiento}`)
        const notificado = await telegram.notificarVencimiento(recibo, servicio)
        if (notificado) {
            await db.marcarReciboVencimiento(id)
        }        
    }

    const recibosPeriodo = await db.obtenerRecibosPeriodo(periodo)
    const servicios = recibosPeriodo.map(recibo => recibo.servicio)
    
    const mes = hoy.format("M")
    const anio = hoy.format("YYYY")
    
    if (!servicios.includes("CALIDDA")) {
        console.log(`* Consultando recibo de CALIDDA para ${mes}/${anio}`)
        const calidda = new ApiCalidda()
        const reciboBase64 = await calidda.obtenerRecibo(mes, anio)  // base64 en string
        if (reciboBase64) {
            await notificarReciboNuevo(reciboBase64, periodo, "CALIDDA")
        }
    }
    
    if (!servicios.includes("SEDAPAL")) {
        console.log("Obteniendo recibo de SEDAPAL")
        const sedapal = new ApiSedapal()
        const reciboBase64 = await sedapal.obtenerRecibo(mes, anio)
        if (reciboBase64) {
            await notificarReciboNuevo(reciboBase64, periodo, "SEDAPAL")
        }
    }
}


export default procesarRecibos