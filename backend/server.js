require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const axios = require("axios"); 
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.post("/compile", async (req, res) => {
    const { code, language } = req.body;
    const languageMap = {
        "javascript": { language: "nodejs", versionIndex: "5" },
        "python": { language: "python3", versionIndex: "4" },
        "java": { language: "java", versionIndex: "4" },
        "c": { language: "c", versionIndex: "5" },
        "cpp": { language: "cpp17", versionIndex: "1" }
    };

    if (!languageMap[language]) {
        return res.status(400).json({ error: "Unsupported language" });
    }

    try {
        const response = await axios.post("https://api.jdoodle.com/v1/execute", {
            script: code,
            language: languageMap[language].language,
            versionIndex: languageMap[language].versionIndex,
            clientId: process.env.JDOODLE_CLIENT_ID, 
            clientSecret: process.env.JDOODLE_CLIENT_SECRET
            
        });
        res.json(response.data);
    } catch (error) {
        console.error("JDoodle Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to compile code" });
    }
});
require("./sockets/codeSocket")(io);
server.listen(5000, () => console.log("Server running on 5000"));