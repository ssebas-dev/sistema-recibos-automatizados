import dayjs from "dayjs";

export class ApiSedapal {
    BASE_URL = "https://webapp16.sedapal.com.pe/OficinaComercialVirtual/api";
    USER = "OCV_Sedapal";
    PASSWORD = "OCV0109";

    constructor(codigo) {
        this.codigo = process.env.SEDAPAL_CODIGO_CLIENTE;
        this.jwt = undefined;
    }

    async login(){
        const request = await fetch(this.BASE_URL + `/login?username=${this.USER}&password=${this.PASSWORD}`, {
            method: "POST"
        })
    
        if (request.ok) {
            const data = await request.json()
            this.jwt = data?.bRESP.token
        }
    }

    async obtenerRecibo(mes, anio) {        
        await this.login()
        if (!this.jwt) {
            console.log("Error al iniciar sesión en Sedapal")
            return
        }
        const request = await fetch(this.BASE_URL + "/recibos/lista-recibos-deudas-nis", {
            method: "POST",
            headers: {
                "Authorization": `${this.jwt}`,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                "nis_rad": this.codigo,
                "page_num": 1,
                "page_size": 10
            })
        })

        if (request.ok) {
            const data = await request.json()
            const fFact = dayjs(`${anio}-${mes}-01`).format("YYYY-MM-DD")

            if (data?.bRESP.length > 0) {
                const recibos = data.bRESP
                const reciboIndex = recibos.findIndex(r => dayjs(r.f_fact).set("date", 1).format("YYYY-MM-DD") == fFact)
                
                // si se encuentra el recibo, descargarlo y retornar el base64
                if (reciboIndex !== -1) {
                    return await this.descargarRecibo(recibos[reciboIndex])
                }
            }
        }
    }

    async descargarRecibo(recibo) {
        const request = await fetch(this.BASE_URL + "/recibos/recibo-pdf", {
            method: "POST",
            headers: {
                "Authorization": `${this.jwt}`,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                ...recibo,
                nis_rad: this.codigo
            })
        })

        const response= await request.json()
        if (request.ok) {
            return response?.bRESP
        }
    }
}

