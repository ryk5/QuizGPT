export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  const { topic, messages } = req.body; // Extract topic from request body

  // Validate all required parameters
  if (!apiKey || !topic || !messages) {
    res.status(400).json({ error: "Missing required parameters or API key" });
    return;
  }

  // Create dynamic system message with topic
  const systemMessage = {
    role: "system",
    content: `Generate 5 medium multiple choice questions about ${topic}`,
  };

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [systemMessage, ...messages],
      }),
    });

    // Handle API errors more safely
    if (!response.ok) {
      let errorDetails;
      try {
        errorDetails = await response.json();
      } catch (error) {
        errorDetails = { message: await response.text() };
      }
      res.status(response.status).json({ error: errorDetails });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in serverless function:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}