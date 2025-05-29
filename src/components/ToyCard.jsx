import { useState } from "react";
import fallbackImage from "/no-image.jpeg";
import "./Firebase/AllToys-style.css";

export default function ToyCard({
  toy,
  addToyToCart,
  removeToyFromCart,
  quantityInCart,
  addedToCart,
}) {
  const [imgSrc, setImgSrc] = useState(toy.image || fallbackImage);

  return (
    <li className="list-items">
      <div className="title-card">{toy.title}</div>
      <img
        className="title-picture"
        src={imgSrc}
        alt={toy.title}
        onError={(e) => {
          e.currentTarget.onerror = null;
          setImgSrc(fallbackImage);
        }}
      />

      <button id="addBtn" onClick={() => addToyToCart(toy.id)}>
        LÄGG TILL
      </button>
      <button id="remBtn" onClick={() => removeToyFromCart(toy.id)}>
        TA BORT
      </button>

      <p id="quantityInCart" className={addedToCart ? "" : "hidden"}>
        {addedToCart ? `${quantityInCart} st` : ""}
      </p>

      <div className="text-card">{toy.breadtext}</div>
      <div className="price-card">{toy.price} kr</div>
    </li>
  );
}
