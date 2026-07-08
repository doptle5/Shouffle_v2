// netlify/functions/notify-order.js
//
// This function receives order details from your website's order form
// and sends a Telegram message to you using your bot.
//
// SETUP:
// 1. Place this file at: netlify/functions/notify-order.js  (inside your project root)
// 2. In Netlify dashboard: Site settings → Environment variables → add:
//      TELEGRAM_BOT_TOKEN = your bot token from BotFather
//      TELEGRAM_CHAT_ID   = your chat ID
// 3. Redeploy your site after adding the variables.

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const order = JSON.parse(event.body);

  const {
  orderId,
  name,
  phone,
  email,
  address,
  product,
  qty,
  payment,
  total,
  notes
} = order;

   const message =
`🆕 *NEW ORDER RECEIVED*

━━━━━━━━━━━━━━

🆔 *Order ID*
${orderId}

🟡 *Status*
Pending Confirmation

━━━━━━━━━━━━━━

👤 *Customer*
${name}

📞 *Phone*
${phone}

${email ? `📧 *Email*\n${email}\n` : ""}

📍 *Address*
${address}

━━━━━━━━━━━━━━

🥞 *Product*
${product}

📦 *Quantity*
${qty}

💳 *Payment*
${payment}

💰 *Total*
₱${total}

${notes ? `📝 *Notes*\n${notes}\n` : ""}

━━━━━━━━━━━━━━`;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return { statusCode: 500, body: `Telegram error: ${errText}` };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    return { statusCode: 500, body: `Error: ${err.message}` };
  }
};
