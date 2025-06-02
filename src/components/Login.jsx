import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Joi from "joi";
import "./Loginstyle.css";

const schema = Joi.string().required().messages({
  "string.empty": "Lösenordet krävs.",
});

export default function AdminPasswordInput({ onChange }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [inputStatus, setInputStatus] = useState(""); // <-- Ny state
  const correctPassword = "password";
  const navigate = useNavigate();

  const handleLogin = () => {
    const validation = schema.validate(password);
    if (validation.error) {
      setError(validation.error.details[0].message);
      setSuccessMessage("");
      setInputStatus("error");
    } else if (password !== correctPassword) {
      setError("Fel lösenord, försök igen tack!");
      setSuccessMessage("");
      setInputStatus("error");
    } else {
      setError("");
      setSuccessMessage("Inloggningen lyckades! Du skickas strax vidare...");
      setInputStatus("success");

      setTimeout(() => {
        navigate("/Login/AdminPanel");
      }, 3000);
    }
  };

  return (
    <>
      <div className="admin-field">
        <label className="admin-text" htmlFor="admin-password">
          Admin-Login
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`admin-input-field ${inputStatus}`} // <-- här
          placeholder="Ange Lösenord"
        />
        <button onClick={handleLogin} id="LoginBtn">
          Logga In
        </button>
        {error && <p className="error-field">{error}</p>}
        {successMessage && <p className="success-field">{successMessage}</p>}
      </div>
    </>
  );
}
