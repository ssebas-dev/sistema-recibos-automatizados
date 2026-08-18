import "./config.js"
import procesarRecibos from "./jobs/main.js"
import cron from "node-cron"

cron.schedule("0 8 * * *", async () => {
    console.log("Iniciando proceso de obtención de recibos...")
    await procesarRecibos()
})