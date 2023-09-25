require('dotenv').config()


const express = require('express')
const app = express()
const PORT  = process.env.PORT || 3000;
const cors = require('cors')
app.use(express.json())
app.use(
    cors({
        origin: 'https://zwigato-food.netlify.app/',
    })
)
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
app.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: req.body.cartItems.map(item => {
                return {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: item.name
                        },
                        unit_amount_decimal: item.price
                    },
                    quantity: item.quantity
                }
            }),
            success_url: `${process.env.CLIENT_URL}`,
            cancel_url: `${process.env.CLIENT_URL}`
        })
        res.json({ url: session.url })
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

app.listen(PORT, () => {
    console.log("App is listening on port 3000");
})