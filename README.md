```markdown
# Full Stack Recipe Search Mobile App

This project is a full-stack recipe search mobile application built with React Native and Expo for the frontend, and Node.js with Express for the backend, connecting to a PostgreSQL database. The application allows users to search for recipes, view details, manage favorites, and authenticate securely.

## Table of Contents

1.  [Introduction](#introduction)
2.  [Features](#features)
3.  [Technologies Used](#technologies-used)
4.  [Prerequisites](#prerequisites)
5.  [Project Structure](#project-structure)
6.  [Backend Setup](#backend-setup)
    *   [Initialization & Dependencies](#backend-initialization--dependencies)
    *   [Configuration Files](#backend-configuration-files)
    *   [Database Setup (Neon & Drizzle ORM)](#database-setup-neon--drizzle-orm)
    *   [API Endpoints](#api-endpoints)
    *   [Deployment & Cron Jobs](#deployment--cron-jobs)
7.  [Mobile Application Setup](#mobile-application-setup)
    *   [Initialization & Project Reset](#mobile-initialization--project-reset)
    *   [Running the Application](#running-the-application)
    *   [Core UI & Styling](#core-ui--styling)
    *   [Authentication (Clerk)](#authentication-clerk)
    *   [Navigation (Expo Router Tabs & Stack)](#navigation-expo-router-tabs--stack)
    *   [API Services (MealDB)](#api-services-mealdb)
    *   [Screens Implementation](#screens-implementation)
8.  [Troubleshooting](#troubleshooting)
9.  [Contributing](#contributing)
10. [License](#license)

---

## 1. Introduction

This project guides you through building a full-stack recipe search application. It includes both backend development with Node.js, Express, PostgreSQL, and Drizzle ORM, and mobile application development with React Native and Expo. The app allows users to log in, sign up (with email verification), explore featured recipes and categories, search for recipes, view detailed instructions and video tutorials, and save favorite recipes. It also includes **8 different color themes** for easy customization.

## 2. Features

*   **User Authentication**: Secure sign-up and login with email verification.
*   **Recipe Search**: Search for recipes by name or ingredient.
*   **Categories**: Browse recipes by different categories with real-time UI updates.
*   **Featured Recipes**: Displays a highlighted recipe on the homepage.
*   **Recipe Details**: View cooking time, servings, video tutorials, ingredient lists, and step-by-step instructions.
*   **Favorites Management**: Add or remove recipes from a personalized favorites list.
*   **Backend API**: Custom API built with Node.js and Express to manage user favorites connected to a PostgreSQL database.
*   **Database ORM**: Utilizes Drizzle ORM for database interactions instead of raw SQL.
*   **Theming**: Supports 8 different color themes, easily switchable.
*   **Cross-Platform**: Runs on both Android and iOS physical devices or simulators.
*   **Deployment**: Backend API deployed using Render.com, including a cron job to prevent inactivity on free tier.

## 3. Technologies Used

### Backend
*   **Node.js**: JavaScript runtime environment.
*   **Express.js**: Web application framework for Node.js.
*   **PostgreSQL**: Relational database for storing recipe favorites.
*   **Drizzle ORM**: Type-safe ORM for PostgreSQL.
*   **Neon**: Cloud-hosted PostgreSQL database provider (free tier available).
*   **`dotenv`**: For managing environment variables.
*   **`nodemon`**: For automatic server restarts during development.
*   **`drizzle-kit`**: CLI for Drizzle ORM migrations.
*   **`cron`**: For scheduling tasks (e.g., keeping API active).
*   **Render.com**: Cloud platform for deploying the backend API (free tier available).
*   **Clerk**: Authentication service (free tier available).

### Mobile Application
*   **React Native**: Framework for building native mobile apps using React.
*   **Expo**: Framework and platform for React Native, simplifying development.
*   **Expo Router**: For file-based navigation in Expo.
*   **Clerk Expo SDK**: Integrates Clerk authentication with Expo applications.
*   **`@react-native-async-storage/async-storage`**: For caching Clerk tokens.
*   **`expo-image`**: For optimized image handling.
*   **`react-native-safe-area-context`**: To handle content within the safe display area.
*   **`react-native-vector-icons`**: For UI icons (e.g., Ion Icons).
*   **`react-native-webview`**: For embedding web content (e.g., YouTube videos).
*   **MealDB API**: Free public API for fetching recipe data.
*   **`use-debounce` (custom hook)**: For optimizing search bar performance.

## 4. Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: (LTS version recommended)
*   **npm** or **Yarn**: Package manager
*   **VS Code**: (Recommended IDE)
*   **Git**: Version control system
*   **Expo Go app**: On your physical device (iOS App Store or Android Play Store) or
*   **Android Studio** / **Xcode**: For simulators (optional, but recommended for development).

## 5. Project Structure

The project is divided into two main folders:

*   `backend/`: Contains the Node.js/Express API and PostgreSQL database configuration.
*   `mobile/`: Contains the React Native/Expo mobile application.

```
.
├── backend/
│   ├── src/
│   │   ├── config/             # Environment variables and DB connection
│   │   ├── database/           # Drizzle schema
│   │   ├── cron.js             # Cron job configuration
│   │   └── server.js           # Main Express server file
│   ├── .env                    # Backend environment variables
│   ├── .gitignore
│   ├── package.json
│   └── ...
└── mobile/
    ├── app/                    # Expo Router file-based routes
    │   ├── (auth)/             # Authentication routes (sign-in, sign-up, verify-email)
    │   ├── (tabs)/             # Tab navigator routes (home, search, favorites)
    │   ├── recipe/[id].jsx     # Dynamic recipe detail page
    │   └── _layout.jsx         # Root layout for ClerkProvider and theming
    ├── assets/                 # Images, styles
    │   ├── images/
    │   └── styles/             # Global UI styles
    ├── components/             # Reusable UI components
    ├── constants/              # Global constants (colors, API URLs)
    ├── hooks/                  # Custom React hooks (e.g., useDebounce)
    ├── services/               # External API services (MealDB)
    ├── .env                    # Mobile environment variables
    ├── .gitignore
    ├── package.json
    └── ...
