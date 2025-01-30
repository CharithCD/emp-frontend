# Leave Management Module - Employee Management System

## Overview
The Leave Management Module is a feature of the Employee Management System, built using Next.js. This module allows employees to request leave, admins to approve or reject leave requests.

## Features
- Employee leave request submission
- Admin approval/rejection workflow
- Leave history tracking
- Secure authentication & authorization

## Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS, Shadcn
- **Authentication:** JWT (JSON Web Token)

## Prerequisites
Ensure you have the following installed:
- Node.js (v18+ recommended)
- npm or yarn

## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/CharithCD/emp-frontend.git
   cd frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Create a `.env` file in the root directory and add the following:**
   ```env
   ACCESS_TOKEN_SECRET=your_secret_key
   ```

## Running the Application Locally

1. **Start the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.



## Project Structure
```
leave-management/
├── components/      # Reusable UI components
├── app/             # Next.js app (app router)
│   ├── (admin)/     # Admin dashboard
│   ├── (auth)/      # Authentication pages
│   ├── (employee)/  # Employee pages
├── hooks/         
├── lib/          
├── public/          # Static assets
├── .env             # Environment variables
└── README.md        # Project documentation
```

