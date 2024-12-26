# Project Setup Instructions

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **PHP** (>= 8.0)
- **Composer** (latest version)
- **PostgreSQL** (>= 13.x)
- **Node.js** (>= 14.x)
- **npm** or **yarn**
- **Git**

---

## Setup Instructions

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd backend/
```

### Step 2: Install Dependencies

#### Install PHP Dependencies

```bash
composer install
```

### Step 3: Generate Application Key

```bash
php artisan key:generate
```

### Step 4: Run Database Migrations

```bash
php artisan migrate
```

### Step 5: Seed the Database (Optional)

If your project includes database seeders, run:

```bash
php artisan db:seed
```

### Step 6: Serve the Application

#### Using Artisan

```bash
php artisan serve
```

Access the application at [http://localhost:8000](http://localhost:8000).

## ReactJS Setup Instructions

### Step 1: Create a New React App

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start the Development Server

```bash
npm start
```

Access the application at [http://localhost:3000](http://localhost:3000).