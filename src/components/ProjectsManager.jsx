import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    teamMembers: [],
    impact: "",
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Proyectos"), (snapshot) => {
      const projectList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectList);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "teamMembers") {
      setFormData({
        ...formData,
        teamMembers: value.split(",").map((m) => m.trim()).filter(Boolean),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingProject) {
      await updateDoc(doc(db, "Proyectos", editingProject.id), formData);
    } else {
      await addDoc(collection(db, "Proyectos"), formData);
    }

    resetForm();
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({ ...project });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Estás segura de eliminar este proyecto?");
    if (!confirmed) return;

    await deleteDoc(doc(db, "Proyectos", id));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
      teamMembers: [],
      impact: "",
    });
    setEditingProject(null);
    setShowForm(false);
  };

  return (
    <div className="p-6 bg-pink-50 rounded-xl shadow-lg border border-pink-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-pink-600">📁 Gestión de Proyectos</h2>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-md font-medium"
        >
          Nuevo Proyecto
        </motion.button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingProject ? "Editar Proyecto" : "Nuevo Proyecto"}
          </h3>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="title"
              placeholder="Título del Proyecto"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="p-3 rounded-lg border border-pink-300" />

            <input
              type="text"
              name="category"
              placeholder="Categoría"
              required
              value={formData.category}
              onChange={handleInputChange}
              className="p-3 rounded-lg border border-pink-300" />

            <textarea
              name="description"
              placeholder="Descripción"
              required
              value={formData.description}
              onChange={handleInputChange}
              className="p-3 rounded-lg border border-pink-300 md:col-span-2" />

            <input
              type="text"
              name="teamMembers"
              placeholder="Miembros del equipo (separados por coma)"
              value={formData.teamMembers.join(", ")}
              onChange={handleInputChange}
              className="p-3 rounded-lg border border-pink-300 md:col-span-2" />

            <textarea
              name="impact"
              placeholder="Impacto del proyecto"
              value={formData.impact}
              onChange={handleInputChange}
              className="p-3 rounded-lg border border-pink-300 md:col-span-2" />

            <div className="md:col-span-2 flex gap-3 mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                type="submit"
                className="flex-1 bg-pink-500 text-white py-3 rounded-lg"
              >
                {editingProject ? "Actualizar Proyecto" : "Agregar Proyecto"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-400 text-white py-3 rounded-lg"
              >
                Cancelar
              </motion.button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            className="bg-white p-4 border border-pink-200 rounded-xl shadow-sm flex flex-col md:flex-row justify-between"
            whileHover={{ scale: 1.03 }}
          >
            <div>
              <p className="font-bold text-pink-600 text-lg">{project.title}</p>
              <p className="text-sm text-gray-600">{project.category}</p>
              <p className="text-gray-500 text-xs mt-1">{project.description}</p>

              <p className="mt-1 text-gray-700 text-sm">
                <strong>Equipo:</strong> {project.teamMembers?.join(", ")}
              </p>

              <p className="mt-1 text-gray-700 text-sm">
                <strong>Impacto:</strong> {project.impact}
              </p>
            </div>

            <div className="flex space-x-2 mt-3 md:mt-0">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => handleEdit(project)}
                className="px-3 py-1 bg-yellow-400 text-black rounded-lg"
              >
                Editar
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => handleDelete(project.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg"
              >
                Eliminar
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ProjectsManager;

