import fs from "node:fs"
import dayjs from "dayjs"

export class ApiTelegram {
    BASEURL="https://api.telegram.org/bot"
    
    constructor() {
        this.token = process.env.TELEGRAM_BOT_TOKEN 
        this.chat_id = process.env.TELEGRAM_CHAT_ID
    }

    async enviarDocumento(base64, recibo, servicio) {
        const {nSuministro, fEmision, fVencimiento, montoActual, montoAnterior} = recibo

        const extension = servicio + dayjs(fEmision).format("YYYY_MM") + ".pdf"
        const buffer = Buffer.from(base64, 'base64')
        const archivo = new File([buffer], extension, { type: "application/pdf"})
        
        const message = [
            `✅ <b>Recibo de ${servicio} Procesado</b>`,
            `👤 <b>Cliente</b> <code>${nSuministro}</code>`,
            "",
            `📊 <b>Detalle</b>`,
            `• Actual: <b>S/ ${montoActual}</b>`,
            `• Anterior: <b>S/ ${montoAnterior}</b>`,
            "",
            `📅 <b>Fechas</b>`,
            `• Emisión: <b>${dayjs(fEmision).format("DD/MM/YYYY")}</b>`,
            `• Vencimiento: <b>${dayjs(fVencimiento).format("DD/MM/YYYY")}</b>`
        ].join("\n")

        const formData = new FormData()
        formData.append('chat_id', this.chat_id)
        formData.append('document', archivo)
        formData.append('caption', message)
        formData.append('parse_mode', 'HTML')

        const request = await fetch(this.BASEURL + this.token + "/sendDocument", {
            method: "POST",
            body: formData
        })
       const response = await request.json()

       if (response.ok) {
            console.log("Archivo enviado por telegram")
       }
    }


    async notificarVencimiento(recibo, servicio) {
        const { fVencimiento } = recibo
        const {montoActual} = recibo.detalle
        const mensaje = [
            `⚠️ Recibo de ${servicio} Próximo a Vencerse`, 
            `<b>• ⏳ Vencimiento: ${dayjs(fVencimiento).format("DD/MM/YYYY")}</b>`,
            `<b>• 💰 Monto: S/ ${montoActual}</b>`
        ].join("\n")
        const request = await fetch(this.BASEURL + this.token + "/sendMessage", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                chat_id: this.chat_id,
                text: mensaje,
                parse_mode: "HTML"
            })
        })

        const response = await request.json()

        if (response.ok) {
            console.log(`${servicio} notificado!`)
        }

    }
}