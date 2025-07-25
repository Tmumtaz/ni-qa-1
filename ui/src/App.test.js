// import { render, screen } from '@testing-library/react';
// import { Router } from 'react-router-dom';
// import { createMemoryHistory } from 'history';
// import App from './App';
// import { CreateUserForm } from '../../tests/pages/CreateUser';
// import { ListUsersPage } from '../../tests/pages/ListUsers';
// import {Page, Locator, test, expect } from "@playwright/test";

// // Helper function to render app with router
// const renderWithRouter = (initialEntries = ['/']) => {
//   const history = createMemoryHistory({ initialEntries });
//   return {
//     ...render(
//       <Router history={history}>
//         <App />
//       </Router>
//     ),
//     history,
//   };
// };

// describe('App Component', () => {
//   test('renders home page by default', () => {
//     renderWithRouter();
    
//     // Check if Create user tab is present (indicating home page loaded)
//     const createUserTab = screen.getByText('Create user');
//     expect(createUserTab).toBeInTheDocument();
//   });

//   test('renders users page when navigated to /users', () => {
//     renderWithRouter(['/users']);
    
//     // Check if List users tab is present and active
//     const listUsersTab = screen.getByText('List users');
//     expect(listUsersTab).toBeInTheDocument();
//   });

//   test('renders user form on home page', () => {
//     renderWithRouter();
    
//     // Check if form fields are present
//     const nameField = screen.getByLabelText('Name');
//     const emailField = screen.getByLabelText('Email');
//     const phoneField = screen.getByLabelText('Phone Number');
    
//     expect(nameField).toBeInTheDocument();
//     expect(emailField).toBeInTheDocument();
//     expect(phoneField).toBeInTheDocument();
//   });

//   test('has navigation tabs', () => {
//     renderWithRouter();
    
//     const createUserTab = screen.getByText('Create user');
//     const listUsersTab = screen.getByText('List users');
    
//     expect(createUserTab).toBeInTheDocument();
//     expect(listUsersTab).toBeInTheDocument();
//   });
// });

// TODO: Add more comprehensive frontend tests
// - Test form validation
// - Test user interactions
// - Test API integration
// - Test error handling
// - Test loading states
