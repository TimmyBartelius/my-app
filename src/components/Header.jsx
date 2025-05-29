import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  const handleClickLogo = () => {
    navigate("/");
  };
  const handleClickCart = () => {
    navigate("/Cart");
  };

  const handleCategoryClick = (category) => {
    navigate(category === "alla" ? "/" : `/category/${category}`);
  };

  return (
    <header>
      <section id="allLogosHeader">
        <nav>
          <img
            onClick={handleClickLogo}
            id="logo"
            src={`${import.meta.env.BASE_URL}Logga.png`}
            alt="Logga"
          />
        </nav>
        <p id="franchise">SVENSKA LEKSAKER AB</p>
        <nav>
          <img
            onClick={handleClickCart}
            id="cartLogo"
            src={`${import.meta.env.BASE_URL}Cart.png`}
            alt="Cart"
          />
        </nav>
      </section>
      <div id="allProductsBtns">
        <nav
          className="picForCat"
          onClick={() => handleCategoryClick("sommar")}
        >
          <img
            src={`${import.meta.env.BASE_URL}Sommarbild.png`}
            alt="Sommarleksaker"
          />
          <p className="categories">Sommarleksaker</p>
        </nav>
        <nav
          className="picForCat"
          onClick={() => handleCategoryClick("vinter")}
        >
          <img
            src={`${import.meta.env.BASE_URL}Vinterbild.png`}
            alt="Vinterleksaker"
          />
          <p className="categories">Vinterleksaker</p>
        </nav>
        <nav
          className="picForCat"
          onClick={() => handleCategoryClick("brädspel")}
        >
          <img
            src={`${import.meta.env.BASE_URL}Boardgamebild.png`}
            alt="Brädspel"
          />
          <p className="categories">Brädspel</p>
        </nav>
        <nav
          className="picForCat"
          onClick={() => handleCategoryClick("batteri")}
        >
          <img
            src={`${import.meta.env.BASE_URL}Batteridrivna.png`}
            alt="Batterileksaker"
          />
          <p className="categories">Batteridrivet</p>
        </nav>
      </div>
    </header>
  );
};

export default Header;

//1. Headern behöver logga, cart, Produkt-knapp samt blå bakgrund (CHECK)
//2. Logga skall visa sig tryckbar, på klick skall den leda till "hem"-skärmen, alltså startsidan (CHECK)
//3. Cart skall visa sig tryckbar, på klick skall den leda till "kundvagnen"(CHECK)
