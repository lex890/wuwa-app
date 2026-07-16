# Wuthering Waves CMS

A lightweight Content Management System (CMS) built for managing data used by a Wuthering Waves fan wiki. The application provides an authenticated admin panel for maintaining game data while serving a fast, cached experience for public users.

---

## Features

### Public Site

- Browse Resonators
- Browse Weapons
- Browse Echoes
- View Tier Lists
- Fast loading through localStorage caching

### Admin Panel

- Secure authentication with Supabase Auth
- Create new entries
- Update existing entries
- Delete entries
- Synchronize changes with Supabase
- Export updated datasets to local JSON

---

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- Sass (SCSS)

### Backend / Services

- Node.js
- Supabase
  - Database
  - Authentication

### Data

- JSON
- localStorage

---

## Project Structure

```
src/
├── api/
├── assets/
├── components/
├── constant/
├── hooks/
├── lib/
├── pages/
└── utils/

scripts/
├── import-wuwa-data.mjs
└── export-wuwa-data.js

public/
└── *.json
```

---

## Managed Data

The CMS currently supports managing:

- Resonators
- Weapons
- Echoes
- Tier Lists

---

## Application Architecture

This project intentionally uses a **JSON-first architecture**.

Instead of treating the database as the primary source of truth, the project maintains a local JSON dataset that represents the canonical game data. Supabase is used for persistence, authentication, and administrative editing.

This design was chosen as a learning exercise to explore:

- State management
- Data synchronization
- Import/Export workflows
- Caching strategies
- CRUD operations

---

## Public Data Flow

```
Application Start
        │
        ▼
Check localStorage
        │
        ├───────────────┐
        │ Cache Exists  │
        ▼               │
Use Cached Data         │
        │               │
        └───────────────┘
                │
                ▼
        Read Local JSON
```

The application prioritizes cached data for faster loading. If no cache is available, it falls back to the local JSON dataset.

---

## Admin Workflow

```
Load Current Data
        │
        ▼
Modify Runtime State
(Add / Edit / Delete)
        │
        ▼
Save Changes
        │
        ▼
Update Supabase
        │
        ▼
Export Updated JSON
```

This workflow ensures that the local JSON dataset remains the authoritative copy used by the application.

---

## Import & Export Scripts

### Import

Imports local JSON data into Supabase.

```bash
npm run import:wuwa
```

Useful for:

- Initial database setup
- Database restoration
- Seeding development environments

---

### Export

Exports the latest data into the local JSON dataset.

```bash
npm run export:wuwa
```

This script updates the JSON files used by the public application.

---

## Available Scripts

```bash
npm install

npm run dev

npm run build

npm run preview

npm run import:wuwa

npm run export:wuwa
```

---

## Authentication

The admin panel is protected using **Supabase Authentication**.

Only authenticated users can perform Create, Update, and Delete operations.

---

## Why JSON as the Source of Truth?

This project intentionally keeps local JSON files as the canonical dataset.

Advantages include:

- Reliable preview of published content
- Easy version control with Git
- Human-readable datasets
- Offline-friendly development
- Simple backup and restoration

Supabase serves as the persistence layer for admin operations, while import/export scripts keep both systems synchronized.

---

## Purpose

This project was built primarily as a personal learning project to gain hands-on experience with:

- React application architecture
- CRUD operations
- Authentication
- State management
- Client-side caching
- Data synchronization
- CMS development
- Working with Supabase