```

## 6. Backend Setup

### Backend Initialization & Dependencies

1.  **Create Project Folders**: Create an empty folder, then create `backend/` and `mobile/` inside it.
2.  **Navigate to Backend**: `cd backend`.
3.  **Initialize Node.js Project**: `npm init -y`.
4.  **Install Core Dependencies**:
    ```bash
    npm install express@5.1.0 neon-http @neondatabase/serverless drizzle-orm@0.31.2 dotenv@16.4.5 cron@2.3.0 #
    ```
5.  **Install Development Dependencies**:
    ```bash
    npm install --save-dev nodemon@3.1.0 drizzle-kit@0.31.10 #
    ```
6.  **Update `package.json`**:
    *   Add `"type": "module"` to enable ES module syntax.
    *   Add `dev` and `start` scripts:
        ```json
        "scripts": {
            "dev": "nodemon src/server.js",
            "start": "node src/server.js"
        }
        ```
        *   `dev`: Uses `nodemon` for automatic restarts during development.
        *   `start`: Uses `node` for production.
7.  **Create Source Folder**: Create a `src/` folder and move `server.js` into it. Update `package.json`'s `main` entry to `src/server.js`.

### Backend Configuration Files

1.  **`.env` File**: Create a `.env` file in the `backend/` root. This file is **ignored by Git** (`.gitignore`) and stores sensitive environment variables.
    ```dotenv
    PORT=5001
    DATABASE_URL=
    NODE_ENV=development # or production
    API_URL=              # Your deployed Render API URL for cron job
    CLERK_PUBLISHABLE_KEY= # Used by the mobile app, not directly in backend .env, but good to note
    ```
2.  **Centralized `config/env.js`**: Create `backend/src/config/env.js` to centralize environment variable access. This file will import `dotenv/config` and export `PORT`, `DATABASE_URL`, `NODE_ENV`, and `API_URL`.
    *   **Note**: Ensure `dotenv/config` is imported in this file to load `.env` variables.
3.  **Express Middleware**: In `server.js`, add `app.use(express.json())` to parse JSON request bodies.

### Database Setup (Neon & Drizzle ORM)

1.  **Neon Database**:
    *   Sign up for a free Neon account (it offers a generous free tier).
    *   Create a new project (e.g., `recipeapp-youtube`).
    *   Copy the **connection string** provided by Neon.
    *   Paste the connection string into the `DATABASE_URL` variable in your `backend/.env` file.
2.  **Drizzle Schema**:
    *   Create `backend/src/database/schema.js`.
    *   Define your database tables (e.g., `favoritesTable`) using Drizzle ORM syntax. For this project, a `favorites` table with `ID` (serial), `userID` (text, not null), `recipeID` (integer, not null), `title` (text), `image` (text), `cookTime` (text), `servings` (text), and `createdAt` (timestamp) is used.
    *   **Convention**: Use camelCase for JavaScript fields and snake_case for database column names.
3.  **Drizzle Database Connection**:
    *   Create `backend/src/config/db.js`.
    *   Import `drizzle-orm/neon-http` and `neon` from `@neondatabase/serverless`.
    *   Import your `schema.js` and `env.js`.
    *   Export a `database` instance by calling `drizzle` with the `neon` function and your schema.
4.  **Drizzle Migrations**:
    *   Create `backend/drizzle.config.js` in the backend root.
    *   Configure `drizzle.config.js` to point to your schema file (`src/database/schema.js`), define an `out` folder for migrations (e.g., `src/database/migrations`), specify the dialect as `postgresql`, and provide `dbCredentials` (from `env.js`).
    *   **Generate Migrations**: Run `npx drizzle-kit generate` to create SQL migration files in the `out` folder.
    *   **Apply Migrations**: Run `npx drizzle-kit migrate` to apply the changes to your Neon PostgreSQL database. You should then see the `favorites` table in your Neon dashboard.

### API Endpoints

All endpoints are defined in `backend/src/server.js` and prefixed with `/api`.

*   **Health Check (GET)**: `/api/health`
    *   Returns `{ success: true }` (status 200) to check if the API is running.
*   **Add Favorite (POST)**: `/api/favorites`
    *   **Request Body**: Expects `userID`, `recipeID`, `title`, `image`, `cookTime`, `servings`.
    *   **Functionality**: Inserts a new favorite recipe into the `favorites` table. Requires `express.json()` middleware.
    *   **Response**: Returns the newly created favorite (status 201).
*   **Delete Favorite (DELETE)**: `/api/favorites/:userID/:recipeID`
    *   **Parameters**: `userID` and `recipeID` are dynamic values from the URL.
    *   **Functionality**: Deletes a favorite recipe from the `favorites` table based on `userID` and `recipeID`.
    *   **Note**: `recipeID` is parsed as an integer due to schema definition.
    *   **Response**: Returns `{ message: "Favorite deleted successfully" }` (status 200).
*   **Fetch Favorites (GET)**: `/api/favorites/:userID`
    *   **Parameters**: `userID` is a dynamic value from the URL.
    *   **Functionality**: Selects all favorite recipes for a given `userID` from the `favorites` table.
    *   **Response**: Returns an array of favorite recipes (status 200).

### Deployment & Cron Jobs

1.  **Git Initialization**:
    *   Navigate to the `backend/` folder: `cd backend`.
    *   Initialize Git: `git init`.
    *   Create a `.gitignore` file and add `node_modules/` and `.env`.
    *   Commit your code and push it to a new GitHub repository.
2.  **Deploy with Render.com**:
    *   Log in to Render.com with your GitHub account.
    *   Create a new **Web Service**.
    *   Connect your GitHub repository for the backend.
    *   **Environment Variables**: Copy `PORT`, `DATABASE_URL`, `NODE_ENV`, and `API_URL` from your `.env` file to Render's environment variables.
    *   **Build Command**: `npm install`.
    *   **Start Command**: `npm run start`.
    *   Deploy the web service.
3.  **Address Render Inactivity (Cron Job)**:
    *   Render's free tier makes your API inactive after 15 minutes of no requests. To prevent this:
    *   **Create `cron.js`**: Create `backend/src/config/cron.js`.
    *   This file defines a cron job using the `cron` package. It will send a GET request to your deployed API's `/api/health` endpoint every 14 minutes.
    *   **API URL**: Set the `API_URL` environment variable in Render.com to your deployed API's base URL (e.g., `https://your-app.onrender.com/api/health`).
    *   **Integrate in `server.js`**: Import and start the cron job (`job.start()`) only when `NODE_ENV` is `production`.
    *   Commit and push these changes to GitHub to trigger a redeployment on Render.com.

