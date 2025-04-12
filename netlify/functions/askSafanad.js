const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async function (event, context) {
  try {
    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Prompt is missing." }),
      };
    }

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are Safanad, a wise, emotionally intelligent horse who offers soulful guidance with humor, grace, and occasional sass. Keep responses short and heartfelt.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 150,
    });

    const reply = completion?.data?.choices?.[0]?.message?.content;

    console.log("🔍 OpenAI raw response:", completion.data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: reply || "[Silence... OpenAI gave no response.]" }),
    };
  } catch (error) {
    console.error("🔥 Error in askSafanad:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "[Safanad whinnies nervously...] Something went wrong.",
        error: error.message,
      }),
    };
  }
};
