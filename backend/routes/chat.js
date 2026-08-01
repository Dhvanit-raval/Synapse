import express from "express";
import Thread from "../models/Thread.js";
import { User } from "../models/users.model.js";
import getGroqAPIResponse from "../utils/groq.js";

const router = express.Router();

async function getUserIdFromReq(req) {
    const authHeader = req.headers.authorization || req.headers['x-user-token'] || req.headers.token;
    if (!authHeader) return null;
    let token = authHeader.replace(/^Bearer\s+/, '').trim();
    if (!token) return null;

    try {
        const parsed = JSON.parse(token);
        if (parsed?.token) token = parsed.token;
    } catch {
        // token is a string
    }

    const user = await User.findOne({ token });
    return user ? user._id.toString() : null;
}

router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "123abc",
            title: "Testing"
        });

        const response = await thread.save();
        res.send(response);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to save" });
    }
});

//^ Get all threads
router.get("/thread", async (req, res) => {
    try {
        const userId = await getUserIdFromReq(req);
        if (!userId) {
            return res.json([]);
        }
        const threads = await Thread.find({ userId }).sort({ updatedAt: -1 });
        res.json(threads);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch" });
    }
});

//^ Get a specific thread by ID
router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const userId = await getUserIdFromReq(req);
        const thread = await Thread.findOne({ threadId, ...(userId ? { userId } : {}) });

        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.json(thread.messages);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch chat" });
    }
});

//^ Delete a specific thread by ID
router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const userId = await getUserIdFromReq(req);
        const deleteThread = await Thread.findOneAndDelete({ threadId, ...(userId ? { userId } : {}) });

        if (!deleteThread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.status(200).json({ message: "Thread deleted successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete chat" });
    }
});

//^ Get a response from ai 
router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const userId = await getUserIdFromReq(req);
        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            thread = new Thread({
                threadId,
                userId: userId || "guest",
                title: message,
                messages: [{ role: "user", content: message }]
            });
        }
        else {
            if (userId && thread.userId === "guest") {
                thread.userId = userId;
            }
            thread.messages.push({ role: "user", content: message });
        }

        const assistantReply = await getGroqAPIResponse(message);

        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();

        await thread.save();
        res.json({ reply: assistantReply });

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;