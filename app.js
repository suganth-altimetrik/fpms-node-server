var mongoose = require("mongoose");

const express = require("express");
const cors = require("cors");

const router = require("./routes");
const rateLimit = require("express-rate-limit");

const { Server } = require("socket.io");

mongoose
  .connect(
    "mongodb+srv://cpplid:mouseBall100@cpplid.a2erh4i.mongodb.net/fpms?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("db connected");
  })
  .catch(() => {
    console.log("error in db connection");
  });

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(limiter);

app.use("/api/", router);

const server = require("http").createServer(app, {});

var io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("user is connected", socket.id);

  socket.on("join_room", (data) => {
    console.log("🚀 ~ socket.on ~ join_name:", data);
    socket.join(data);
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.log("socket connection error", err.message);
  });
});

global.io = io;

server.listen(6077, () => {
  console.log("Listening on port 6077!");
});
