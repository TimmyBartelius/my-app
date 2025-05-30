import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import Joi from "joi";
import "./Edit.css";

import { clearExtraToys } from "./clearExtraToys";
import deleteExtraToy from "./deleteToys";

export default function TextField() {
  const [originalProducts, setOriginalProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [editCache, setEditCache] = useState({});
  const [showOriginal, setShowOriginal] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    price: Joi.number().min(0).required(),
    breadtext: Joi.string().allow(""),
    image: Joi.string().uri().allow("").optional(),
    quantity: Joi.number().min(0),
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshotOriginal = await getDocs(collection(db, "AllToys"));
      const listOriginal = snapshotOriginal.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOriginalProducts(listOriginal);

      const snapshotNew = await getDocs(collection(db, "ExtraToys"));
      const listNew = snapshotNew.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNewProducts(listNew);

      const cache = {};
      [...listOriginal, ...listNew].forEach((p) => {
        cache[p.id] = {
          title: p.title,
          price: p.price,
          breadtext: p.breadtext,
          image: p.image,
          quantity: p.quantity,
        };
      });
      setEditCache(cache);
    };

    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    const newProduct = {
      title: "Ny produkt",
      breadtext: "Beskrivning",
      image: "",
      price: 0,
      quantity: 1,
    };

    const validation = schema.validate(newProduct);
    if (validation.error) {
      console.error("Valideringsfel:", validation.error.details[0].message);
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "ExtraToys"), newProduct);
      const added = { id: docRef.id, ...newProduct };

      setNewProducts((prev) => [...prev, added]);
      setEditCache((prev) => ({
        ...prev,
        [docRef.id]: { ...newProduct },
      }));
    } catch (error) {
      console.error("Fel vid tillägg av produkt:", error.message);
    }
  };

  const handleSave = async (id) => {
    const updated = editCache[id];
    const validation = schema.validate(updated);
    if (validation.error) {
      console.error("Valideringsfel:", validation.error.details[0].message);
      return;
    }

    const isNew = newProducts.some((p) => p.id === id);
    const collectionName = isNew ? "ExtraToys" : "AllToys";

    try {
      await updateDoc(doc(db, collectionName, id), updated);

      if (isNew) {
        setNewProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
        );
      } else {
        setOriginalProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
        );
      }
    } catch (error) {
      console.error("Fel vid uppdatering:", error.message);
    }
  };

  const handleEdit = (id, field, value) => {
    setEditCache((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]:
          field === "price" || field === "quantity" ? Number(value) : value,
      },
    }));
  };

  const renderProductList = (list, type) => (
    <ul className={`list-${type}`}>
      {list.map((p) => {
        if (!editCache[p.id]) return null;

        return (
          <li className="list-items-edit" key={p.id}>
            <p>Titel:</p>
            <textarea
              value={editCache[p.id].title ?? ""}
              onChange={(e) => handleEdit(p.id, "title", e.target.value)}
            />

            <p>Pris:</p>
            <textarea
              value={String(editCache[p.id].price ?? "")}
              onChange={(e) => handleEdit(p.id, "price", e.target.value)}
            />

            <p>Informationstext:</p>
            <textarea
              value={editCache[p.id].breadtext ?? ""}
              onChange={(e) => handleEdit(p.id, "breadtext", e.target.value)}
            />

            <p>Bildlänk:</p>
            <textarea
              value={editCache[p.id].image ?? ""}
              onChange={(e) => handleEdit(p.id, "image", e.target.value)}
            />

            {editCache[p.id].image && (
              <img
                src={editCache[p.id].image}
                alt={`Bild för ${editCache[p.id].title}`}
                onError={(e) => {
                  e.currentTarget.src = "/no-image.jpeg";
                }}
                style={{ width: "100px", height: "auto" }}
              />
            )}

            <p>Antal:</p>
            <textarea
              value={String(editCache[p.id].quantity ?? "")}
              onChange={(e) => handleEdit(p.id, "quantity", e.target.value)}
            />

            <button className="save-btn" onClick={() => handleSave(p.id)}>
              Spara
            </button>

            {type === "new" && (
              <div>
                <button
                  onClick={() => {
                    deleteExtraToy(p.id, type);
                    setNewProducts((prev) => prev.filter((x) => x.id !== p.id));
                  }}
                >
                  Ta bort
                </button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <div className="edit-container">
        <button
          className="buttons-editor"
          onClick={async () => {
            await clearExtraToys();
            setNewProducts([]);
          }}
        >
          Ta bort ALLA nya produkter
        </button>
        <button className="buttons-editor" onClick={handleAddProduct}>
          Lägg till ny produkt
        </button>
      </div>

      <div className="buttons-in-editor">
        <button
          className="buttons-editor"
          onClick={() => setShowOriginal((prev) => !prev)}
        >
          {showOriginal ? "Dölj originalprodukter" : "Visa originalprodukter"}
        </button>

        <button
          className="buttons-editor"
          onClick={() => setShowNew((prev) => !prev)}
        >
          {showNew ? "Dölj nya produkter" : "Visa nya produkter"}
        </button>
      </div>

      {showOriginal && (
        <>
          <h2>Originalprodukter</h2>
          {renderProductList(originalProducts, "original")}
        </>
      )}

      {showNew && (
        <>
          <h2>Nya produkter</h2>
          {renderProductList(newProducts, "new")}
        </>
      )}
    </>
  );
}
