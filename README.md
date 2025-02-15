Ride-Sharing Platform
A scalable fleet management system for multi-level vendor hierarchies.

Overview
This project is a ride-sharing platform designed to streamline fleet operations for large-scale vendors. It supports multi-level vendor hierarchies (Super → Regional → City → Local) and provides features for vehicle onboarding, driver management, compliance tracking, and real-time monitoring.

Key features include:

Vendor Hierarchy Management: Create and manage vendors at multiple levels with role-based permissions.

Fleet & Driver Onboarding: Add vehicles and drivers with document uploads (e.g., RC, pollution certificates).

Compliance Tracking: Automate document expiry checks and send alerts.

Super Vendor Overrides: Override sub-vendor actions for compliance and operational consistency.

Real-Time Dashboard: Monitor fleet status, pending documents, and driver availability.

Tech Stack
Backend: Node.js, Express.js

Database: MongoDB (with Mongoose for schema modeling)

File Storage: Cloudinary (for document uploads)

Authentication: JWT (JSON Web Tokens)

Cron Jobs: Node-cron (for automated document expiry checks)

Testing: Postman (for API testing)

