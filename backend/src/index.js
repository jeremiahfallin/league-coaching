require("dotenv").config({ path: "variables.env" });
const createServer = require("./createServer");
const db = require("./db");
const cors = require("cors");
const getCustomMatch = require("./getCustomMatch");

const server = createServer();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
};

const options = {
  cors: corsOptions
};

server.express.get("/addmatch", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  try {
    data = await getCustomMatch(req.query.match);
  } catch (err) {
    res.send({ message: "No match with that ID." });
  }
  res.send({ data });
});

server.start(options, () => {
  console.log(
    `Server is now running on port http://localhost:${process.env.port}`
  );
});
