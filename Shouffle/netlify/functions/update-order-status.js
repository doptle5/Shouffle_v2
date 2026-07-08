exports.handler = async (event) => {
  try {
    const { orderId, customer, status } = JSON.parse(event.body);

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    const emoji =
      status === "Cancelled"
        ? "❌"
        : status === "Confirmed"
        ? "✅"
        : "🟡";

    const message =
`${emoji} *ORDER STATUS UPDATED*

━━━━━━━━━━━━━━

🆔 *Order ID*
${orderId}

👤 *Customer*
${customer}

📌 *New Status*
${status}

━━━━━━━━━━━━━━`;

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "Markdown"
        })
      }
    );

    if (!response.ok) {
      throw new Error("Telegram API error");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: err.message
      })
    };
  }
};
