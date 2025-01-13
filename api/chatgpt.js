export default async function handler(req, res) {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }
  
    const apiKey = process.env.OPENAI_API_KEY; // Use a secure server-side variable
    const systemMessage = { // Add beginning of prompt here
        "role": "system", "content": "Generate 5 medium multiple choice questions about"
      }
    const { messages } = req.body;
  
    if (!apiKey || !messages) {
      res.status(400).json({ error: "Missing required parameters or API key" });
      return;
    }
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [systemMessage,
          ...messages],
        }),
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
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
  