## 7. Mobile Application Setup

### Mobile Initialization & Project Reset

1.  **Navigate to Mobile**: `cd mobile`.
2.  **Initialize Expo App**: `npx create-expo-app@latest .` (the dot initializes in the current directory).
3.  **Reset Project**: Run `npm run reset-project` and select **'no'** when prompted to delete existing files. This clears boilerplate code.
4.  **Install Clerk Expo SDK**: `npm install @clerk/clerk-expo @clerk/themes @react-native-async-storage/async-storage`.

### Running the Application

1.  **Start Expo Development Server**: From the `mobile/` directory, run `npx expo`.
2.  **Options**:
    *   **iOS Simulator**: Press `i` in the terminal.
    *   **Android Emulator**: Press `a` in the terminal.
    *   **Physical Device**: Scan the QR code displayed in the terminal using the Expo Go app on your phone. Ensure your phone and development machine are on the same Wi-Fi network.

### Core UI & Styling

1.  **React Native Basics**:
    *   **Components**: `View` (like `div`), `Text` (for all text), `Image`, `TextInput`, `TouchableOpacity` (for buttons), `Link` (for navigation).
    *   **Styling**: Use `StyleSheet.create` for object-based styles, similar to CSS-in-JS. Inline styles are also possible but less organized.
    *   **Flexbox**: In React Native, `display: 'flex'` is `column` direction by default, unlike web which is `row`.
    *   **Keyboard Avoiding View**: Use `KeyboardAvoidingView` to prevent the software keyboard from obscuring text inputs. Configure `behavior` (padding for iOS, height for Android) and `keyboardVerticalOffset`.
    *   **Scroll View**: Use `ScrollView` for scrollable content. Important for accommodating large forms or lists.
