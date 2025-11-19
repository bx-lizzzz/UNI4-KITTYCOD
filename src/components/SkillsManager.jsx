// src/components/SkillsManager.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase"; 
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const SkillsManager = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({
    nombre: "",
    categoria: "",
    descripcion: "",
    nivel: 0,
  });

  const skillsCollection = collection(db, "Habilidades");

  // Cargar habilidades desde Firebase
  const fetchSkills = async () => {
    const snapshot = await getDocs(skillsCollection);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSkills(data);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Agregar nueva habilidad
  const handleAdd = async () => {
    if (!newSkill.nombre || !newSkill.categoria) return;
    await addDoc(skillsCollection, newSkill);
    setNewSkill({ nombre: "", categoria: "", descripcion: "", nivel: 0 });
    fetchSkills();
  };

  // Editar habilidad
  const handleUpdate = async (id, field, value) => {
    const skillDoc = doc(db, "Habilidades", id);
    const updatedValue = field === "nivel" ? Number(value) : value;
    await updateDoc(skillDoc, { [field]: updatedValue });
    fetchSkills();
  };

  // Eliminar habilidad
  const handleDelete = async (id) => {
    const skillDoc = doc(db, "Habilidades", id);
    await deleteDoc(skillDoc);
    fetchSkills();
  };

  return (
    <div className="bg-pink-50 p-6 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold text-pink-700 mb-4">Gestionar Habilidades</h2>

      {/* Agregar nueva habilidad */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
        <input
          type="text"
          placeholder="Nombre"
          value={newSkill.nombre}
          onChange={e => setNewSkill(prev => ({ ...prev, nombre: e.target.value }))}
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          placeholder="Categoría"
          value={newSkill.categoria}
          onChange={e => setNewSkill(prev => ({ ...prev, categoria: e.target.value }))}
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={newSkill.descripcion}
          onChange={e => setNewSkill(prev => ({ ...prev, descripcion: e.target.value }))}
          className="border px-2 py-1 rounded"
        />
        <input
          type="number"
          placeholder="Nivel (%)"
          value={newSkill.nivel}
          onChange={e => setNewSkill(prev => ({ ...prev, nivel: e.target.value }))}
          className="border px-2 py-1 rounded"
          min={0}
          max={100}
        />
        <button
          onClick={handleAdd}
          className="bg-pink-500 text-white px-3 rounded"
        >
          Agregar
        </button>
      </div>

      {/* Lista editable */}
      <ul className="space-y-3">
        {skills.map(skill => (
          <li key={skill.id} className="bg-white rounded-2xl p-4 border border-pink-200 shadow flex flex-col gap-2">
            <input
              value={skill.nombre}
              onChange={e => handleUpdate(skill.id, "nombre", e.target.value)}
              className="border px-2 py-1 rounded w-full"
            />
            <input
              value={skill.categoria}
              onChange={e => handleUpdate(skill.id, "categoria", e.target.value)}
              className="border px-2 py-1 rounded w-full"
            />
            <input
              value={skill.descripcion}
              onChange={e => handleUpdate(skill.id, "descripcion", e.target.value)}
              className="border px-2 py-1 rounded w-full"
            />
            <input
              type="number"
              value={skill.nivel}
              onChange={e => handleUpdate(skill.id, "nivel", e.target.value)}
              className="border px-2 py-1 rounded w-full"
              min={0}
              max={100}
            />
            <button
              onClick={() => handleDelete(skill.id)}
              className="bg-red-500 text-white px-3 py-1 rounded mt-2 w-1/3"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillsManager;
