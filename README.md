# Task Management App

This is a React Native task management application that allows users to manage tasks, view current weather conditions, and handle user authentication with role-based access.

## Table of Contents

-   [Features](#features)
-   [Requirements](#requirements)
-   [Installation](#installation)
-   [Running the Application](#running-the-application)
-   [Environment Variables](#environment-variables)
-   [Authentification](#authentification)
-   [Installed Packages](#installed-packages)

## Features

-   User authentication with role-based access (Admin and User).
-   Display sorted task by date.
-   Task management (view, add, edit, delete tasks)
-   Fetch and display current weather for Tallinn, Estonia.
-   Caching of weather data for 30 minutes.

## Requirements

-   Node.js (v16 or higher)
-   npm or yarn
-   React Native CLI
-   Android Studio (for Android development)
-   Xcode (for iOS development on macOS)
-   Expo CLI

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/lelare/task-management-app.git
cd task-management-app
```

### 2. Install Dependencies

-   Frontend

```bash
cd to-do
npm install
```

-   Backend

```bash
cd to-do-backend
npm install
```

## Running the Application

-   Frontend

```bash
npx expo start
```

-   Backend

```bash
node server.js
```

## Environment Variables

-   .env file should be created in the root of the frontend(to-do) folder with the following variables:

    -   EXPO_PUBLIC_OPENWEATHERMAP_API_KEY=your_weather_api_key
    -   EXPO_PUBLIC_IP=your_ip_address:3000

## Authentification

-   Admin credentials:
    -   username: admin
    -   password: admin123
-   User credentials:
    -   username: user
    -   password: user123

## Installed Packages

-   Frontend

    -   react-native: Framework
    -   redux/react-redux: State management
    -   @react-navigation/native, @react-navigation/stack: Navigation
    -   @react-native-async-storage/async-storage: Persistent storage
    -   moment: Date manipulation
    -   @env/@react-native-dotenv: Environment variables
    -   react-native-paper: UI components

-   Backend
    -   express: Backend framework
    -   cors: Middleware for CORS
    -   body-parser: Middleware for request body parsing
