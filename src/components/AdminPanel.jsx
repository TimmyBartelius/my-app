import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import TextField from "./TextField";

export default function AdminPanel() {
  return (
    <div>
      <TextField />
    </div>
  );
}
