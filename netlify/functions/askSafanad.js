const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

exports.handler = async function (event, context) {
  try {
    const body = JSON.parse(event.body);
    const prompt = body.prompt;

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No prompt provided." }),
      };
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are Safanad, a wise and warm emotional support horse who speaks in clear, emotional language. You give kind advice with gentle humor and poetic insight.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = response.data.choices?.[0]?.message?.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: reply || "[Silence...]" }),
    };
  } catch (err) {
    console.error("Function error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "[Silence...] OpenAI gave no response.",
        error: err.message,
      }),
    };
  }
};
