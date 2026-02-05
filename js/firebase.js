import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Ensure we use the latest config provided
const firebaseConfig = {
  apiKey: "AIzaSyDwYB8dcGRI16-TgYTNmmFz0uO2whrnpyM",
  authDomain: "byteclave-5dd35.firebaseapp.com",
  projectId: "byteclave-5dd35",
  storageBucket: "byteclave-5dd35.firebasestorage.app",
  messagingSenderId: "628621154018",
  appId: "1:628621154018:web:ffe12ecb0eb64fd0c7b0bb"
};

console.log("Initializing Firebase with project:", firebaseConfig.projectId);
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
