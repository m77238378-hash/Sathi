import express, { Response } from "express";
import path from "path";
import * as dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { db } from "./src/db/index.ts";
import { users, newsletterSubscribers, inquiries, quizResults, bookings, remedyFeedbacks } from "./src/db/schema.ts";
import { requireAuth, AuthRequest } from "./src/middleware/auth.ts";
import { eq, desc, and } from "drizzle-orm";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper function to sync/get or create user in Cloud SQL
async function syncAndGetUser(uid: string, email: string) {
  try {
    const existing = await db.select().from(users).where(eq(users.uid, uid));
    if (existing.length > 0) {
      return existing[0];
    }
    const inserted = await db.insert(users).values({ uid, email }).returning();
    return inserted[0];
  } catch (error) {
    console.error("Failed to sync/create user in Cloud SQL:", error);
    throw error;
  }
}

// Ensure user profile synchronizes upon authenticated handshake
app.post("/api/users/sync", requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user!.uid;
    const email = req.user!.email || "";
    const syncedUser = await syncAndGetUser(uid, email);
    res.json({ success: true, user: syncedUser });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to synchronize profile: " + error.message });
  }
});

// API Route: Add subscriber to Newsletter
app.post("/api/newsletter", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email address" });
    }
    
    // Insert subscriber
    await db.insert(newsletterSubscribers)
      .values({ email: email.trim().toLowerCase() })
      .onConflictDoNothing();

    res.json({ success: true });
  } catch (error: any) {
    console.error("Newsletter submission failure:", error);
    res.status(500).json({ error: "Database error during newsletter subscription" });
  }
});

// API Route: Submit Cart/Compounding Inquiry
app.post("/api/inquiries", async (req, res) => {
  try {
    const {
      inquiryId,
      userId,
      name,
      email,
      phone,
      anupanaPreference,
      consultationNotes,
      selectedPaymentMethod,
      totalPrice,
      status,
      items,
      gpayTxnId,
      isPaid
    } = req.body;

    if (!inquiryId || !name || !phone || !items) {
      return res.status(400).json({ error: "Missing required inquiry fields" });
    }

    await db.insert(inquiries).values({
      inquiryId,
      userId: userId || "anonymous_client",
      name: name.trim(),
      email: (email || "").trim(),
      phone: phone.trim(),
      anupanaPreference,
      consultationNotes,
      selectedPaymentMethod,
      totalPrice,
      status: status || "submitted",
      items,
      gpayTxnId,
      isPaid: !!isPaid
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error("Inquiry submission failure:", error);
    res.status(500).json({ error: "Database failure creating compounding inquiry" });
  }
});

// API Route: Fetch User Inquiries (Secure)
app.get("/api/inquiries", requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user!.uid;
    const userInquiries = await db
      .select()
      .from(inquiries)
      .where(eq(inquiries.userId, uid))
      .orderBy(desc(inquiries.createdAt));
    res.json(userInquiries);
  } catch (error: any) {
    console.error("Failed to fetch inquiries:", error);
    res.status(500).json({ error: "Database query errors fetching inquiries" });
  }
});

// API Route: Save Quiz Result (Nadi Pariksha)
app.post("/api/quiz-results", async (req, res) => {
  try {
    const { quizResultId, userId, dominantDosha, doshaResult } = req.body;
    if (!quizResultId || !userId || !dominantDosha || !doshaResult) {
      return res.status(400).json({ error: "Missing required quiz results parameters" });
    }

    await db.insert(quizResults).values({
      quizResultId,
      userId,
      dominantDosha,
      doshaResult
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error("Save quiz result failure:", error);
    res.status(500).json({ error: "Database error saving evaluation results" });
  }
});

// API Route: Fetch Consultation Bookings (Secure)
app.get("/api/bookings", requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user!.uid;
    const userBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, uid))
      .orderBy(desc(bookings.createdAt));
    res.json(userBookings);
  } catch (error: any) {
    console.error("Failed to fetch bookings:", error);
    res.status(500).json({ error: "Database query error retrieving consultations" });
  }
});

// API Route: Create Consultation Booking (Secure)
app.post("/api/bookings", requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user!.uid;
    const { bookingId, type, date, time, meetingUri, meetingCode, notes } = req.body;
    if (!bookingId || !type || !date || !time) {
      return res.status(400).json({ error: "Missing required booking details" });
    }

    await db.insert(bookings).values({
      bookingId,
      userId: uid,
      type,
      date,
      time,
      meetingUri,
      meetingCode,
      notes
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error("Booking creation failure:", error);
    res.status(500).json({ error: "Database failure creating consultation reservation" });
  }
});

// API Route: Fetch Remedy Feedbacks for a specific Product (Public)
app.get("/api/feedbacks/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const feedbacks = await db
      .select()
      .from(remedyFeedbacks)
      .where(eq(remedyFeedbacks.productId, productId))
      .orderBy(desc(remedyFeedbacks.createdAt));
    res.json(feedbacks);
  } catch (error: any) {
    console.error("Feedback query failure:", error);
    res.status(500).json({ error: "Database query error retrieving product reviews" });
  }
});

// API Route: Post Feedback Review (Secure)
app.post("/api/feedbacks", requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user!.uid;
    const { feedbackId, productId, displayName, rating, comment } = req.body;

    if (!feedbackId || !productId || !displayName || rating === undefined || !comment) {
      return res.status(400).json({ error: "Missing required review feedback elements" });
    }

    await db.insert(remedyFeedbacks).values({
      feedbackId,
      productId,
      userId: uid,
      displayName: displayName.trim(),
      rating,
      comment: comment.trim()
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error("Feedback submission failure:", error);
    res.status(500).json({ error: "Database failure submitting product feedback review" });
  }
});

// API Route: Delete Feedback Review (Secure)
app.delete("/api/feedbacks/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user!.uid;
    const { id } = req.params;

    // Delete review only if owned by this user
    const result = await db
      .delete(remedyFeedbacks)
      .where(and(eq(remedyFeedbacks.feedbackId, id), eq(remedyFeedbacks.userId, uid)))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: "Review not found or unauthorized to delete" });
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error("Feedback deletion failure:", error);
    res.status(500).json({ error: "Database error deleting feedback review" });
  }
});

// Vite Server initialization & hosting handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
