import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import TextField from "./TextField";

export default function AdminPanel() {
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [errors, setErrors] = useState({}); // För nya produkter

  const productsCollection = collection(db, "produkter");

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(productsCollection);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    };
    fetchProducts();
  }, []);

  const validateNewProduct = () => {
    const errs = {};
    if (newName.trim() === "") errs.newName = "Namn krävs";
    const priceNum = parseFloat(newPrice);
    if (newPrice.trim() === "") errs.newPrice = "Pris krävs";
    else if (isNaN(priceNum) || priceNum < 0) errs.newPrice = "Ogiltigt pris";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  setProducts((prev) => [
    ...prev,
    { id: docRef.id, namn: newName, pris: parseFloat(newPrice) },
  ]);
  setNewName("");
  setNewPrice("");
  setErrors({});
}

return (
  <div>
    <TextField
      label="Pris"
      value={newPrice}
      onChange={setNewPrice}
      placeholder="Pris i SEK"
      error={errors.newPrice}
    />
  </div>
);
