const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

// 1. Middlewares - These must be at the top
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// 2. LOGIN ROUTE (The missing piece)
app.post("/login", (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Ensure users.json exists
        if (!fs.existsSync("./users.json")) {
            return res.status(404).json({ success: false, message: "users.json not found" });
        }

        const users = JSON.parse(fs.readFileSync("./users.json", "utf-8"));
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            console.log("✅ Login Success:", user.name);
            res.json({ success: true, name: user.name });
        } else {
            console.log("❌ Login Failed for:", email);
            res.json({ success: false });
        }
    } catch (error) {
        console.error("Login Server Error:", error);
        res.status(500).json({ success: false });
    }
});

// 3. GET QUESTIONS ROUTE
app.get("/questions/:subject", (req, res) => {
    try {
        const subject = req.params.subject.toLowerCase();
        const filePath = "./questions.json"; 

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "questions.json not found" });
        }

        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        if (data[subject]) {
            res.json(data[subject]);
        } else {
            res.json([]); 
        }
    } catch (error) {
        console.error("JSON Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 4. Start Server
app.listen(3000, () => {
    console.log("✅ Server running on http://localhost:3000");
});