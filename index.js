const express = require('express');
const { create } = require('venom-bot');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

let client = null;

create({
  session: 'whatsapp-ia',
  multidevice: true
}).then((cl) => {
  client = cl;
  console.log('✅ WhatsApp conectado!');
}).catch((error) => {
  console.error('❌ Erro no Venom:', error);
});

app.get('/status', (req, res) => {
  res.json({ conectado: !!client });
});

app.post('/send-message', async (req, res) => {
  const { number, message } = req.body;
  if (!client) return res.status(500).json({ error: 'Cliente não conectado' });

  try {
    await client.sendText(`${number}@c.us`, message);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`🚀 Backend rodando na porta ${PORT}`));