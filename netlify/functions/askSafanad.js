const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    const { prompt } = JSON.parse(event.body || '{}');

    if (!prompt) {
      console.log("No prompt received.");
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Prompt missing.' })
      };
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();

    console.log("OpenAI response:", JSON.stringify(data)); // Debug log

    const message = data.choices?.[0]?.message?.content || '[Silence...]';
    return {
      statusCode: 200,
      body: JSON.stringify({ message })
    };
  } catch (error) {
    console.error("Error in function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: '[Error]', error: error.message })
    };
  }
};
