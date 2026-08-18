export class ApiCalidda {
    BASEURL = 'https://generadorrecibos.calidda.com.pe/Back/api'
    CAPTCHA = ''

    constructor(codigo, dni) {
        this.cliente = codigo
        this.dni = dni
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
        
        const response = await fetch(this.BASEURL + "/ReceiptView/GetPdfForRecibos", {
            method: 'POST', 
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(body)
        })

        if (response.ok) {
            const data = await response.json()
            if (data.valid) {     
                return data.data
            }
        }
    }
}

