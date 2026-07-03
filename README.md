# Vacation Homes Rental Website

A full-stack Vacation Homes Rental Website built as a technical assessment project. The platform allows users to browse vacation rental properties, view property details, check availability, and submit booking requests. It also includes an admin dashboard for managing properties, bookings, and manually blocked unavailable dates.

The project is inspired by Airbnb-style rental platforms but is built as a clean, functional MVP with proper backend logic, database storage, authentication, and booking validation.

---

## Features

### Public Website

* Home page with search section
* Property listing page
* Property detail page
* Property images and amenities
* Check-in and check-out date selection
* Guest count selection
* Total price calculation based on number of nights
* Filtering by location, price, bedrooms, guests, and property type
* Responsive design for desktop and mobile

### User Authentication

* User registration
* User login
* User logout
* Authenticated users can submit booking requests
* Users can view their own bookings

### Admin Dashboard

* Admin login
* Admin-only protected routes
* Dashboard overview with stats
* Add new properties
* Edit existing properties
* Delete or deactivate properties
* Upload property images
* View all booking requests
* Update booking status
* Manually block unavailable dates for a property

### Booking Logic

The booking system includes proper backend validation:

* Check-out date must be after check-in date
* Past dates are not allowed
* Number of nights is calculated automatically
* Total price is calculated automatically
* Confirmed bookings block selected dates
* Manually blocked dates are unavailable
* Overlapping confirmed bookings are not allowed
* Checkout date is allowed as another booking’s check-in date

Example:

If a property is booked from:

```text
10 June 2026 to 15 June 2026
```

Then these bookings are rejected:

```text
12 June 2026 to 14 June 2026
14 June 2026 to 18 June 2026
09 June 2026 to 12 June 2026
```

But this booking is allowed:

```text
15 June 2026 to 18 June 2026
```

This is handled using half-open interval date logic:

```text
[check_in, check_out)
```

---

## Tech Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* Shadcn UI

### Backend

* Next.js API Routes
* Supabase JS Client

### Database & Auth

* Supabase PostgreSQL
* Supabase Auth
* Supabase Storage

### Deployment

* Vercel for frontend/backend
* Supabase for database, authentication, and storage

---

## Database Tables

The project uses the following Supabase tables:

### `profiles`

Stores user profile information and role.

Main columns:

* `id`
* `email`
* `full_name`
* `role`
* `phone`
* `avatar_url`

Roles:

```text
user
admin
```

### `properties`

Stores vacation rental property data.

Main columns:

* `id`
* `title`
* `location`
* `property_type`
* `description`
* `price_per_night`
* `cleaning_fee`
* `bedrooms`
* `bathrooms`
* `max_guests`
* `amenities`
* `is_active`

### `property_images`

Stores property image URLs.

Main columns:

* `id`
* `property_id`
* `image_url`
* `is_primary`

### `bookings`

Stores booking requests.

Main columns:

* `id`
* `property_id`
* `user_id`
* `guest_name`
* `guest_email`
* `check_in`
* `check_out`
* `guests`
* `nights`
* `total_price`
* `status`

Booking statuses:

```text
pending
confirmed
cancelled
rejected
```

### `blocked_dates`

Stores manually blocked unavailable date ranges.

Main columns:

* `id`
* `property_id`
* `start_date`
* `end_date`
* `reason`

---

## Project Structure

```text
src/
├── app/
│   ├── (public)/
│   ├── (user)/
│   ├── admin/
│   └── api/
│
├── components/
│   ├── ui/
│   ├── common/
│   ├── auth/
│   ├── property/
│   ├── booking/
│   └── admin/
│
├── lib/
│   └── supabase/
│
├── services/
│   ├── auth.service.ts
│   ├── property.service.ts
│   ├── booking.service.ts
│   ├── availability.service.ts
│   ├── blocked-date.service.ts
│   └── storage.service.ts
│
├── validations/
├── types/
└── utils/
```

---

## Environment Variables

Create a `.env.local` file in the project root and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

NEXT_PUBLIC_APP_URL=http://localhost:3000

STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

Important:

```text
SUPABASE_SERVICE_ROLE_KEY must only be used on the server side.
Do not expose it in frontend/client components.
```

### Payment and Notification Setup

Confirmed bookings can create Stripe Checkout Sessions through:

```text
POST /api/payments/checkout
```

Recommended optional booking columns:

```sql
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS stripe_checkout_session_id text,
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'unpaid';
```

Guest confirmation notifications are stored in an optional `notifications` table. If the table is not present, the app still shows inferred confirmation alerts from confirmed bookings.

```sql
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'system',
  title text NOT NULL,
  message text NOT NULL,
  action_url text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_user_created_idx
ON public.notifications (user_id, created_at DESC);
```

---

## How to Run Locally

### 1. Clone the Repository

```bash
git clone your-github-repository-url
```

### 2. Move Into the Project

```bash
cd vacation-home-rental
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Add Environment Variables

Create a `.env.local` file and add your Supabase keys.

### 5. Run the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Main Routes

### Public Routes

```text
/                  Home page
/properties         Property listing
/properties/[id]    Property details
/auth/login         User login
/auth/register      User registration
```

### User Routes

```text
/dashboard          User dashboard
/bookings           User bookings
```

### Admin Routes

```text
/admin/login            Admin login
/admin/dashboard        Admin dashboard
/admin/properties       Manage properties
/admin/bookings         Manage bookings
/admin/blocked-dates    Manage blocked dates
```

---

## Admin Credentials

Admin credentials are not stored in frontend code.

For testing, create an admin user in Supabase Authentication and set the user role to `admin` in the `profiles` table.

Example:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@example.com';
```

---

## Completed Features

* User registration and login
* Admin login and protected admin dashboard
* Property CRUD
* Property image upload
* Public property listing
* Property detail page
* Booking request submission
* Booking price calculation
* Booking availability checks
* Booking overlap prevention
* Manual blocked dates
* Booking status management
* Responsive UI
* Supabase Auth integration
* Supabase PostgreSQL database integration
* Supabase Storage integration

---

## Incomplete / Future Improvements

* Payment gateway integration
* Email notifications
* Reviews and ratings
* Map-based property search
* Wishlist/favorites
* Advanced calendar UI
* Multi-admin role permissions

---

## Assumptions

* Users must be logged in to submit booking requests.
* Admin users are manually assigned through the Supabase `profiles` table.
* Email confirmation is disabled for demo/testing purposes.
* Checkout date is treated as available for the next booking.
* Payment processing is outside the scope of this MVP.

---

## Short Description

This project is a clean MVP for a vacation rental booking platform. It includes a public rental website, user authentication, booking request flow, admin dashboard, database-backed property management, image uploads, blocked dates, and proper booking overlap prevention using Supabase and Next.js.
