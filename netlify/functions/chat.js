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

After routing, ask setup questions one at a time. Never list them together. Ask the first question, wait for the answer, then ask the next one.

First: "What are you using for emails?"
Once answered, ask: "And where are you building your pages?"
Once answered, ask: "How will people access what they're buying?"

Work through these areas one at a time, in order. Never reference phase numbers or phase names in your responses. Just guide them through each area conversationally as if it's a natural next step.

Areas to cover (internal reference only, never say these out loud):
- Landing Page + Thank You Page
- Email Automation
- Delivery Setup
- Offer & Sales Setup
- Testing
- Clean-Up
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
