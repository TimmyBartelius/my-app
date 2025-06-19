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
import deleteExtraToy from "./deleteToys";

export default function TextField() {
  const [allProducts, setAllProducts] = useState([]);
  const [editCache, setEditCache] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [newProductData, setNewProductData] = useState({
    title: "",
    breadtext: "",
    image: "",
    price: "",
  });
  const [formError, setFormError] = useState("");

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
        source: "AllToys",
      }));

      const snapshotNew = await getDocs(collection(db, "ExtraToys"));
      const listNew = snapshotNew.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        source: "ExtraToys",
      }));

      const combined = [...listNew, ...listOriginal];
      setAllProducts(combined);

      const cache = {};
      combined.forEach((p) => {
        cache[p.id] = {
          title: p.title,
          price: p.price,
          breadtext: p.breadtext,
          image: p.image,
        };
      });
      setEditCache(cache);
    };

    fetchProducts();
  }, []);

  const handleSaveNewProduct = async () => {
    const validation = schema.validate(newProductData);
    if (validation.error) {
      setFormError(validation.error.details[0].message);
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "ExtraToys"), {
        ...newProductData,
        price: Number(newProductData.price),
      });

      const added = {
        id: docRef.id,
        ...newProductData,
        price: Number(newProductData.price),
        source: "ExtraToys",
      };

      setAllProducts((prev) => [added, ...prev]);
      setEditCache((prev) => ({
        ...prev,
        [docRef.id]: { ...added },
      }));
      setShowAddForm(false);
      setNewProductData({ title: "", breadtext: "", image: "", price: "" });
      setFormError("");
      setSuccessMessage("Ny produkt tillagd!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Fel vid tillägg:", error.message);
      setFormError("Kunde inte lägga till produkten.");
    }
  };

  const handleSave = async (id) => {
    const updated = editCache[id];
    const validation = schema.validate(updated);
    if (validation.error) {
      console.error("Valideringsfel:", validation.error.details[0].message);
      return;
    }

    const product = allProducts.find((p) => p.id === id);
    const collectionName = product?.source || "ExtraToys";

    try {
      await updateDoc(doc(db, collectionName, id), updated);

      setAllProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
      );

      setSuccessMessage("Tillagd!");
      setTimeout(() => setSuccessMessage(""), 3000);
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

  const handleDelete = (id) => {
    deleteExtraToy(id, "ExtraToys");
    setAllProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteMessage("Borttagen");
    setTimeout(() => setDeleteMessage(""), 3000);
  };

  const renderProductList = () => (
    <ul className="list-all">
      {allProducts.map((p) => {
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
                className="edit-pic"
                src={editCache[p.id].image}
                alt={`Bild för ${editCache[p.id].title}`}
                onError={(e) => {
                  e.currentTarget.src = "/no-image.jpeg";
                }}
              />
            )}

            <button className="save-btn" onClick={() => handleSave(p.id)}>
              Spara
            </button>

            {p.source === "ExtraToys" && (
              <button className="delete-btn" onClick={() => handleDelete(p.id)}>
                Ta bort
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <div className="edit-container">
        <button className="buttons-editor" onClick={() => setShowAddForm(true)}>
          Skapa ny produkt
        </button>

        <button
          className="buttons-editor"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "Dölj alla leksaker" : "Visa alla leksaker"}
        </button>
      </div>

      {successMessage && <div className="success">{successMessage}</div>}
      {deleteMessage && <div className="success">{deleteMessage}</div>}

      {showAddForm && (
        <div className="new-product-form">
          <h2>Lägg till ny produkt</h2>
          <p>Titel:</p>
          <input
            className="text-window"
            type="text"
            value={newProductData.title}
            onChange={(e) =>
              setNewProductData({ ...newProductData, title: e.target.value })
            }
          />

          <p>Pris:</p>
          <input
            className="text-window"
            type="number"
            value={newProductData.price}
            onChange={(e) =>
              setNewProductData({ ...newProductData, price: e.target.value })
            }
          />

          <p>Informationstext:</p>
          <textarea
            className="text-window"
            value={newProductData.breadtext}
            onChange={(e) =>
              setNewProductData({
                ...newProductData,
                breadtext: e.target.value,
              })
            }
          />

          <p>Bildlänk:</p>
          <input
            className="text-window"
            type="text"
            value={newProductData.image}
            onChange={(e) =>
              setNewProductData({ ...newProductData, image: e.target.value })
            }
          />

          {formError && <p className="error">{formError}</p>}

          <button className="saveBtn" onClick={handleSaveNewProduct}>
            Spara produkt
          </button>
          <button className="abortBtn" onClick={() => setShowAddForm(false)}>
            Avbryt
          </button>
        </div>
      )}

      {showAll && (
        <>
          <h2>Alla produkter</h2>
          {renderProductList()}
        </>
      )}
    </>
  );
}
