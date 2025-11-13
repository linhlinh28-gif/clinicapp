const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");

const prisma = new PrismaClient();
const router = Router();

// All routes below here require login
router.use((req, res, next) => {
  if (!req.session.user)
    return res.status(401).json({ error: "Not authenticated" });
  next();
});

// List appointments (scoped to role)
router.get("/", async (req, res, next) => {
  try {
    const u = req.session.user;
    const { from, to, doctorId, patientId } = req.query;

    const where = {};

    if (from && to) {
      where.startsAt = {
        gte: new Date(from),
        lte: new Date(to),
      };
    }
    if (doctorId) where.doctorId = String(doctorId);
    if (patientId) where.patientId = String(patientId);

    // doctor sees their own schedule
    if (u.role === "doctor") {
      const doctor = await prisma.doctor.findFirst({ where: { userId: u.id } });
      if (doctor) where.doctorId = doctor.id;
    }

    // patient sees their own appointments
    if (u.role === "patient") {
      const patient = await prisma.patient.findFirst({
        where: { userId: u.id },
      });
      if (patient) where.patientId = patient.id;
    }

    const appts = await prisma.appointment.findMany({ where });
    res.json(appts);
  } catch (e) {
    next(e);
  }
});

const upsertSchema = z.object({
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  reason: z.string().optional().nullable(),
});

async function conflictExists(doctorId, start, end, excludeId = null) {
  const overlapping = await prisma.appointment.findFirst({
    where: {
      doctorId,
      startsAt: { lt: end },
      endsAt: { gt: start },
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
    select: { id: true },
  });
  return !!overlapping;
}

// Create appointment
router.post("/", async (req, res, next) => {
  try {
    const body = upsertSchema.parse(req.body);
    const start = new Date(body.startsAt);
    const end = new Date(body.endsAt);

    if (await conflictExists(body.doctorId, start, end)) {
      return res.status(409).json({ error: "Time conflict" });
    }

    const appt = await prisma.appointment.create({
      data: {
        ...body,
        startsAt: start,
        endsAt: end,
        status: "scheduled",
      },
    });

    res.status(201).json(appt);
  } catch (e) {
    next(e);
  }
});

// Update appointment
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = upsertSchema.partial().parse(req.body);

    if (body.startsAt && body.endsAt && body.doctorId) {
      const start = new Date(body.startsAt);
      const end = new Date(body.endsAt);
      if (await conflictExists(body.doctorId, start, end, id)) {
        return res.status(409).json({ error: "Time conflict" });
      }
    }

    const appt = await prisma.appointment.update({
      where: { id },
      data: body,
    });

    res.json(appt);
  } catch (e) {
    next(e);
  }
});

// Delete appointment
router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.appointment.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

module.exports = router;
