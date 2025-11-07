# Customer Management System Frontend

This is the React frontend application for the Customer Information Management System.

## Features

- **Customer Management**: Create, read, update, and delete customer records
- **Search Functionality**: Search customers by name or email
- **Form Validation**: Client-side validation with error handling
- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Visual feedback during API operations
- **Error Handling**: User-friendly error messages

## Technology Stack

- **React 19.2.0**: Modern functional components with hooks
- **Axios**: HTTP client for API communication
- **CSS3**: Custom responsive styling
- **React Testing Library**: Component testing

## Prerequisites

- Node.js 18+ installed
- Backend API deployed and running

## Setup and Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner in interactive watch mode
- `npm run build` - Builds the app for production to the `build` folder
- `npm run eject` - **Note: this is a one-way operation. Once you eject, you can't go back!**

## API Configuration

The frontend connects to the backend API at:
```
https://6d0c6widn7.execute-api.us-east-1.amazonaws.com/api
```

To change the API endpoint, update the `API_BASE_URL` constant in `src/App.js`.

## Project Structure

```
src/
├── App.js          # Main application component
├── App.css         # Application styles
├── App.test.js     # Application tests
├── index.js        # React DOM entry point
├── index.css       # Global styles
└── ...
```

## Features Overview

### Customer List
- Displays all customers in a responsive table
- Shows customer name, email, phone, address, and registration date
- Empty state when no customers exist

### Search
- Real-time search by customer name or email
- "Show All" button to clear search results

### Add Customer
- Modal form with validation
- Required fields: Name and Email
- Optional fields: Phone and Address
- Email uniqueness validation

### Edit Customer
- Pre-populated form with existing customer data
- Same validation rules as create form
- Updates customer information

### Delete Customer
- Confirmation dialog before deletion
- Removes customer from database and updates UI

## Styling

The application uses custom CSS with:
- Responsive grid layout
- Modern color scheme
- Hover effects and transitions
- Loading indicators
- Error message styling

## Testing

Run tests with:
```bash
npm test
```

The test suite includes:
- Component rendering tests
- User interaction tests
- API integration tests

## Build for Production

```bash
npm run build
```

Builds the app for production to the `build` folder. The build is minified and optimized for best performance.

## Browser Support

This application supports all modern browsers including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)