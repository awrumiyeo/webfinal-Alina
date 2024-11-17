
# Portfolio Platform

## Table of Contents
1. [Project Overview](#project-overview)
2. [Setup Instructions](#setup-instructions)
3. [API Details](#api-details)
4. [Design Rationale](#design-rationale)
5. [Two-Factor Authentication (2FA)](#two-factor-authentication-2fa)
6. [Project Structure](#project-structure)
7. [Features](#features)
8. [Acknowledgments](#acknowledgments)

---

## Project Overview
The **Portfolio Platform** is a Node.js-based web application designed to showcase portfolios with robust authentication and role-based access control. It integrates APIs for data visualization (healthcare stock prices and air quality), includes 2FA for secure user authentication, and allows admins and editors to manage content effectively.

---

## Setup Instructions

### Prerequisites
- Node.js installed (v16 or higher recommended)
- MongoDB instance
- API keys for the following services:
  - **Alpha Vantage**: For healthcare stock prices
  - **OpenWeather**: For air quality data
- SMTP credentials for sending 2FA emails

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd portfolio-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```env
   PORT=3000
   MONGODB_URI=<mongodb-uri>
   JWT_SECRET=<jwt-secret>
   EMAIL_USER=<email-address>
   EMAIL_PASS=<email-password>
   OPENWEATHER_API_KEY=<openweather-api-key>
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Access the application at `http://localhost:3000`.

---

## API Details

### Alpha Vantage - Healthcare Stock Prices
- **Endpoint**: `https://www.alphavantage.co/query`
- **Parameters**:
  - `function`: `TIME_SERIES_DAILY`
  - `symbol`: E.g., `JNJ`
  - `apikey`: Your API key
- **Purpose**: Fetches daily stock prices for healthcare companies.

### OpenWeather - Air Quality
- **Endpoint**: `http://api.openweathermap.org/data/2.5/air_pollution`
- **Parameters**:
  - `lat`: Latitude
  - `lon`: Longitude
  - `appid`: Your API key
- **Purpose**: Retrieves air quality data for a specified location.

---

## Design Rationale
1. **User-Friendly Navigation**:
   - Intuitive navigation with links for Home, Portfolio, and Login.
   - Clean and responsive layout for an enhanced user experience.

2. **Security**:
   - Password hashing with `bcrypt`.
   - Two-factor authentication (2FA) for secure user login.
   - JWT-based session management.

3. **Data Visualization**:
   - Healthcare stock prices displayed in a bar chart.
   - Air quality data visualized as pollutant concentration.

4. **Role-Based Access Control**:
   - **Admin**: Full control over portfolio items (create, edit, delete).
   - **Editor**: Limited access (create and view portfolio items only).

---

## Two-Factor Authentication (2FA)

### How It Works:
1. Upon registration, users provide their email.
2. A 2FA code is sent to the user's email during login.
3. Users must enter the 2FA code to complete the login process.

### Configuration:
Ensure the `.env` file includes valid SMTP credentials:
```env
EMAIL_USER=<email-address>
EMAIL_PASS=<email-password>
```

---

## Project Structure

```plaintext
portfolio-platform/
├── node_modules/
├── public/
│   ├── images/
│   ├── style.css
├── routes/
│   ├── airQualityRoutes.js
│   ├── apiRoutes.js
│   ├── authRoutes.js
│   ├── portfolioAdminRoutes.js
│   ├── portfolioEditorRoutes.js
│   ├── portfolioRoutes.js
│   ├── userAdminRoutes.js
│   ├── visualizations.js
├── views/
│   ├── adminUsers.ejs
│   ├── createPortfolioItem.ejs
│   ├── editor-visualizations.ejs
│   ├── editPortfolioItem.ejs
│   ├── home.ejs
│   ├── login.ejs
│   ├── portfolio.ejs
│   ├── register.ejs
│   ├── visualizations.ejs
├── .env
├── package.json
├── server.js
```

---

## Features
1. **User Authentication**:
   - Register, login, and logout functionality.
   - Secure password storage using `bcrypt`.

2. **Role-Based Access**:
   - Admin and Editor roles with distinct permissions.

3. **Portfolio Management**:
   - Add, edit, and delete portfolio items.
   - Display items in a user-friendly carousel format.

4. **Data Visualization**:
   - Charts for healthcare stock prices and air quality data.

5. **2FA for Login**:
   - Adds an extra layer of security.

---

## Acknowledgments
Special thanks to:
- **Alpha Vantage**: For providing stock price data.
- **OpenWeather**: For air quality data.
- **Chart.js**: For seamless data visualization.
- **Express.js and MongoDB**: Core technologies used in this project.

---


