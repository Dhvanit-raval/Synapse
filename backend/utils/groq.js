import { configDotenv } from "dotenv";

configDotenv();

const getGroqAPIResponse = async (message) => {
    const apiKey = process.env.GROQ_API_KEY?.trim();

    const options = {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },

        body: JSON.stringify({
            model: "openai/gpt-oss-20b",
            messages: [{
                role: "user",
                content: message,
            }],
        }),
    };

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.error?.message || "Groq API request failed");
        }

        // console.log(data.choices[0].message.content);
        return data.choices[0].message.content;
    } catch (err) {
        console.error("Groq request failed:", err);
        throw err;
    }
}

export default getGroqAPIResponse;
