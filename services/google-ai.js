import { GoogleGenAI } from "@google/genai";
import fs from "node:fs"

import * as z from "zod"

export class ApiGemini {
    constructor() {
        this.modelo = process.env.GEMINI_MODEL || 'gemini-3.6-flash'
    }
    client = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    })

    async obtenerDetalleRecibo(base64File) {
        console.log("* Gemini API: Extrayendo información del recibo...")
        const PROMPT = `Por favor, extraiga informacion del siguiente documento.`
        const recibo = z.object({
            nSuministro: z.string("Numero de cliente o suministro"),
            fEmision: z.iso.date(),
            fVencimiento: z.iso.date(),
            montoTotal: z.number("Total facturado"),
            montoActual: z.number("Monto facturado del mes"),
            montoAnterior: z.number("Monto anterior facturado"),
        })

        const interaction = await this.client.interactions.create({
            model: this.modelo,
            input: [
                {type: "text", text: PROMPT},
                {
                    type: "document",
                    data: base64File,
                    mime_type: "application/pdf"
                }
            ],
            response_format: {
                type: "text",
                mime_type: "application/json",
                schema: recibo.toJSONSchema()
            }
        });
        console.log("* Gemini API: Información del recibo extraída.")
        return interaction.output_text
    }
}