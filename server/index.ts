import express from "express";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

// Serve static files from root
app.use(express.static("."));

const PORT = 5000;
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Static server running on port ${PORT}`);
});
