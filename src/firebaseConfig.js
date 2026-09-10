
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJFj3jkin1p3RV2BIUhL23gNXz5waiNNc",
  authDomain: "task-ed4ca.firebaseapp.com",
  projectId: "task-ed4ca",
  storageBucket: "task-ed4ca.firebasestorage.app",
  messagingSenderId: "16436247521",
  appId: "1:16436247521:web:db485f20b083adf45470a0",
  measurementId: "G-ZWZ4H2JBD0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);