// StatsPanel.tsx
import React from 'react';

interface Stats {
  totalPaintable: number;
  paintedCount: number;
  remaining: number;
}

interface StatsPanelProps {
  stats: Stats;
  onClear: () => void;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ stats, onClear }) => {
  const { totalPaintable, paintedCount, remaining } = stats;

  // Calcular porcentaje de completado
  const completionPercentage = totalPaintable > 0 
    ? Math.round((paintedCount / totalPaintable) * 100) 
    : 0;

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center", 
      gap: "16px",
      width: "100%",
      maxWidth: "600px"
    }}>
      {/* Barra de progreso */}
      <div style={{ 
        width: "100%",
        background: "#f0f0f0",
        borderRadius: "10px",
        overflow: "hidden",
        height: "20px",
        position: "relative"
      }}>
        <div 
          style={{ 
            width: `${completionPercentage}%`,
            background: `linear-gradient(90deg, #4d94ff, #4dff4d)`,
            height: "100%",
            transition: "width 0.3s ease",
            borderRadius: "10px"
          }} 
        />
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "12px",
          fontWeight: "bold",
          color: completionPercentage > 50 ? "white" : "black"
        }}>
          {completionPercentage}% Completado
        </div>
      </div>

      {/* Estadísticas y botón */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        gap: "20px",
        padding: "10px",
        background: "#f5f5f5",
        borderRadius: "8px",
        fontSize: "14px"
      }}>
        <div style={{ display: "flex", gap: "20px" }}>
          <div>
            <strong>Total:</strong> {totalPaintable}
          </div>
          <div>
            <strong style={{ color: "#4d94ff" }}>Pintadas:</strong> {paintedCount}
          </div>
          <div>
            <strong style={{ color: "#ff4d4d" }}>Restantes:</strong> {remaining}
          </div>
        </div>

        <button
          onClick={onClear}
          style={{
            padding: "8px 16px",
            background: "#ff4d4d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            transition: "background 0.2s",
            minWidth: "120px"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#e04545"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#ff4d4d"}
        >
          🧹 Limpiar Todo
        </button>
      </div>
    </div>
  );
};

export default StatsPanel;