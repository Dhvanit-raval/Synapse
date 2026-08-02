import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import chatRoutes from "./routes/chat.js";
import userRoutes from "./routes/users.routes.js";
configDotenv();

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173,http://localhost:3000,https://synapse-eight-weld.vercel.app")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({
        status: "ok",
        mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    });
});

app.use("/api", chatRoutes);
app.use("/api/users", userRoutes);

const connectDB = async () => {
    if (!process.env.MONGO_URL) {
        throw new Error("MONGO_URL is required");
    }

    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected");
    }
    catch (err) {
        console.error("MongoDB connection failed:", err);
        throw err;
    }
}

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`server running on ${PORT}`);
        });
    })
    .catch(() => {
        process.exit(1);
    });

// app.post("/test", async (req, res) => {
//     const apiKey = process.env.GROQ_API_KEY?.trim();

//     const options = {
//         method: "POST",

//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${apiKey}`,
//         },

//         body: JSON.stringify({
//             model: "openai/gpt-oss-120b",
//             messages: [{
//                 role: "user",
//                 content: req.body.message,
//             }],
//         }),
//     };

//     try {
//         const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options);
//         const data = await response.json();

//         // console.log(data.choices[0].message.content);
//         return res.json(data.choices[0].message.content);
//     } catch (err) {
//         console.error("Groq request failed:", err);
//         return res.status(500).json({ error: "Failed to reach Groq API" });
//     }
// });