2.  **Codebase Setup**:
    *   **Assets**: Create `mobile/assets/styles` and `mobile/assets/images`. Copy provided image assets and styling files (e.g., `authStyles.js`, `homeStyles.js`, `favoritesStyles.js`, `recipeDetailStyles.js`) from the source code.
    *   **Constants**: Create `mobile/constants/colors.js`. This file defines various color themes (e.g., purple, ocean, coffee) which can be easily switched by changing a single import.
    *   **Services**: Create `mobile/services/mealAPI.js` to handle interactions with the external MealDB API.
    *   **API URL**: Create `mobile/constants/API.js` to store your backend API URL.
        *   For simulator: `http://localhost:5001/api`
        *   For physical device: Your deployed Render.com URL + `/api` (e.g., `https://your-app.onrender.com/api`).

### Authentication (Clerk)

1.  **Enable Native Applications in Clerk**: In your Clerk dashboard, go to your application settings -> "Native Applications" and ensure it's enabled.
2.  **Clerk Provider**: In `mobile/app/_layout.jsx`, wrap your entire application with the `ClerkProvider` component. Pass your `CLERK_PUBLISHABLE_KEY` (from your `.env.local` or `.env` file) and include `TokenCache` for secure token storage.
3.  **Auth Routes Group**: Create `mobile/app/(auth)/` folder. Routes inside this folder will be protected and grouped for authentication-related pages.
    *   `_layout.jsx` within `(auth)`: Checks `isSignedIn` state using Clerk's `useAuth` hook. If signed in, redirects to the main app (`/tabs`); otherwise, allows access to auth pages (sign-in, sign-up, verify email).
    *   `sign-in.jsx`, `sign-up.jsx`, `verify-email.jsx`: Individual authentication screens.
    *   **Header Removal**: In `(auth)/_layout.jsx`, set `headerShown: false` in `Stack.Screen` options to hide headers on auth pages.
    *   **Safe Area View**: Wrap content in `(auth)/_layout.jsx` with `SafeAreaView` from `react-native-safe-area-context` and apply `flex: 1` style to avoid content overlapping the status bar.
    *   **Background Color**: In `mobile/app/_layout.jsx`, set the `backgroundColor` of the root view to `Colors.background` for consistent theming.

### Navigation (Expo Router Tabs & Stack)

