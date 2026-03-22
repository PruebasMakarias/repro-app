"use client"
import { supabase } from "../lib/supabaseClient"
import { useEffect, useState } from "react"

export default function Home() {
  const [cliente, setCliente] = useState("")
  const [productos, setProductos] = useState([])
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const [cantidad, setCantidad] = useState(1)
  const [lineas, setLineas] = useState([])

  useEffect(() => {
    const fetchProductos = async () => {
      const { data } = await supabase.from("productos").select("*")
      setProductos(data || [])
    }
    fetchProductos()
  }, [])

  useEffect(() => {
    const fetchLineas = async () => {
      const { data } = await supabase
        .from("presupuestos")
        .select("*")
        .order("created_at", { ascending: true })
      setLineas(data || [])
    }
    fetchLineas()
  }, [])

  const añadirLinea = async () => {
    if (!productoSeleccionado || !cliente) return

    const precio = productoSeleccionado.precio_venta
    const total = precio * cantidad

    const { data } = await supabase
      .from("presupuestos")
      .insert([{
        cliente,
        producto: productoSeleccionado.nombre,
        cantidad,
        precio,
        total
      }])
      .select()

    setLineas([...lineas, data[0]])
  }

  const total = lineas.reduce((acc, l) => acc + l.total, 0)

  return (
    <div className="max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">Nuevo presupuesto</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">

        <input
          className="w-full border p-2 rounded"
          placeholder="Cliente"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            className="border p-2 rounded"
            onChange={(e) =>
              setProductoSeleccionado(
                productos.find(p => p.id === Number(e.target.value))
              )
            }
          >
            <option>Selecciona producto</option>
            {productos.map(p => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>

          <input
            type="number"
            className="border p-2 rounded"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
          />
        </div>

        <button
          onClick={añadirLinea}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Añadir producto
        </button>
      </div>

      {/* Lista */}
      <div className="mt-6 bg-white p-4 rounded-xl shadow">
        {lineas.map(l => (
          <div key={l.id} className="flex justify-between border-b py-2">
            <span>{l.producto} x{l.cantidad}</span>
            <span>{l.total} €</span>
          </div>
        ))}

        <div className="text-right font-bold mt-4">
          Total: {total} €
        </div>
      </div>

    </div>
  )
}