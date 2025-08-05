# FitBite - AI-Powered Global Diet Planner

## Overview

FitBite is a full-stack web application that provides AI-powered personalized meal planning for global cuisines. The application helps users achieve their fitness goals (weight loss, weight gain, or maintenance) through culturally diverse, customized meal plans. Users can input their preferences, health conditions, and dietary restrictions to receive tailored weekly meal plans that can be downloaded as PDFs or shared with others.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Authentication**: Firebase Authentication with Google and Facebook social login support
- **UI Components**: Radix UI primitives with custom styling for accessibility and consistency

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **API Design**: RESTful API with structured error handling and request logging
- **Data Layer**: In-memory storage implementation with interface for future database integration
- **AI Integration**: OpenAI GPT-4o for generating personalized meal plans based on user preferences
- **PDF Generation**: Planned integration with Puppeteer for converting meal plans to downloadable PDFs

### Database Schema
- **Users Table**: Stores user profiles including Firebase UID, demographics, health conditions, and food exclusions
- **Meal Plans Table**: Contains generated meal plans with fitness goals, cuisine preferences, diet types, and JSON meal data
- **PDF Files Table**: Tracks generated PDF downloads with expiration dates for cleanup

### Authentication & Authorization
- **Primary Auth**: Firebase Authentication for user management
- **Social Login**: Google and Facebook OAuth integration
- **Session Management**: Firebase tokens for maintaining user sessions
- **User Creation**: Automatic profile creation in backend database upon Firebase registration

### Data Models
- **User Profile**: Demographics, health conditions, dietary restrictions, and preferences
- **Meal Plan**: Weekly structured meal plans with ingredients, instructions, and calorie information
- **PDF Files**: Temporary downloadable meal plan documents with automatic expiration

## External Dependencies

### Core Services
- **Firebase Suite**: Authentication, Firestore (planned), and Storage for user management and file hosting
- **OpenAI API**: GPT-4o model for intelligent meal plan generation based on user inputs
- **Neon Database**: PostgreSQL hosting with Drizzle ORM for data persistence

### Development Tools
- **Vite**: Fast development server and build tool with hot module replacement
- **Drizzle Kit**: Database schema management and migrations
- **ESBuild**: Fast JavaScript bundling for production builds

### UI/UX Libraries
- **Radix UI**: Accessible component primitives for dialogs, forms, and navigation
- **Lucide React**: Consistent icon library for user interface elements
- **React Hook Form**: Form validation and state management with Zod schema validation
- **Date-fns**: Date manipulation and formatting utilities

### Recent Improvements (January 2025)
- **Multiple Meal Plan Generation**: Users can now generate unlimited meal plans instead of being limited to one
- **Enhanced Navigation**: Added back button functionality throughout all onboarding steps and meal plan generation
- **Improved Food Preferences**: Fixed "Foods to Include" step to properly capture and pass preferences to AI generation
- **Optional Step Handling**: Made health conditions and food preferences optional with skip functionality
- **User Experience**: Enhanced onboarding flow with proper validation and navigation controls
- **Custom Input Fields**: Added conditional text inputs for "Other" options in health conditions and food preferences
- **Home Navigation**: Added Home button to top navigation for easy return to landing page
- **Google AdSense Readiness**: Created comprehensive SEO-optimized pages for monetization approval including About Us, Contact Us, Privacy Policy, Terms & Conditions, Disclaimer, DMCA, Sitemap, Cookie Policy, and FAQ with integrated footer navigation
- **Fully Responsive Design**: Complete mobile-first responsive redesign with hamburger navigation, optimized typography, flexible layouts, and touch-friendly interactions across all device sizes (mobile 320px+, tablet 768px+, desktop 1024px+)
- **Modern PDF Generation**: Complete redesign of meal plan PDFs with professional cover page, comprehensive user profile section with BMI calculation, bordered meal cards with structured ingredients/instructions layout, weekly nutrition summary table, auto-generated grocery list by categories, and consistent branding throughout

### Planned Integrations
- **Puppeteer**: HTML to PDF conversion for meal plan downloads
- **Firebase Cloud Messaging**: Push notifications for meal reminders
- **Recharts**: Data visualization for nutritional analytics and progress tracking