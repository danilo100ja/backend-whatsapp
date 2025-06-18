const express = require("express");
const { create } = require("venom-bot");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

let client = null;

create({
  session: "session-whatsapp",
  multidevice: true
})
  .then((venomClient) => {
    client = venomClient;
    console.log("WhatsApp conectado");
  })
  .catch((err) => {
    console.error("Erro ao iniciar Venom:", err);
  });

app.get("/", (req, res) => {
  res.send("Backend WhatsApp Online");
});

app.post("/send-message", async (req, res) => {
  const { to, message } = req.body;
  if (!client) return res.status(500).send("Cliente Venom não inicializado");
  try {
    await client.sendText(to, message);
    res.send("Mensagem enviada");
  } catch (error) {
    res.status(500).send("Erro ao enviar mensagem");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});