import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import app from "../firebase";

const db = getFirestore(app);

// 🔹 Register Customer
export const registerUser = async (userData) => {
  try {
    const docRef = await addDoc(collection(db, "customers"), userData);
    return docRef.id;
  } catch (error) {
    console.error(error);
  }
};

// 🔹 Login User (Name + DOB)
export const loginUser = async (name, dob) => {
  const q = query(
    collection(db, "customers"),
    where("name", "==", name),
    where("dob", "==", dob)
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    return {
      id: doc.id,   // ✅ VERY IMPORTANT
      ...doc.data()
    };
  }

  return null;
};

// 🔹 Add Medicine to History
export const addMedicineHistory = async (userId, medicine) => {
  await addDoc(collection(db, "customers", userId, "history"), medicine);
};

// 🔹 Get Medicine History
export const getMedicineHistory = async (userId) => {
  const snapshot = await getDocs(collection(db, "customers", userId, "history"));
  return snapshot.docs.map(doc => doc.data());
};