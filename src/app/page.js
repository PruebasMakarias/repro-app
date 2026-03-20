"use client"
import { useState } from "react"

export default function Home() {
  const [cliente, setCliente] = useState("")
  const [producto, setProducto] = useState("")
  const [cantidad, setCantidad] = useState(1)
  const [precio, setPrecio] = useState(0)
  const [lineas, setLineas] = useState([])

  const añadirLinea = () => {
    if (!producto || cantidad <= 0 || precio <= 0) return

    const nuevaLinea = {
      producto,
      cantidad,
      precio,
      total: cantidad * precio
    }

    setLineas([...lineas, nuevaLinea])

    setProducto("")
    setCantidad(1)
    setPrecio(0)
  }

  const eliminarLinea = (index) => {
    const nuevasLineas = lineas.filter((_, i) => i !== index)
    setLineas(nuevasLineas)
  }

  const totalPresupuesto = lineas.reduce(
    (acc, linea) => acc + linea.total,
    0
  )

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl">
        
        <h1 className="text-2xl font-bold mb-4">🧾 Presupuesto</h1>

        {/* Cliente */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Cliente</label>
          <input
            className="w-full border rounded-lg p-2"
            type="text"
            placeholder="Nombre del cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
          />
        </div>

        {/* Añadir producto */}
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Añadir producto</h2>

          <div className="grid grid-cols-3 gap-2">
            <input
              className="border rounded-lg p-2"
              type="text"
              placeholder="Producto"
              value={producto}
              onChange={(e) => setProducto(e.target.value)}
            />

            <input
              className="border rounded-lg p-2"
              type="number"
              placeholder="Cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />

            <input
              className="border rounded-lg p-2"
              type="number"
              placeholder="Precio"
              value={precio}
              onChange={(e) => setPrecio(Number(e.target.value))}
            />
          </div>

          <button
            onClick={añadirLinea}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            ➕ Añadir
          </button>
        </div>

        {/* Lista de productos */}
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Productos</h2>

          {lineas.length === 0 ? (
            <p className="text-gray-500">No hay productos aún</p>
          ) : (
            <ul className="space-y-2">
              {lineas.map((linea, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded-lg"
                >
                  <span>
                    {linea.producto} - {linea.cantidad} x {linea.precio} €
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {linea.total} €
                    </span>

                    <button
                      onClick={() => eliminarLinea(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ❌
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Total */}
        <div className="text-right">
          <h2 className="text-xl font-bold">
            Total: {totalPresupuesto} €
          </h2>
        </div>

      </div>
    </main>
  )
}