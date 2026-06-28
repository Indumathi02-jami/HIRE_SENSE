import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function testGroq() {
  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "user",
          content: "Explain MERN stack in 3 lines"
        }
      ],

      temperature: 0.7,
    });

    console.log(response.choices[0].message.content);

  } catch (error) {
    console.error("ERROR:", error);
  }
}

testGroq();