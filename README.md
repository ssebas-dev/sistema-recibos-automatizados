# 📄 Sistema Automatizado de Recibos de Servicios

Un servicio automatizado en **Node.js** diseñado para consultar, procesar y notificar recibos de servicios públicos (**Cálidda** y **Sedapal**) de forma inmediata, extrayendo los datos clave mediante Inteligencia Artificial y enviando el documento junto con alertas de vencimiento por **Telegram**.

---

## 🎯 Objetivo del Proyecto

El objetivo principal es eliminar los retrasos tradicionales en la recepción de facturas:
1. **Evitar esperar el recibo físico** que muchas veces llega tarde a casa o se extravía.
2. **Evitar esperar el correo electrónico** que algunas empresas envían con hasta una semana de retraso respecto a la emisión real.

Con este sistema, la consulta se realiza de forma recurrente y automática apenas se genera el recibo en los portales correspondientes, entregando el PDF y el desglose en tiempo real.

---

## 🚀 Características Principales

* 🌐 **Servidor Web & API para la Nube (Render):**
  * Servidor Express (`src/app.js`) con endpoint protegido `POST /procesar-recibos`.
  * Integrable con disparadores externos gratuitos (como **cron-job.org** o **GitHub Actions**) para evitar costos de instancias 24/7 en planes gratuitos de Render.
  * Middleware de autenticación mediante cabecera `Authorization: Bearer <CRON_SECRET>` o `x-api-key`.
* ⏰ **Ejecución Local Programada:** Opción de monitoreo diario local mediante `node-cron` (`main.js`).
* 🔌 **Integración Directa con Proveedores:**
  * **Cálidda:** Consulta y descarga directa de recibos en formato PDF/Base64.
  * **Sedapal:** Autenticación y consulta en la oficina virtual para obtener el último recibo emitido.
* 🤖 **Extracción Inteligente con Gemini AI:**
  * Procesamiento del documento PDF mediante `@google/genai`.
  * Esquema estructurado y validado con **Zod** para extraer número de suministro, montos, fecha de emisión y fecha de vencimiento.
* 📬 **Notificaciones en Tiempo Real con Telegram:**
  * Envío del documento PDF adjunto con el detalle formateado en HTML.
  * Alertas preventivas automáticas cuando un recibo está a 3 días o menos de vencer.
* 🗄️ **Persistencia en Base de Datos:**
  * Registro histórico de recibos, estados de envío y vencimiento en **PostgreSQL**.
* 🛡️ **Validación de Configuración Fail-Fast:**
  * Validación centralizada de variables de entorno con **Zod** antes de iniciar la aplicación.

---

## 🏗️ Arquitectura y Tecnologías

* **Entorno de Ejecución:** [Node.js](https://nodejs.org/) (ES Modules)
* **Framework Web:** [Express.js](https://expressjs.com/)
* **Gestor de Paquetes:** [pnpm](https://pnpm.io/)
* **Base de Datos:** [PostgreSQL](https://www.postgresql.org/) (usando el driver `postgres`)
* **Inteligencia Artificial:** Google Gemini API (`@google/genai`)
* **Validación de Datos:** [Zod](https://zod.dev/)
* **Manejo de Fechas:** [Day.js](https://day.js.org/)
* **Programador de Tareas:** [node-cron](https://www.npmjs.com/package/node-cron)

---

## 📦 Estructura del Proyecto

```text
├── jobs/
│   └── main.js          # Orquestador del flujo de consulta y notificaciones
├── services/
│   ├── calidda.js       # Cliente API para Cálidda
│   ├── db.js            # Consultas y persistencia en PostgreSQL
│   ├── google-ai.js     # Extracción estructurada con Gemini AI
│   ├── sedapal.js       # Cliente API y autenticación para Sedapal
│   └── telegram.js      # Envío de mensajes y PDFs vía Telegram Bot
├── src/
│   └── app.js           # Servidor Express con endpoint protegido para Render
├── .env.example         # Plantilla de variables de entorno requeridas
├── config.js            # Validación y carga centralizada del entorno (Zod)
├── main.js              # Punto de entrada para ejecución local con Cron
├── LICENSE              # Licencia MIT
└── package.json         # Dependencias y scripts
```

---

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio e instalar dependencias:
```bash
git clone <URL_DEL_REPOSITORIO>
cd sistema-recibos-automatizados
pnpm install
```

### 2. Configurar las Variables de Entorno:
Copia el archivo de plantilla `.env.example` a `.env`:
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:
```env
# Base de Datos
DATABASE_URL=postgresql://usuario:password@localhost:5432/tu_base_de_datos

# Telegram Bot
TELEGRAM_BOT_TOKEN=tu_token_de_bot_aqui
TELEGRAM_CHAT_ID=tu_chat_id_aqui

# Google Gemini AI
GEMINI_API_KEY=tu_api_key_de_gemini
GEMINI_MODEL=gemini-3.6-flash

# Proveedores de Servicios
SEDAPAL_CODIGO_CLIENTE=tu_codigo_nis
CALIDDA_CODIGO_CLIENTE=tu_codigo_cliente
CALIDDA_DNI_CLIENTE=tu_dni

# Seguridad de Endpoints (Render / Cron externo)
CRON_SECRET=tu_clave_secreta_generada_aqui
```

---

## 🚀 Modos de Ejecución

### Opción A: Modo API / Servidor Web (Recomendado para Render)
Inicia el servidor Express que expone el endpoint protegido:
```bash
node --env-file=.env src/app.js
```

Para disparar el procesamiento manualmente o desde un cron externo (como [cron-job.org](https://cron-job.org)):
```bash
curl -X POST http://localhost:3000/procesar-recibos \
     -H "Authorization: Bearer TU_CRON_SECRET"
```

### Opción B: Modo Cron Local (Standalone)
Para dejar corriendo el script en una máquina local o servidor dedicado 24/7:
```bash
node --env-file=.env main.js
```

---

## ⚠️ Descargo de Responsabilidad (Disclaimer)

> Este es un **proyecto personal con fines educativos y de automatización para uso propio**. 
> 
> El autor **no se responsabiliza por el mal uso** de esta herramienta, accesos no autorizados a servicios de terceros, saturación de peticiones a portales externos, o incumplimientos en los términos de servicio de los proveedores mencionados. El usuario asume toda la responsabilidad sobre la gestión de sus credenciales y el uso de este software.

---

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles.
