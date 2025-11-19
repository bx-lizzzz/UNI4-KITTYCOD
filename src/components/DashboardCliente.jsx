// src/components/DashboardCliente.jsx
import React, { useState } from "react";
import { logout } from "../services/auth";
import UserProfile from "./UserProfile";

// CRUD de testimonios
const TestimoniosManager = () => {
  const [testimonios, setTestimonios] = useState([]);
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!input) return;
    const newTestimonio = { id: Date.now(), text: input };
    setTestimonios([newTestimonio, ...testimonios]);
    setInput("");
  };

  const handleDelete = (id) => {
    setTestimonios(testimonios.filter((t) => t.id !== id));
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-pink-700 mb-4">Notitas</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un testimonio"
          className="flex-1 border border-pink-300 rounded-lg px-3 py-2 text-sm"
        />
        <button
          onClick={handleAdd}
          className="bg-pink-500 text-white px-4 py-2 rounded-xl"
        >
          Agregar
        </button>
      </div>

      <ul className="space-y-2">
        {testimonios.map((t) => (
          <li
            key={t.id}
            className="flex justify-between items-center bg-pink-50 px-4 py-2 rounded-lg border border-pink-200"
          >
            <span>{t.text}</span>
            <button
              onClick={() => handleDelete(t.id)}
              className="text-rose-600 font-bold px-2 py-1 hover:bg-rose-100 rounded"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const DashboardCliente = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: "profile", name: "Mi Perfil", icon: "🐱" },
    { id: "testimonios", name: "Testimonios", icon: "📝" },
  ];

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      window.location.href = "/";
    } catch (e) {
      console.error("Error al cerrar sesión:", e);
    }
    setLoading(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-pink-50 rounded-2xl shadow-md">
            <h1 className="text-3xl font-bold text-pink-700 mb-4">
              ¡Bienvenida a tu Coder! 🐾
            </h1>
            <p className="text-pink-600 text-lg">
              Aquí puedes gestionar tu perfil, tus testimonios y todo lo
              relacionado con tu cuenta. Explora y diviértete personalizando
              tu espacio.
            </p>
          </div>
        );
      case "testimonios":
        return <TestimoniosManager />;
      default:
        return <UserProfile />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-pink-300 to-pink-500 shadow-lg py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center text-2xl shadow-inner">
              🐾
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Kitty Code Dashboard</h1>
              <p className="text-pink-100 text-sm">Cliente</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loading}
            className="bg-white/90 text-pink-700 px-4 py-2 rounded-xl font-semibold border border-pink-200 hover:bg-white shadow transition disabled:opacity-50"
          >
            {loading ? "Cerrando..." : "Cerrar Sesión"}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* SIDEBAR */}
        <aside className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-pink-200 h-fit">
          <h2 className="text-lg font-semibold text-pink-700 mb-4">Navegación</h2>
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition ${
                    activeTab === tab.id
                      ? "bg-pink-200 text-pink-800 shadow-inner border-l-4 border-pink-500"
                      : "text-pink-600 hover:bg-pink-100"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* PANEL PRINCIPAL */}
        <main className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-lg border border-pink-200 min-h-[500px]">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardCliente;
