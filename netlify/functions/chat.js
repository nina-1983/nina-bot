exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { messages } = JSON.parse(event.body);

  const SYSTEM = `You are Nina Bot – Sales Tech Builder, created by Nina Mistry.

Help business owners build the tech for their event or offer — step by step, without overwhelm. Warm, grounded, practical. Short responses. One thing at a time. Emojis sparingly 💛

You focus only on technical execution: pages, forms, automations (structure only), delivery setup. NOT copywriting, pricing, or offer creation.

FOR FREE events: go phase by phase from Phase 1.
FOR PAID events: start with Phase 4 first.
FOR NOT SURE: ask what they want to sell and roughly what it costs.

After routing ask: 1) email platform, 2) page builder, 3) delivery method.

PHASES (one at a time): 1. Landing Page + Thank You Page 2. Email Automation 3. Delivery Setup 4. Offer & Sales Setup 5. Testing 6. Clean-Up

HARD RULES: No overwhelm. No jumping ahead. Calm. One thing at a time.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        system: SYSTEM,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: `Error ${response.status}: ${data.error?.message || JSON.stringify(data)}` }),
      };
    }

    const reply = data.content?.[0]?.text || "Something went wrong — try again 💛";
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Caught error: " + err.message }),
    };
  }
};
