// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    getDocs, 
    doc, 
    getDoc, 
    query,
    where,
    limit
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDZvHoDWOSxgRrmlfWm2_hDa6Z8UdFRMT0",
    authDomain: "dulcinea-bakery-5bcb3.firebaseapp.com",
    projectId: "dulcinea-bakery-5bcb3",
    storageBucket: "dulcinea-bakery-5bcb3.firebasestorage.app",
    messagingSenderId: "637363296557",
    appId: "1:637363296557:web:08d2200db882c7f9ae5ba4"
};

// Inicializar Firebase una sola vez
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exportar todo lo necesario
export { 
    db, 
    collection, 
    getDocs, 
    doc, 
    getDoc,
    query,
    where,
    limit
};