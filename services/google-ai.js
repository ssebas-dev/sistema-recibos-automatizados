import { env } from "../config.js";
import { GoogleGenAI } from "@google/genai";
import fs from "node:fs"

import * as z from "zod"

export class ApiGemini {
    constructor() {
        this.modelo = env.GEMINI_MODEL
    }
    client = new GoogleGenAI({
        apiKey: env.GEMINI_API_KEY
    })

    async obtenerDetalleRecibo(base64File) {
        console.log("* Gemini API: Extrayendo información del recibo...")
        const PROMPT = `Por favor, extraiga informacion del siguiente documento.`
        const recibo = z.object({
            nSuministro: z.string().describe("Numero de cliente o suministro"),
            fEmision: z.iso.date(),
            fVencimiento: z.iso.date(),
            montoTotal: z.number().describe("Total facturado"),
            montoActual: z.number().describe("Monto facturado del mes"),
            montoAnterior: z.number().describe("Monto anterior facturado"),
        })
        try {
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
            return interaction.output_text
        } catch (error) {
            return JSON.stringify({error: "Error al procesar el recibo"})
        }
    }
}