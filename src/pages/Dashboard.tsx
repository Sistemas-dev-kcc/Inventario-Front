import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { DashboardData } from "../types";

function Dashboard() {
  const [data, setData] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // CARGAR DASHBOARD
  // ==========================================

  useEffect(() => {
    loadDashboard();
  }, []);


  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const result = await api<DashboardData>(
        "/dashboard"
      );

      setData(result);

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Error al cargar dashboard"
      );

    } finally {

      setLoading(false);

    }
  }


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="p-6">

        <div className="mb-6">

          <div
            className="
              h-7
              w-40
              bg-gray-200
              rounded
              animate-pulse
            "
          />

          <div
            className="
              h-4
              w-64
              bg-gray-100
              rounded
              mt-2
              animate-pulse
            "
          />

        </div>


        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-4
          "
        >

          {[1, 2, 3].map((item) => (

            <div
              key={item}
              className="
                bg-white
                border
                rounded-xl
                p-5
                shadow-sm
              "
            >

              <div
                className="
                  h-4
                  w-28
                  bg-gray-200
                  rounded
                  animate-pulse
                "
              />

              <div
                className="
                  h-9
                  w-16
                  bg-gray-200
                  rounded
                  mt-3
                  animate-pulse
                "
              />

            </div>

          ))}

        </div>

      </div>
    );
  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="p-6">

        <div
          className="
            bg-red-50
            border
            border-red-200
            rounded-xl
            p-6
          "
        >

          <h2
            className="
              font-semibold
              text-red-700
            "
          >
            No se pudo cargar el dashboard
          </h2>

          <p
            className="
              text-sm
              text-red-600
              mt-1
            "
          >
            {error}
          </p>

          <button
            onClick={loadDashboard}
            className="
              mt-4
              px-4
              py-2
              rounded-lg
              bg-red-600
              text-white
              text-sm
              font-medium
              hover:bg-red-700
              transition
            "
          >
            Intentar nuevamente
          </button>

        </div>

      </div>
    );
  }


  if (!data) {
    return null;
  }


  // ==========================================
  // PORCENTAJE DE EQUIPOS ASIGNADOS
  // ==========================================

  const assignedPercentage =
    data.equipment.total > 0
      ? Math.round(
          (data.equipment.assigned /
            data.equipment.total) *
            100
        )
      : 0;


  // ==========================================
  // PORCENTAJE DE EQUIPOS EN ALMACÉN
  // ==========================================

  const warehousePercentage =
    data.equipment.total > 0
      ? Math.round(
          (data.equipment.warehouse /
            data.equipment.total) *
            100
        )
      : 0;


  return (
    <div className="p-6">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
          mb-8
        "
      >

        <div>

          <h1
            className="
              text-2xl
              font-bold
              text-gray-900
            "
          >
            Dashboard
          </h1>

          <p
            className="
              text-sm
              text-gray-500
              mt-1
            "
          >
            Resumen general del inventario
          </p>

        </div>


        <button
          onClick={loadDashboard}
          className="
            self-start
            md:self-auto
            px-4
            py-2
            rounded-lg
            border
            border-gray-200
            bg-white
            text-sm
            font-medium
            text-gray-700
            hover:bg-gray-50
            transition
          "
        >
          ↻ Actualizar
        </button>

      </div>


      {/* ==========================================
          USUARIOS
      ========================================== */}

      <section className="mb-8">

        <div className="mb-4">

          <h2
            className="
              text-lg
              font-semibold
              text-gray-900
            "
          >
            Usuarios
          </h2>

          <p
            className="
              text-sm
              text-gray-500
              mt-1
            "
          >
            Resumen de usuarios registrados
          </p>

        </div>


        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-4
          "
        >

          <Card
            title="Total usuarios"
            value={data.users.total}
            icon="👥"
            description="Usuarios registrados"
            iconClass="bg-slate-100"
          />

          <Card
            title="Usuarios activos"
            value={data.users.active}
            icon="✓"
            description="Usuarios actualmente activos"
            iconClass="bg-green-100"
            valueClass="text-green-700"
          />

          <Card
            title="Usuarios inactivos"
            value={data.users.inactive}
            icon="−"
            description="Usuarios desactivados"
            iconClass="bg-gray-100"
            valueClass="text-gray-600"
          />

        </div>

      </section>


      {/* ==========================================
          EQUIPOS
      ========================================== */}

      <section>

        <div className="mb-4">

          <h2
            className="
              text-lg
              font-semibold
              text-gray-900
            "
          >
            Equipos
          </h2>

          <p
            className="
              text-sm
              text-gray-500
              mt-1
            "
          >
            Estado actual del inventario
          </p>

        </div>


        {/* CARDS DE EQUIPOS */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-4
          "
        >

          <Card
            title="Total"
            value={data.equipment.total}
            icon="💻"
            description="Equipos registrados"
            iconClass="bg-slate-100"
          />

          <Card
            title="Asignados"
            value={data.equipment.assigned}
            icon="👤"
            description={`${assignedPercentage}% del inventario`}
            iconClass="bg-blue-100"
            valueClass="text-blue-700"
          />

          <Card
            title="Almacén"
            value={data.equipment.warehouse}
            icon="📦"
            description={`${warehousePercentage}% del inventario`}
            iconClass="bg-purple-100"
            valueClass="text-purple-700"
          />

        </div>


        {/* ==========================================
            RESUMEN DE ASIGNACIÓN
        ========================================== */}

        <div
          className="
            bg-white
            border
            border-gray-200
            rounded-xl
            shadow-sm
            mt-6
            p-6
          "
        >

          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-2
              mb-4
            "
          >

            <div>

              <h3
                className="
                  font-semibold
                  text-gray-900
                "
              >
                Asignación de equipos
              </h3>

              <p
                className="
                  text-sm
                  text-gray-500
                  mt-1
                "
              >
                Equipos asignados respecto al total
              </p>

            </div>


            <span
              className="
                text-lg
                font-bold
                text-gray-900
              "
            >
              {assignedPercentage}%
            </span>

          </div>


          {/* BARRA */}

          <div
            className="
              w-full
              h-3
              bg-gray-100
              rounded-full
              overflow-hidden
            "
          >

            <div
              className="
                h-full
                bg-slate-800
                rounded-full
                transition-all
                duration-500
              "
              style={{
                width: `${assignedPercentage}%`
              }}
            />

          </div>


          {/* INFORMACIÓN */}

          <div
            className="
              flex
              justify-between
              mt-3
              text-xs
              text-gray-500
            "
          >

            <span>
              {data.equipment.assigned} asignados
            </span>

            <span>
              {data.equipment.warehouse} en almacén
            </span>

          </div>

        </div>

      </section>

    </div>
  );
}


// ==========================================
// CARD
// ==========================================

interface CardProps {
  title: string;
  value: number;
  icon: string;
  description: string;
  iconClass?: string;
  valueClass?: string;
}


function Card({
  title,
  value,
  icon,
  description,
  iconClass = "bg-gray-100",
  valueClass = "text-gray-900"
}: CardProps) {

  return (
    <div
      className="
        bg-white
        border
        border-gray-200
        rounded-xl
        p-5
        shadow-sm
        hover:shadow-md
        transition
      "
    >

      <div
        className="
          flex
          items-start
          justify-between
        "
      >

        <div>

          <p
            className="
              text-sm
              font-medium
              text-gray-500
            "
          >
            {title}
          </p>

          <p
            className={`
              text-3xl
              font-bold
              mt-2
              ${valueClass}
            `}
          >
            {value}
          </p>

        </div>


        <div
          className={`
            w-10
            h-10
            rounded-lg
            flex
            items-center
            justify-center
            text-lg
            ${iconClass}
          `}
        >
          {icon}
        </div>

      </div>


      <p
        className="
          text-xs
          text-gray-400
          mt-4
        "
      >
        {description}
      </p>

    </div>
  );
}


export default Dashboard;