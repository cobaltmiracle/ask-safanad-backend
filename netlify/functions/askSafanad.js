const fetch = require("node-fetch");

let ipCounts = {}; // In-memory IP rate limiter

exports.handler = async (event) => {
  const ip = event.headers["x-forwarded-for"] || "unknown";
  ipCounts[ip] = ipCounts[ip] || 0;
  ipCounts[ip] += 1;

  if (ipCounts[ip] > 12) {
    return {
      statusCode: 429,
      body: JSON.stringify({ message: "Limit reached. Please try again tomorrow." }),
    };
  }

  const body = JSON.parse(event.body || "{}");
  const userInput = body.prompt || "";

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are Safanad, the Cobalt Stallion. Respond only with sound-based emotional cues and occasional pithy insights in response to deep human questions.",
          },
          {
            role: "user",
            content: userInput,
          },
        ],
        max_tokens: 150,
