import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-7b6c090f/health", (c) => {
  return c.json({ status: "ok" });
});

// ── USER REGISTRATION ──────────────────────────────────────────
app.post("/make-server-7b6c090f/users/register", async (c) => {
  try {
    const body = await c.req.json();
    const { name, mobile, dob } = body;

    if (!name || !mobile || !dob) {
      return c.json({ error: "Missing required fields: name, mobile, dob" }, 400);
    }

    // Check if user already exists
    const existing = await kv.get(`user:${mobile}`);
    if (existing) {
      return c.json({ error: "User already registered with this mobile number" }, 409);
    }

    const user = { name, mobile, dob, createdAt: new Date().toISOString() };
    await kv.set(`user:${mobile}`, user);

    // Track all user mobiles for admin listing
    const usersList: string[] = (await kv.get("users_list")) || [];
    if (!usersList.includes(mobile)) {
      usersList.push(mobile);
      await kv.set("users_list", usersList);
    }

    console.log(`User registered: ${name} (${mobile})`);
    return c.json({ success: true, user });
  } catch (err) {
    console.log("Register error:", err);
    return c.json({ error: `Registration failed: ${err}` }, 500);
  }
});

// ── USER LOGIN ─────────────────────────────────────────────────
app.post("/make-server-7b6c090f/users/login", async (c) => {
  try {
    const body = await c.req.json();
    const { name, dob } = body;

    if (!name || !dob) {
      return c.json({ error: "Missing required fields: name, dob" }, 400);
    }

    // Get all users and match
    const usersList: string[] = (await kv.get("users_list")) || [];
    const enteredDate = new Date(dob);
    const enteredMonth = enteredDate.getMonth();
    const enteredDay = enteredDate.getDate();

    for (const mobile of usersList) {
      const user: any = await kv.get(`user:${mobile}`);
      if (!user) continue;

      const userDate = new Date(user.dob);
      if (
        user.name.toLowerCase() === name.toLowerCase() &&
        userDate.getMonth() === enteredMonth &&
        userDate.getDate() === enteredDay
      ) {
        console.log(`User logged in: ${user.name} (${mobile})`);
        return c.json({ success: true, user });
      }
    }

    return c.json({ error: "Invalid credentials. Check your name and date of birth." }, 401);
  } catch (err) {
    console.log("Login error:", err);
    return c.json({ error: `Login failed: ${err}` }, 500);
  }
});

// ── GET MEDICINES ──────────────────────────────────────────────
app.get("/make-server-7b6c090f/medicines/:mobile", async (c) => {
  try {
    const mobile = c.req.param("mobile");
    const medicines = (await kv.get(`medicines:${mobile}`)) || [];
    return c.json({ success: true, medicines });
  } catch (err) {
    console.log("Get medicines error:", err);
    return c.json({ error: `Failed to fetch medicines: ${err}` }, 500);
  }
});

// ── SAVE MEDICINES (full list) ─────────────────────────────────
app.post("/make-server-7b6c090f/medicines/:mobile", async (c) => {
  try {
    const mobile = c.req.param("mobile");
    const body = await c.req.json();
    const { medicines } = body;

    if (!Array.isArray(medicines)) {
      return c.json({ error: "medicines must be an array" }, 400);
    }

    await kv.set(`medicines:${mobile}`, medicines);
    console.log(`Medicines saved for ${mobile}: ${medicines.length} items`);
    return c.json({ success: true, count: medicines.length });
  } catch (err) {
    console.log("Save medicines error:", err);
    return c.json({ error: `Failed to save medicines: ${err}` }, 500);
  }
});

// ── SAVE CONTACT MESSAGE ───────────────────────────────────────
app.post("/make-server-7b6c090f/contact", async (c) => {
  try {
    const body = await c.req.json();
    const { name, phone, message } = body;

    if (!name || !phone || !message) {
      return c.json({ error: "Missing required fields: name, phone, message" }, 400);
    }

    const timestamp = Date.now().toString();
    const contactEntry = {
      id: timestamp,
      name,
      phone,
      message,
      receivedAt: new Date().toISOString(),
    };

    await kv.set(`contact:${timestamp}`, contactEntry);

    // Track contact IDs
    const contactList: string[] = (await kv.get("contact_list")) || [];
    contactList.push(timestamp);
    await kv.set("contact_list", contactList);

    console.log(`Contact message saved from ${name} (${phone})`);
    return c.json({ success: true });
  } catch (err) {
    console.log("Contact error:", err);
    return c.json({ error: `Failed to save contact: ${err}` }, 500);
  }
});

Deno.serve(app.fetch);
