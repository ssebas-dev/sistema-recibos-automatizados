import * as z from "zod"



const envSchema = z.object({
    DATABASE_URL: z.string().min(1, "DATABASE_URL is requerido"),
    TELEGRAM_BOT_TOKEN: z.string().min(1, "TELEGRAM_BOT_TOKEN is requerido"),
    TELEGRAM_CHAT_ID: z.string().min(1, "TELEGRAM_CHAT_ID is requerido"),

    GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is requerido"),
    GEMINI_MODEL: z.string().default("gemini-3.6-flash"),

    SEDAPAL_CODIGO_CLIENTE: z.string().min(1, "SEDAPAL_CODIGO_CLIENTE is requerido"),

    CALIDDA_CODIGO_CLIENTE : z.string().min(1, "CALIDDA_CODIGO_CLIENTE is requerido"),
    CALIDDA_DNI_CLIENTE: z.string().min(1, "CALIDDA_DNI_CLIENTE is requerido")
})


export const env = envSchema.parse(process.env)