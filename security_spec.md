# Security Spec: Mangalam Ayurveda Database Access Controls

## Data Invariants

1. **Identity & Ownership Integrity**: A user can only read, write, or update their own bookings, quiz results, and inquiry orders.
2. **Review/Feedback Integrity**: Any signed-in user can submit feedback and reviews for remedies, but they cannot edit or delete other users' feedback, and they must verify their UID matches.
3. **Immutability of Key Fields**: Once created, `userId` and `createdAt` must never be altered during updates.
4. **Newsletter Subscriptions**: Anyone can subscribe to the newsletter, but only authorized administrators (verified via rules or specific checks) can query the complete subscriber list.

## "Dirty Dozen" Threat Payloads (Verification Cases)

The following malicious payload attempts are designed to test the database filters, ensuring they are rejected with `PERMISSION_DENIED` at the rule level:

1. **Identity Theft: Spoofed Booking Owner**: Creating a booking document where `userId` is set to user B, but request auth UID is user A.
2. **Rogue Query: Listing Other Users' Consultations**: Attempting to query all bookings without specifying a `where("userId", "==", uid)` query guard.
3. **Inquiry Poisoning: Custom Admin Privilege Escalation**: Submitting a compounding order injecting custom admin flags or mutating system fields.
4. **Outcome State Hijacking: Overriding Completion Status**: Attempting to alter an inquiry status from `submitted` back to anything unauthorized.
5. **PII Exposure: Harvesting Newsletter Signups**: An authenticated standard user attempting to read/list `/newsletter_subscribers`.
6. **Double-Write Hijacking: Modifying Sibling Data**: Attempting to edit a brother document with unrelated metadata.
7. **Review Manipulation: Mutating Competitor Feedback**: An authenticated user attempting to overwrite another client's remedy review.
8. **Resource Exhaustion: Gigantic Custom ID**: Ingesting a 1MB string as a document name/ID.
9. **Creation Timestamp Spoofing**: Supplying a client-side timestamp for `createdAt` instead of a certified server parameter.
10. **Orphaned Row Injection**: Appending a booking for a nonexistent date/slot string or mismatching formats.
11. **Shadow Field Injection**: Submitting an order with additional parameters not defined in the schema blueprint (such as `isCompoundingFree: true`).
12. **Anonymous Admin Claim**: Accessing administrative resources assuming custom token claims without explicit collection/role lookups.

All of these are bound by strict rule patterns, validated by the Fortress security rules compiled below.
