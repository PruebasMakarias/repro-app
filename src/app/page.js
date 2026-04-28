"use client"

import { supabase } from "../lib/supabaseClient"
import { useEffect, useState } from "react"

export default function Home() {

  // 🔹 ESTADOS
  const [cliente, setCliente] = useState("")
  const [productos, setProductos] = useState([])
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const [cantidad, setCantidad] = useState(1)
  const [lineas, setLineas] = useState([])
  const [presupuestoId, setPresupuestoId] = useState(null)

  // 🔹 CARGAR PRODUCTOS
  useEffect(() => {
    const fetchProductos = async () => {
      const { data, error } = await supabase
        .from("productos")
        .select("*")

      if (error) {
        console.error("Error cargando productos:", error)
      } else {
        console.log("PRODUCTOS:", data)
        setProductos(data || [])
      }
    }

    fetchProductos()
  }, [])

  // 🔹 CREAR PRESUPUESTO (SOLO UNA VEZ)
  const crearPresupuesto = async () => {
    if (!cliente) {
      alert("Introduce un cliente")
      return
    }

    const { data, error } = await supabase
      .from("presupuestos")
      .insert([{ cliente }])
      .select()

    if (error) {
      console.error("Error creando presupuesto:", error)
      return
    }

    setPresupuestoId(data[0].id)
  }

  // 🔹 AÑADIR PRODUCTO
  const añadirLinea = async () => {
    if (!productoSeleccionado || !presupuestoId) {
      alert("Selecciona producto y crea presupuesto primero")
      return
    }

    const precio = productoSeleccionado.precio_venta
    const total = precio * cantidad

    const { data, error } = await supabase
      .from("lineas_presupuesto")
      .insert([{
        presupuesto_id: presupuestoId,
        producto: productoSeleccionado.nombre,
        cantidad,
        precio,
        total
      }])
      .select()

    if (error) {
      console.error("Error añadiendo línea:", error)
      return
    }

    setLineas([...lineas, data[0]])
  }

  // 🔴 ELIMINAR LÍNEA
  const eliminarLinea = async (id) => {
    const { error } = await supabase
      .from("lineas_presupuesto")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error eliminando:", error)
      return
    }

    setLineas(lineas.filter(l => l.id !== id))
  }

  // 🔹 CONFIRMAR PRESUPUESTO
  const confirmarPresupuesto = async () => {
    if (!presupuestoId) return

    const { error } = await supabase
      .from("presupuestos")
      .update({ estado: "confirmado" })
      .eq("id", presupuestoId)

    if (error) {
      console.error("Error confirmando:", error)
      return
    }

    alert("Presupuesto confirmado ✅")

    // reset
    setCliente("")
    setLineas([])
    setPresupuestoId(null)
    setProductoSeleccionado(null)
    setCantidad(1)
  }

  const total = lineas.reduce((acc, l) => acc + l.total, 0)

  return (
    <div className="max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">Nuevo presupuesto</h1>

      {!presupuestoId ? (
        // 🟢 CREAR PRESUPUESTO
        <div className="bg-white p-6 rounded-xl shadow space-y-4">

          <input
            className="w-full border p-2 rounded"
            placeholder="Cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
          />

          <button
            onClick={crearPresupuesto}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Crear presupuesto
          </button>

        </div>
      ) : (
        // 🔵 AÑADIR PRODUCTOS
        <div className="bg-white p-6 rounded-xl shadow space-y-4">

          <p className="font-semibold">Cliente: {cliente}</p>

          <select
            className="border p-2 rounded w-full"
            value={productoSeleccionado?.id || ""}
            onChange={(e) => {
              const producto = productos.find(
                p => p.id === Number(e.target.value)
              )
              setProductoSeleccionado(producto)
            }}
          >
            <option value="">Selecciona producto</option>

            {(productos || []).map(p => (
              <option key={p.id} value={p.id}>
                {p.nombre} - {p.precio_venta} €
              </option>
            ))}
          </select>

          <input
            type="number"
            className="border p-2 rounded w-full"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
          />

          <button
            onClick={añadirLinea}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Añadir producto
          </button>

          {/* LISTA */}
          <div className="mt-4">
            {lineas.map(l => (
              <div key={l.id} className="flex justify-between border-b py-2">
                <span>{l.producto} x{l.cantidad}</span>

                <div className="flex gap-4 items-center">
                  <span>{l.total} €</span>

                  <button
                    onClick={() => eliminarLinea(l.id)}
                    className="text-red-500"
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-right font-bold mt-4">
            Total: {total} €
          </div>

          <button
            onClick={confirmarPresupuesto}
            className="w-full bg-green-700 text-white py-2 rounded mt-4"
          >
            Confirmar presupuesto
          </button>

        </div>
      )}

    </div>
  )
}
