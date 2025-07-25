# User Management System - QA Testing Project

## Project Overview

This is a full-stack user management application converted from a serverless AWS architecture to a simple Express.js API with SQLite database. The project is designed for comprehensive QA testing and includes both frontend and backend components.

## Architecture

- **Frontend**: React.js with Material-UI components
- **Backend**: Express.js REST API
- **Database**: SQLite (local, ephemeral database)
- **Port Configuration**: 
  - API: http://localhost:3001
  - Frontend: http://localhost:3000

## Project Structure

```
├── api/                    # Express.js backend
│   ├── server.js          # Main server file
│   ├── database.js        # SQLite database operations
│   ├── routes/
│   │   └── users.js       # User API routes
│   ├── package.json       # Backend dependencies
│   └── users.db          # SQLite database file (auto-generated)
│
└── ui/                    # React.js frontend
    ├── src/
    │   ├── components/    # Reusable React components
    │   ├── pages/         # Application pages
    │   ├── App.js         # Main app component
    │   └── config.json    # API configuration
    ├── public/            # Static assets
    └── package.json       # Frontend dependencies
```

## API Endpoints

| Method | Endpoint           | Description                    |
|--------|--------------------|--------------------------------|
| GET    | `/api/id`          | Get all users                 |
| GET    | `/api/id/:id`      | Get user by ID                |
| POST   | `/api/save`        | Create or update user         |
| DELETE | `/api/user/:userId`| Delete user (primary endpoint)|
| DELETE | `/api/id/:id`      | Delete user (alternative)     |
| GET    | `/health`          | Health check endpoint         |

## Quick Start

### Option 1: Manual Setup
1. **Start the API:**
   ```bash
   cd api
   npm install
   npm start
   ```

2. **Start the Frontend (in a new terminal):**
   ```bash
   cd ui
   npm install
   npm start
   ```

3. **Open your browser to http://localhost:3000**

### Option 2: Automated Setup
```bash
./test-setup.sh
```

This script will install dependencies, run tests, and verify the setup.

## Features

- Create new users with name, email, and phone
- View list of all users
- Edit existing users
- Delete users
- Form validation
- Responsive Material-UI design

## Database Schema

The SQLite database contains a single `users` table:

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fullName TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Sample Data

The database is pre-populated with sample users:
- John Doe (john@example.com)
- Jane Doe (jane@example.com)  
- Bob Smith (bob@example.com)

## Testing Guidelines for QA Engineers

This project has been designed with several intentional and unintentional issues for comprehensive testing. Areas to focus on:

### Functional Testing
- User creation, reading, updating, and deletion (CRUD operations)
- Form validation and error handling
- Data persistence across browser sessions
- Navigation between pages

### API Testing
- All REST endpoints with various payloads
- Error responses and status codes
- Database constraints (e.g., unique email)
- Data format consistency

### UI/UX Testing
- Cross-browser compatibility
- Responsive design on different screen sizes
- Form field validation feedback
- Loading states and error messages

### Edge Cases & Error Scenarios
- Invalid data inputs
- Concurrent user operations
- Network connectivity issues
- Large datasets

### Performance Testing
- API response times
- Frontend rendering performance
- Database query optimization

## Known Issues (For QA Discovery)

⚠️ **Note**: This project contains intentional bugs and edge cases for testing purposes. Some functionality may not work as expected.

## For QA Engineers

This project has been specifically designed for comprehensive testing. It includes:

### Intentional Testing Features
- **Subtle bugs** scattered throughout the codebase
- **Edge cases** in data validation and user interactions  
- **Inconsistent behaviors** to test attention to detail
- **Performance considerations** for load testing
- **Security implications** for security testing

### Testing Resources
- `QA_TESTING_GUIDE.md` - Comprehensive testing guide
- `test-setup.sh` - Automated setup script
- Sample data and edge case scenarios
- Existing React app with basic structure for reference

### Areas of Focus
1. **CRUD Operations** - Complete user lifecycle testing
2. **Data Validation** - Input validation and error handling
3. **UI/UX Testing** - Cross-browser compatibility and usability
4. **API Testing** - Endpoint reliability and data consistency
5. **Integration Testing** - Frontend-backend communication
6. **Performance Testing** - Response times and resource usage

### Expected Deliverables
- Bug reports with detailed reproduction steps
- Test case documentation
- Automated test implementations
- Performance analysis
- Security assessment

## Development Notes

- The project uses SQLite for simplicity and local development
- CORS is enabled for frontend-backend communication
- The database file (`users.db`) is created automatically on first run
- Environment variables can be used for configuration (though not required for basic setup)

## Migration Notes

This project was migrated from:
- AWS Lambda functions → Express.js routes
- MongoDB → SQLite database
- AWS API Gateway → Local Express server

The frontend was updated to communicate with the local API instead of AWS services.


# Running Tests
  - This project uses Playwright for both API and UI testing. The test files are organized into the following folders:
  - tests/API: API-level integration and edge-case tests
  - tests/UI: UI behavior and validation tests
  - tests/e2e: End-to-end flow tests across UI and API

  ## Open Playwright Test Reporter
  - npx playwright show-report

  ## Run All Tests
  - npx playwright test

  ## API Tests (Configured to run in Chrome only)
  - npx playwright test tests/API

  ## UI Tests
  - npx playwright test tests/UI

  ## End-to-End Tests
  - npx playwright test tests/e2e 

  ## Configuration Options 
  ### Run Specific Browser 
  - npx playwright test --project=chromium
  - npx playwright test --project=firefox
  - npx playwright test --project=webkit

  ### Run in Headed Mode (debugging)
  - npx playwright test --headed









