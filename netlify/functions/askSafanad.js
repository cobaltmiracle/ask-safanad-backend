const fetch = require("node-fetch");

let ipCounts = {}; // In-memory store (restarts daily on Netlify)

exports.handler = async (event) => {
  const ip = event.headers["x-forwarded-for"] || "unknown";
  ipCounts[ip] = (ipCounts[ip] || 0) + 1;

  if (ipCounts[ip] > 12) {
    return {
      statusCode: 429,
      body: JSON.stringify({ message: "Limit reached. Please try again tomorrow." })
    };
  }

  const body = JSON.parse(event.body || "{}");
  const userInput = body.prompt || "";

  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
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
          content: "You are Safanad
