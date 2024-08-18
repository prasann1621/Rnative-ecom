E-Commerce App with Fake Store API
Overview
This is an e-commerce application built with React Native using the Fake Store API. The app includes user authentication, a product listing with filtering and sorting, a cart functionality, and a checkout process. It utilizes Expo SDK 50 for development.

Features
User authentication with login and guest checkout options
Product listing with search, filtering, and sorting functionalities
Cart management with quantity controls and checkout functionality
Responsive design with modern UI and animations
Technologies Used
React Native: For building the mobile app.
Expo SDK 50: For development and deployment.
Fake Store API: For fetching product and user data.
Getting Started
Prerequisites
Node.js and npm installed
Expo CLI installed (npm install -g expo-cli)
Basic knowledge of React Native
Setup
Clone the repository:

bash
Copy code
git clone git@github.com:prasann1621/Rnative-ecom.git
Navigate to the project directory:

bash
Copy code
cd ecommerce-app
Install dependencies:

bash
Copy code
npm install
Run the app:

bash
Copy code
expo start
This command will open the Expo developer tools in your default browser. From there, you can run the app on an emulator or physical device using the Expo Go app.

Configuration
Fake Store API
Update the LOGIN_URL and other API endpoints in your project files if needed. The base URL for the Fake Store API is https://fakestoreapi.com.

Firebase (if using for authentication)
Make sure to configure Firebase settings and update them in your project files if you are using Firebase for authentication.
File Structure
App.js: Main entry point of the application.
src/screens/: Contains different screens like HomeScreen, ProductScreen, CartScreen, and GettingStartedScreen.
src/components/: Reusable components such as buttons and input fields.
src/api/: API calls and configurations.
assets/: Images and other static assets.
Troubleshooting
Error fetching product details: Ensure the API endpoint is correct and accessible. Check for network issues.
Issues with navigation: Make sure all screen names are correctly configured in your navigation setup.
Contact
For any questions or issues, please contact:

Name: Prasann Koli
Email: prasankolli16@gmail.com
