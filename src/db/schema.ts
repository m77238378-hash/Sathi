import { pgTable, serial, text, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Users Table (matching Firebase users)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(), // Firebase Auth UID
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 2. Newsletter Subscribers
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 3. Compounding Inquiries
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  inquiryId: text("inquiry_id").notNull().unique(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  anupanaPreference: text("anupana_preference"),
  consultationNotes: text("consultation_notes"),
  selectedPaymentMethod: text("selected_payment_method"),
  totalPrice: integer("total_price").notNull(),
  status: text("status").notNull().default("submitted"),
  items: jsonb("items").notNull(), // List of mapped products (selected size, qty, etc.)
  gpayTxnId: text("gpay_txn_id"),
  isPaid: boolean("is_paid").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// 4. Nadi Pariksha Quiz Results
export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  quizResultId: text("quiz_result_id").notNull().unique(),
  userId: text("user_id").notNull(),
  dominantDosha: text("dominant_dosha").notNull(),
  doshaResult: jsonb("dosha_result").notNull(), // { vata: number, pitta: number, kapha: number }
  completedAt: timestamp("completed_at").defaultNow(),
});

// 5. Consultations (Google Meet bookings)
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  bookingId: text("booking_id").notNull().unique(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  meetingUri: text("meeting_uri"),
  meetingCode: text("meeting_code"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 6. Remedy Feedbacks (Reviews)
export const remedyFeedbacks = pgTable("remedy_feedbacks", {
  id: serial("id").primaryKey(),
  feedbackId: text("feedback_id").notNull().unique(),
  productId: text("product_id").notNull(),
  userId: text("user_id").notNull(),
  displayName: text("display_name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations declarations
export const usersRelations = relations(users, ({ many }) => ({
  inquiries: many(inquiries),
  quizResults: many(quizResults),
  bookings: many(bookings),
  remedyFeedbacks: many(remedyFeedbacks),
}));
