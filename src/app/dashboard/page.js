"use client"

import { supabase } from "../../lib/supabaseClient"
import { useEffect, useState } from "react"

export default function Dashboard() {
  const [presupuestos, setPresupuestos] = useState([])
  const [totalVentas, setTotalVentas] = useState(0)
  const [totalPedidos, setTotalPedidos] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("presupuestos")
        .select(`
          id,
          cliente,
          estado,
          created_at,
          lineas_presupuesto (
            id,
            total
          )
        `)

      if (error) {
        console.error(error)
        return
      }

      const confirmados = (data || []).filter(p => p.estado === "confirmado")

      let ventas = 0

      confirmados.forEach(p => {
        (p.lineas_presupuesto || []).forEach(l => {
          ventas += l.total
        })
      })

      setPresupuestos(confirmados)
      setTotalVentas(ventas)
      setTotalPedidos(confirmados.length)
    }

    fetchData()
  }, [])

  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">📊 Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 mb-6">

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Ventas totales</p>
          <h2 className="text-2xl font-bold">{totalVentas} €</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Pedidos confirmados</p>
          <h2 className="text-2xl font-bold">{totalPedidos}</h2>
        </div>

      </div>

      {/* LISTA */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Últimos pedidos</h2>

        {presupuestos.map(p => {
          const total = (p.lineas_presupuesto || []).reduce(
            (acc, l) => acc + l.total,
            0
          )

          return (
            <div key={p.id} className="flex justify-between border-b py-2">
              <span>{p.cliente}</span>
              <span>{total} €</span>
            </div>
          )
        })}
      </div>

    </div>
  )
}
