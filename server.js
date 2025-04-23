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
app.get("/", (req, res) => {
  res.send("Backend actif 🚀");
    });
app.listen(PORT, () => {
    console.log(`Serveur en ligne sur le port ${PORT}`);
});
app.post("/create-checkout-session", async (req, res) => {
  const YOUR_DOMAIN = "https://projet-iwgz.onrender.com"; // Change cela avec ton URL
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Produit Exemple",  // Change le produit ici
            },
            unit_amount: 2000, // Montant en cents (ex. 20.00 USD)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
    });

    res.redirect(303, session.url);
  } catch (err) {
    console.error("Erreur création session", err);
    res.status(500).send("Erreur lors de la création de la session Stripe");
  }
});<><button id="checkout-button">M'abonner</button><script src="https://js.stripe.com/v3/"></script><script>
  var stripe = Stripe('pk_live_51RH3ljRtO1bGwiPvL1c2jNVNYjikezB1GNxs63FhAE5pTgW6Lg84uJVYZcM6hjIaVsLioeIakCMPlCO9KD1Nx7Bd003PYKYykC'); //
  checkoutButton.addEventListener('click', function () {fetch('/create-checkout-session', {
    method: 'POST',
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (sessionId) {
      return stripe.redirectToCheckout({ sessionId: sessionId });
    })
    .then(function (result) {
      if (result.error) {
        alert(result.error.message);
      }
    })
    .catch(function (error) {
      console.error('Erreur:', error);
    })};
  });
</script></>
app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = "whsec_5UUdkh73ilUUlb1UoIgdFtDdQXd2FEqs";

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Erreur Webhook : ", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gérer l'événement checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("Payment successful for session:", session.id);
    // Tu peux ici marquer ton utilisateur comme abonné
  }

  res.status(200).send("Event received");
});
