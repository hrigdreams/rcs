RCS is a full-stack restaurant discovery, recommendation, and booking platform built to help users explore restaurants, save favourites, make bookings, and receive personalized suggestions. It also includes an admin side for managing restaurant data and reviewing platform content.

## Main modules

### Frontend
- App Router pages for login, signup, homepage, dashboard, restaurant list, restaurant view, favourites, coldstart, and admin pages
- Shared components like headers, cards, sidebars, search, booking forms, and auth wrappers
- Auth context used across the app for login state and role-based navigation

### Backend
- Auth, booking, favourite, recommendation, restaurant, coldstart, tag, and like modules
- REST endpoints organized by feature
- Sequelize-based models and service layer for data operations

## Why this project exists

The goal of RCS is to bring together restaurant discovery and platform management in one system. Instead of a generic directory, it adds recommendation, booking, favourites, and admin tooling so the platform behaves more like a real product than a static listing app.

## Current focus

The codebase is actively evolving, with ongoing improvements around:
- Restaurant management flows
- Authentication and protected routes
- Recommendation behavior
- Admin and user page separation
- Backend API consistency
