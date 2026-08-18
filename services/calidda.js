import {env} from "../config.js" 

export class ApiCalidda {
    BASEURL = 'https://generadorrecibos.calidda.com.pe/Back/api'
    CAPTCHA = ''

    constructor() {
        this.cliente = env.CALIDDA_CODIGO_CLIENTE
        this.dni = env.CALIDDA_DNI_CLIENTE
    }

    async obtenerRecibo(mes, anio) {
        const body = {
            "clientCode": this.cliente,
            "numberDocument": this.dni,
            "typeDocument": "PE2",
            "month": mes,
            "year": anio,
            "captcha": this.CAPTCHA
        }

        const request = await fetch(this.BASEURL + "/ReceiptView/GetPdfForRecibos", {
            method: 'POST', 
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(body)
        })

        if (request.ok) {
            const data = await request.json()
            if (data.valid) {
                console.log("- Recibo de CALIDDA obtenido correctamente")
                return data.data
            }
        }
        console.error("- Error al obtener recibo de CALIDDA:", request.status)
    }
}

