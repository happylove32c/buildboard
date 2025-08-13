import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert product strategist. The user will give you a raw idea. Turn it into: 1. A clear MVP description. 2. 3–6 build phases with short explanations. 3. A breakdown of each phase into small, daily tasks. Keep language simple, concise, and actionable." },
        ...messages,
      ],
    });

    return new Response(
      JSON.stringify({ reply: response.choices[0].message.content }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500 }
    );
  }
}


