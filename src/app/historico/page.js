"use client"

import { supabase } from "../../lib/supabaseClient"
import { useEffect, useState } from "react"

export default function Historico() {
  const [presupuestos, setPresupuestos] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("presupuestos")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error cargando histórico:", error)
          return
        }

        setPresupuestos(data || [])
      } catch (err) {
        console.error("Error inesperado:", err)
      }
    }

    fetchData()
  }, [])

  const agrupados = (presupuestos || []).reduce((acc, item) => {
    if (!acc[item.cliente]) acc[item.cliente] = []
    acc[item.cliente].push(item)
    return acc
  }, {})

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📊 Histórico</h1>

      {Object.keys(agrupados).length === 0 && (
        <p>No hay datos aún</p>
      )}

      {Object.entries(agrupados).map(([cliente, items]) => {
        const total = items.reduce((acc, i) => acc + i.total, 0)

        return (
          <div key={cliente} className="bg-white p-4 rounded-xl shadow mb-4">
            <h2 className="text-xl font-semibold">{cliente}</h2>

            <div className="mt-2 space-y-1">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span>{i.producto} x{i.cantidad}</span>
                  <span>{i.total} €</span>
                </div>
              ))}
            </div>

            <div className="text-right mt-2 font-bold">
              Total: {total} €
            </div>
          </div>
        )
      })}
    </div>
  )
}