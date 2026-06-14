import { User } from "firebase/auth";

// Helper to construct authorization headers
async function getAuthHeaders(user: User | null) {
  if (!user) return {};
  try {
    const token = await user.getIdToken();
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  } catch (error) {
    console.error("Error getting ID token:", error);
    return {
      "Content-Type": "application/json",
    };
  }
}

// 1. Sync User Profile
export async function syncUserProfile(user: User) {
  const headers = await getAuthHeaders(user);
  const res = await fetch("/api/users/sync", {
    method: "POST",
    headers,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to sync user profile");
  }
  return res.json();
}

// 2. Newsletter Subscription
export async function subscribeNewsletter(email: string) {
  const res = await fetch("/api/newsletter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to subscribe to newsletter");
  }
  return res.json();
}

// 3. Submit Compounding Inquiry
export async function submitCompoundingInquiry(orderData: any) {
  const res = await fetch("/api/inquiries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to submit inquiry");
  }
  return res.json();
}

// 4. Save Quiz Result
export async function saveQuizResultInCloudSQL(quizResult: any) {
  const res = await fetch("/api/quiz-results", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(quizResult),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to save quiz result");
  }
  return res.json();
}

// 5. Fetch Bookings
export async function fetchUserBookings(user: User) {
  const headers = await getAuthHeaders(user);
  const res = await fetch("/api/bookings", {
    method: "GET",
    headers,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to retrieve bookings");
  }
  return res.json();
}

// 6. Create Booking
export async function createUserBooking(user: User, bookingData: any) {
  const headers = await getAuthHeaders(user);
  const res = await fetch("/api/bookings", {
    method: "POST",
    headers,
    body: JSON.stringify(bookingData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create reservation booking");
  }
  return res.json();
}

// 7. Get Product Feedback Reviews (Public)
export async function fetchProductFeedback(productId: string) {
  const res = await fetch(`/api/feedbacks/${productId}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to retrieve product reviews");
  }
  return res.json();
}

// 8. Submit Product Feedback Review (Secure)
export async function submitProductFeedback(user: User, feedbackData: any) {
  const headers = await getAuthHeaders(user);
  const res = await fetch("/api/feedbacks", {
    method: "POST",
    headers,
    body: JSON.stringify(feedbackData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to submit product review");
  }
  return res.json();
}

// 9. Delete Product Feedback Review (Secure)
export async function deleteProductFeedback(user: User, feedbackId: string) {
  const headers = await getAuthHeaders(user);
  const res = await fetch(`/api/feedbacks/${feedbackId}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to delete product review");
  }
  return res.json();
}