1.  **Tabs Group**: Create `mobile/app/(tabs)/` folder. This group will host the main application screens accessible via a tab navigator.
    *   `_layout.jsx` within `(tabs)`: Configures the `Tabs` component from Expo Router. Each tab screen (`Tabs.Screen`) specifies a `name` (matching the file name), `options` (title, `tabBarIcon` using `Ionicons`), and global `screenOptions` (e.g., `headerShown: false`, `tabBarActiveTintColor`, `tabBarInactiveTintColor`, `tabBarStyle`, `tabBarLabelStyle`).
    *   `index.jsx`: The "Recipes" (Home) screen.
    *   `search.jsx`: The "Search" screen.
    *   `favorites.jsx`: The "Favorites" screen.
2.  **Root Layout Refinement**:
    *   Create `mobile/components/SaveScreen.jsx`. This component wraps the entire app content to correctly calculate `paddingTop` based on `useSafeAreaInsets()` to handle the safe area for all screens, including tabs.
    *   Replace `SafeAreaView` in `mobile/app/_layout.jsx` with `SaveScreen`.
    *   Ensure `mobile/app/_layout.jsx` includes a check for `isLoaded` from `useAuth` and returns `null` if Clerk is not yet loaded, preventing a flicker of auth pages on app launch.
3.  **Dynamic Route**:
    *   Create `mobile/app/recipe/[id].jsx` for the recipe detail page. The `[id]` syntax makes the route dynamic, capturing the `recipeID` from the URL parameters using `useLocalSearchParams`.

### API Services (MealDB)

1.  **`mealAPI.js`**: In `mobile/services/mealAPI.js`, define functions to interact with the MealDB API.
    *   **Base URL**: `https://www.themealdb.com/api/json/v1/1/`.
    *   **Endpoints**: `search.php` (search by name), `lookup.php` (lookup by ID), `random.php` (random meal), `categories.php` (list categories), `filter.php` (filter by ingredient/category).
    *   **`transformMealData`**: A utility function to normalize inconsistent MealDB API response data into a more usable format (e.g., `strInstructions` to `description`).
    *   **`encodeURIComponent`**: Used for search queries to handle spaces and special characters in URLs.

### Screens Implementation

*   **Sign-In Screen (`(auth)/sign-in.jsx`)**:
    *   Manages email, password states, and a loading state.
    *   `handleSignIn` function uses `signIn.create` from Clerk to authenticate.
    *   Displays an `Alert` for missing fields or sign-in failures.
    *   UI includes an image, email/password text inputs, a "Sign In" button, and a "Sign Up" link.
    *   Password input includes a toggle for visibility using `Ionicons`.
*   **Sign-Up Screen (`(auth)/sign-up.jsx`)**:
    *   Manages email, password, loading, and `pendingVerification` states.
    *   `handleSignUp` function uses `signUp.create` and `signUp.prepareEmailAddressVerification` to create an account and send a 6-digit email code.
    *   Includes validation for email, password length, and Clerk loading state.
    *   Conditionally renders the "Verify Email" component if `pendingVerification` is true.
    *   UI is similar to sign-in, with "Create Account" title and a "Sign In" link.
*   **Verify Email Screen (`(auth)/verify-email.jsx`)**:
    *   Receives `email` and `onBack` props from the Sign-Up screen.
    *   Manages `code` (for verification code) and loading states.
    *   `handleVerification` uses `signUp.attemptEmailAddressVerification` with the provided code.
    *   If successful, `setActive` is called to create a session, redirecting to the home screen.
    *   UI includes an image, "Verify your email" text, a `TextInput` for the 6-digit code, and "Verify Email" and "Back to Sign Up" buttons.
*   **Home Screen (`(tabs)/index.jsx`)**:
    *   Fetches categories, random meals, and a featured meal using `Promise.all` for parallel requests.
    *   `transformCategories` and `transformMealData` are used to normalize API responses.
    *   **Initial Selection**: Automatically selects the first category (e.g., "Beef") on initial load.
    *   `handleCategorySelect` updates the selected category and triggers fetching category-specific data.
    *   `onRefresh` function (triggered by `RefreshControl` in `ScrollView`) reloads all data.
    *   UI includes:
        *   Animal icons (lamp, chicken, pork).
        *   A featured recipe card (touchable, navigates to detail page).
        *   Horizontal `ScrollView` for category filters (`CategoryFilter` component).
        *   `FlatList` for displaying a grid of recipe cards (`RecipeCard` component). `FlatList` is used for performance with large lists of similar items.
        *   Loading spinner (`LoadingSpinner` component) for data fetching.
