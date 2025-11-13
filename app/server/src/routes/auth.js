const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { z } = require("zod");

const prisma = new PrismaClient();
const router = Router();

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Register a new patient user
router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = credsSchema.parse(req.body);
    const emailLower = email.toLowerCase();

    const existing = await prisma.appUser.findUnique({ where: { emailLower } });
    if (existing) return res.status(409).json({ error: "Email in use" });

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.appUser.create({
      data: { email, emailLower, passwordHash, role: "patient" },
    });

    // simple patient profile tied to this user
    await prisma.patient.create({
      data: { userId: user.id, fullName: email },
    });

    req.session.user = { id: user.id, role: user.role, email: user.email };
    res.status(201).json(req.session.user);
  } catch (e) {
    next(e);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = credsSchema.parse(req.body);
    const emailLower = email.toLowerCase();

    const user = await prisma.appUser.findUnique({ where: { emailLower } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    req.session.user = { id: user.id, role: user.role, email: user.email };
    res.json(req.session.user);
  } catch (e) {
    next(e);
  }
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.status(204).end();
  });
});

// Current user
router.get("/me", (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ error: "Not authenticated" });
  res.json(req.session.user);
});

module.exports = router;
