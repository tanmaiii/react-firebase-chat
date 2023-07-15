import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyChcSxOup0JYyXL4vPw1s1LDGZ7IEXssJY",
  authDomain: "chat-ui-ad7ac.firebaseapp.com",
  projectId: "chat-ui-ad7ac",
  storageBucket: "chat-ui-ad7ac.appspot.com",
  messagingSenderId: "817599212068",
  appId: "1:817599212068:web:477e5b54f2b1146a0086b1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage();
export const db = getFirestore()
