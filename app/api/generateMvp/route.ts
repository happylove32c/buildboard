import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY, // use your OpenRouter key
});

export async function POST(req: Request) {
  try {
    const { idea, description } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert product strategist. 
The user will give you an idea name and description. 
Respond ONLY in valid JSON with this exact schema:

{
  "steps": [
    {
      "step": number,
      "title": string,
      "tasks": [
        { "day": number, "task": string, "completed": false }
      ]
    }
  ]
}

Rules:
- The steps must be based on the idea and description provided.
- The steps are based on frontend to backend movement
- Include 3–6 steps.
- The days are continious, starting from 1.
- Each step must have 4–6 daily tasks.
- "completed" must always be false for every task.
- Do not include any text outside the JSON.`,
        },
        {
          role: "user",
          content: `Idea: ${idea}\nDescription: ${description}`,
        },
      ],
      temperature: 0.7,
    });

    const raw = response.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);

    return new Response(JSON.stringify(parsed), { status: 200 });
  } catch (error: any) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500 }
    );
  }
}
