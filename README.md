# abc - Social Blogging Platform

A modern full-stack blog website built with Next.js, TypeScript, TypeORM, and SQLite.

## Features

- 📝 Create, edit, and delete blog posts
- 💬 Comment on posts
- ❤️ Like posts
- 👤 User profiles
- 🔍 Search and filter posts
- 📱 Responsive design with Tailwind CSS
- 🗄️ SQLite database with TypeORM

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Local Development

```bash
# Install dependencies
npm install

# Create data directory
mkdir -p data

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker

```bash
# Build and start with Docker Compose
docker-compose up --build

# Stop
docker-compose down
```

## Environment Variables

Copy `.env` and adjust as needed:

```
DATABASE_PATH=./data/abc.sqlite
NEXT_PUBLIC_APP_NAME=abc
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all published posts |
| POST | `/api/posts` | Create a new post |
| GET | `/api/posts/:id` | Get a single post |
| PUT | `/api/posts/:id` | Update a post |
| DELETE | `/api/posts/:id` | Delete a post |
| GET | `/api/comments?postId=` | Get comments for a post |
| POST | `/api/comments` | Add a comment |
| GET | `/api/users` | Get all users |
| POST | `/api/users` | Create a user |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite via better-sqlite3
- **ORM**: TypeORM
- **Styling**: Tailwind CSS
- **Runtime**: Node.js 20
