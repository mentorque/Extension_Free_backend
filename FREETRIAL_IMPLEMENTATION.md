# Free Trial Implementation Summary

## Overview
Removed API key authentication and implemented a free trial system with user registration form.

## Changes Made

### Backend Changes

1. **Database Schema** (`backend/prisma/schema.prisma`)
   - Added `FreetrialUsers` model with fields:
     - id, name, email, contactNumber, occupation, createdAt, updatedAt
   - Email is unique and indexed

2. **API Endpoint** (`backend/src/controllers/freetrialUsers.js`)
   - Created `/api/freetrial/register` endpoint
   - Validates required fields (name, email, contactNumber)
   - Stores user data in database
   - Returns user data on success

3. **Routes** (`backend/src/routes.js`)
   - Removed `authenticateApiKey` middleware from all routes
   - All routes are now public (no authentication required)
   - Added free trial registration route

### Frontend Changes

1. **Removed Authentication**
   - Removed `AuthProvider` from `Main.jsx`
   - Removed `LoginScreen` usage from `Entry.jsx`
   - Removed API key from all API calls (`useApi.jsx`, `apiClient.js`)
   - Removed user dropdown and logout from `Overlay.jsx`

2. **Request Tracking** (`frontend/src/context/requestContext.jsx`)
   - Tracks keyword request count in localStorage
   - Tracks form submission status
   - Provides `shouldShowForm()` - shows form after 2 requests
   - Provides `shouldShowAd()` - shows ad after every 10 requests

3. **User Info Form** (`frontend/src/components/UserInfoForm.jsx`)
   - Form with fields: Name*, Email ID*, Contact Number*, Occupation (optional)
   - Validates required fields
   - Submits to `/api/freetrial/register`
   - Stores submission in localStorage
   - Cannot be closed if required (after 2 requests)

4. **Ad Screen** (`frontend/src/components/AdScreen.jsx`)
   - Shows after every 10 keyword requests
   - Displays landing page content:
     - "Land Interviews Faster."
     - "Your Resume PortFolio"
     - "We make it easy. You make it happen."
     - "View Testimonial" button (links to https://www.mentorquedu.com/testimonials)

5. **GenerateKeywordsScreen Updates**
   - Tracks request count
   - Shows form after 2 requests if not submitted
   - Blocks requests until form is submitted (after 2 requests)
   - Shows ad screen after every 10 requests

6. **Fonts & Colors** (`frontend/src/context/themeContext.jsx`, `frontend/src/components/GlobalStyles.jsx`)
   - Updated primary color to orange (#f97316) to match landing page
   - Added Inter font from Google Fonts
   - Applied Inter font globally

## Database Migration Required

After updating the Prisma schema, run:

```bash
cd backend
npx prisma migrate dev --name add_freetrial_users
npx prisma generate
```

## User Flow

1. **First 2 Requests**: User can make keyword requests without form
2. **After 2 Requests**: Form is shown and blocks further requests until submitted
3. **Form Submission**: 
   - Data saved to database
   - Stored in localStorage
   - User can continue making requests
4. **Every 10 Requests**: Ad screen is shown with landing page content

## localStorage Keys

- `keywordRequestCount`: Number of keyword requests made
- `freetrialUserSubmitted`: "true" if form has been submitted
- `freetrialUserData`: JSON string of user data

## API Endpoints

- `POST /api/freetrial/register`: Register free trial user
  - Body: `{ name, email, contactNumber, occupation? }`
  - Returns: `{ success, message, data }`

## Notes

- All routes are now public (no authentication)
- Form cannot be closed when required (after 2 requests)
- Ad screen appears after every 10 keyword requests
- Fonts and colors match the landing page (Inter font, orange #f97316)

