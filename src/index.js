require("dotenv").config({ path: "variables.env" });
const createServer = require("./createServer");
const db = require("./db");
const cors = require("cors");
const getCustomMatch = require("./getCustomMatch");

const server = createServer();

const corsOptions = {
  origin: "http://localhost:7777",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
};

const options = {
  cors: corsOptions
};

server.express.get("/addmatch", async (req, res) => {
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