*   **Search Screen (`(tabs)/search.jsx`)**:
    *   Utilizes a custom `useDebounce` hook (in `mobile/hooks/useDebounce.js`) to optimize search queries by delaying API calls until user typing pauses.
    *   `performSearch` function searches by name first, then by ingredient if no name results are found.
    *   Initial data is loaded on screen visit (random meals if no query).
    *   UI includes:
        *   A search bar (`TextInput`) with a clear button.
        *   `Ionicons` for search and clear icons.
        *   Dynamic header displaying "Results for [Query]" or "Popular Recipes".
        *   `FlatList` to display search results (`RecipeCard` component).
        *   `LoadingSpinner` for search queries and initial loading.
*   **Favorites Screen (`(tabs)/favorites.jsx`)**:
    *   Fetches favorite recipes from your deployed backend API using the `userID` from Clerk.
    *   `transformFavorites` function is used to adjust the data structure to match the `RecipeCard` component's expected format.
    *   `handleSignOut` function uses Clerk's `signOut()` method, preceded by a confirmation `Alert`.
    *   UI includes:
        *   A header with "Favorites" title and a "Logout" `Ionicons` button.
        *   `FlatList` to display favorite recipes (`RecipeCard` component).
        *   `NoFavoritesFound` component displayed if the favorites list is empty.
        *   `LoadingSpinner` while fetching favorites.
*   **Recipe Detail Screen (`recipe/[id].jsx`)**:
    *   Dynamic route that fetches recipe details from MealDB API using the `recipeID` from `useLocalSearchParams`.
    *   `checkIfSaved` function verifies if the current recipe is already a favorite by querying your backend API.
    *   `getYouTubeEmbedURL` converts a standard YouTube URL to an embed-friendly URL for `WebView`.
    *   `handleToggleSave` sends `POST` or `DELETE` requests to your backend API to add/remove the recipe from favorites.
    *   UI includes:
        *   A back button and a save/unsave button (`Ionicons`) in a floating header.
        *   `LinearGradient` for a visually appealing image overlay.
        *   Recipe title, category, and origin.
        *   "Quick Stats" cards for cooking time and servings using `LinearGradient`.
        *   Embedded YouTube video tutorial using `WebView`.
        *   Lists of ingredients and step-by-step instructions.
        *   A prominent "Add to Favorites" or "Remove from Favorites" button at the bottom.
        *   `LoadingSpinner` while fetching recipe details.

## 8. Troubleshooting

*   **Backend API URL (Simulator vs. Physical Device)**:
    *   If using a **simulator** for the mobile app, your backend API URL in `mobile/constants/API.js` should be `http://localhost:5001/api`.
    *   If using a **physical device** with Expo Go, this `localhost` URL will not work. You must replace it with your **deployed Render.com API URL** (e.g., `https://your-app.onrender.com/api`).
*   **Clerk Authentication Not Loading**: Ensure `isLoaded` from `useAuth` is checked in your root `_layout.jsx` and `(tabs)/_layout.jsx`, returning `null` if not loaded, to prevent UI issues.
*   **Keyboard Overlapping Input**: Verify `KeyboardAvoidingView` is correctly configured with `behavior` (padding/height) and `keyboardVerticalOffset` properties.
*   **Content Overlapping Status Bar**: Ensure your root layout is wrapped with `SaveScreen` component (or `SafeAreaView` with `flex: 1`).
*   **Images Not Loading Locally**: For local images, use `require('../assets/images/your-image.png')` syntax. For external images, use `{ uri: 'http://...' }`.
*   **Drizzle Migrations**: If you encounter issues, double-check your `drizzle.config.js` path to the schema and environment variables.
*   **Specific Package Versions**: The tutorial uses specific versions for many packages (e.g., `express@5.1.0`, `drizzle-orm@0.31.2`). If you face compatibility issues, try installing these exact versions.

## 9. Contributing

Feel free to fork the repository, give it a star, and use it as you wish!

```