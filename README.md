# Vendor Cab & Driver Onboarding Platform

A backend solution for managing vendor operations, driver onboarding, and vehicle onboarding for large-scale fleet operations. This platform supports a multi-level vendor hierarchy with role-based access, delegation, and centralized control for Super Vendors. It also integrates with Cloudinary for file uploads and uses scheduled tasks to manage compliance.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Demonstration](#demonstration)
- [License](#license)

## Overview

This project is designed to streamline fleet management and vendor operations by enabling:
- **Multi-Level Vendor Hierarchy:** Supports Super, Regional, City, and Local vendors.
- **Role-Based Access Control:** Each vendor level has specific permissions and delegated authorities.
- **Driver & Vehicle Onboarding:** Secure and efficient onboarding with file uploads (documents are stored on Cloudinary).
- **Compliance & Monitoring:** Scheduled tasks check document expiry and update driver/vehicle statuses automatically.
- **Centralized Dashboard:** Super Vendors get a complete view of the entire network along with the ability to override sub-vendor operations.

## Features

- **Multi-Level Vendor Hierarchy:** 
  - Parent-child relationships between vendors.
  - Virtual field (`subvendors`) for easy retrieval of sub-vendor data.
- **Authentication:** 
  - JWT-based authentication.
  - Secure password hashing with bcrypt.
- **File Uploads:**
  - Integration with Multer for handling multipart/form-data.
  - Direct file uploads to Cloudinary with automatic deletion of local files.
- **Compliance Automation:** 
  - Cron jobs to check document expiry and disable drivers or vehicles if necessary.
- **Delegation & Override:** 
  - Super Vendors can delegate permissions to sub-vendors and override their actions if needed.
- **Centralized Dashboard:** 
  - Aggregated view of fleet status, driver availability, and compliance reports across the vendor hierarchy.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **File Uploads:** Multer, Cloudinary
- **Authentication:** JWT, bcrypt
- **Scheduling:** node-cron

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/vendor-cab-driver-onboarding.git
   cd vendor-cab-driver-onboarding
