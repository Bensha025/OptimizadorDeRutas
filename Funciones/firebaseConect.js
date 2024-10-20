import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore  } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js"; // Importa el almacenamiento si lo necesitas

// Credenciales para conectarse a la base de datos.
const firebaseConfig ={
  apiKey: "AIzaSyD0gsvHPiOJxrWy7vrYq8wzVQSTl9KDh4k",
  authDomain: "generadorderutas-dacb3.firebaseapp.com",
  projectId: "generadorderutas-dacb3",
  storageBucket: "generadorderutas-dacb3.appspot.com",
  messagingSenderId: "543948882075",
  appId: "1:543948882075:web:70d5b3c1febf6137be463e",
  measurementId: "G-91WCLLD67J"
};

// Inicializa Firebase.
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Exporta la base de datos.
export { db, storage };
