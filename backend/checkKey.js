import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY not set (check .env or env vars)");
    process.exit(1);
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function run() {
    try {
        const res = await groq.chat.completions.create({
            messages: [{ role: "user", content: "get me a joke" }],
            model: "openai/gpt-oss-20b",
        });
        console.log("Key works — received response:");
        console.log(res.choices?.[0]?.message?.content ?? JSON.stringify(res));
    } catch (err) {
        console.error("Request failed:", err?.message ?? err);
        if (err?.response?.status) console.error("HTTP status:", err.response.status);
        process.exit(2);
    }
}

run();