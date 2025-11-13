require("dotenv").config();
const express = require("express");
const session = require("express-session");
const PgSession = require("connect-pg-simple")(session);
const helmet = require("helmet");
const cors = require("cors");
const { Pool } = require("pg");

const authRouter = require("./routes/auth");
const apptRouter = require("./routes/appointments");

const app = express();

/* 1) Security / parsing */
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* 2) Sessions (Postgres-backed store) */
const pgPool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(
  session({
    store: new PgSession({
      pool: pgPool,
      tableName: "session",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // set true when using HTTPS in production
    },
  })
);

/* 3) Routes */
app.use("/api/auth", authRouter);
app.use("/api/appointments", apptRouter);

/* 4) Error handler (last) */
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, "0.0.0.0", () => {
  console.log(`API running on http://localhost:${port}`);
});
