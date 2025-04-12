const fetch = require("node-fetch");

let ipCounts = {}; // Simple in-memory rate limiter

exports.handler = async (event) => {
  const ip = event.headers["x-forwarded-for"] || "unknown";
  ipCounts[ip] = (ipCounts[ip] || 0) + 1;

  if (ipCounts[ip] > 12) {
    return {
      statusCode: 429,
      body: JSON.stringify({ message: "Limit reached. Try again tomorrow." })
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const userInput = body.prompt || "";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are Safanad, the Cobalt Stallion. Respond only with sound-based emotional cues and occasional pithy insights in response to deep human questions. If the question includes abusive or mocking language, do not respond."
          },
          {
            role: "user",
            content: userInput
          }
        ],
        max_tokens: 150
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: data?.choices?.[0]?.message?.content || "[Silence...]"
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Something went wrong.", detail: err.message })
    };
  }
};
