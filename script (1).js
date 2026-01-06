export default async function handler(req, res) {
  try {
    const { ingredients, dish } = await req.json();

    const prompt = `
You are a professional chef AI.
Create a detailed recipe for ${dish} using: ${ingredients}.
Include all spices, oils, missing items, and step-by-step instructions.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": \`Bearer ${process.env.OPENAI_API_KEY}\`
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8
      })
    });

    const data = await response.json();
    res.status(200).json({ result: data.choices?.[0]?.message?.content || "No recipe generated." });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
}
