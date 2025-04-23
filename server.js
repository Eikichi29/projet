const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/paiement', async (req, res) => {
    const { stripeToken } = req.body;

    try {
        const charge = await stripe.charges.create({
            amount: 1900,
            currency: 'eur',
            description: 'Abonnement Mensuel Assistant IA',
            source: stripeToken
        });

        res.json({ success: true, charge });
    } catch (error) {
        console.error('Erreur paiement Stripe:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur en ligne sur le port ${PORT}`);
});