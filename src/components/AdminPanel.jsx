import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import TextField from "./TextField";

export default function AdminPanel() {
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);

  const productsCollection = collection(db, "produkter");

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(productsCollection);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(list);
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    const parsedPrice = parseFloat(newPrice);
    if (!newName || isNaN(parsedPrice)) {
      setErrors({
        newName: !newName ? "Namn krävs" : undefined,
        newPrice: isNaN(parsedPrice) ? "Ogiltigt pris" : undefined,
      });
      return;
    }

    const docRef = await addDoc(productsCollection, {
      namn: newName,
      pris: parsedPrice,
    });

    setProducts((prev) => [
      ...prev,
      { id: docRef.id, namn: newName, pris: parsedPrice },
    ]);
    setNewName("");
    setNewPrice("");
    setErrors({});
  };

  return (
    <div>
      <TextField
        label="Namn"
        value={newName}
        onChange={setNewName}
        placeholder="Produktnamn"
        error={errors.newName}
      />
      <TextField
        label="Pris"
        value={newPrice}
        onChange={setNewPrice}
        placeholder="Pris i SEK"
        error={errors.newPrice}
      />
      <button onClick={handleAddProduct}>Lägg till produkt</button>
    </div>
  );
}
