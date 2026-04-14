require('dotenv').config();
console.log("KEY:", process.env.STRIPE_SECRET_KEY);
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const cors = require('cors');
const app = express();


app.use(cors());
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  try {

    let amount = Number(req.body.amount);

    console.log("Amount recibido:", amount);

    if (!amount || amount <= 0) {
      return res.status(400).send({ error: "Monto inválido" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'mxn',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.log("ERROR STRIPE:", error);
    res.status(500).send({ error: error.message });
  }
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));