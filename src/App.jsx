import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./components/firebase";

import Home from "./pages/Home";
import AdminPasswordInput from "./components/Login";
import Cart from "./pages/Cart";
import AdminPanel from "./components/AdminPanel.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import AllToys from "./components/Firebase/AllToys.jsx";

export default function App() {
  const [toys, setToys] = useState([]);
  useEffect(() => {
    const fetchToys = async () => {
      const toysSnapshot = await getDocs(collection(db, "Leksaker"));
      const toysList = toysSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setToys(toysList);
    };

    fetchToys();
  }, []);

  if (toys.length === 0) {
    return <p>Laddar leksaker...</p>;
  }

  return (
    <main>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Login" element={<AdminPasswordInput />} />
        <Route path="/category/:category" element={<AllToys toys={toys} />} />
        <Route path="/Cart/Login" element={<AdminPasswordInput />} />
        <Route path="/Login/AdminPanel" element={<AdminPanel />} />
      </Routes>
      <Footer />
    </main>
  );
}

//Vi importerar HashRouter, Routes och Route från react-router-dom, just för att kunna göra våra sökvägar med HashRouter som vi delat in ovan. Våran Route behövder då en path som vi indikerar med / som vår "startsida", som vi även kallar för Home, som är en sida vi i sin tur har importerat från Home i pages.
