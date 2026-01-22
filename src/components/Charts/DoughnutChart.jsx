import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart({ title, labels, data, colors }) {
  return (
    <div className="chart-container">
      <div className="chart-title">{title}</div>
      <div className="canvas-wrapper">
        <Doughnut
          data={{
            labels,
            datasets: [{ data, backgroundColor: colors, borderWidth: 0 }],
          }}
          options={{
            cutout: "65%",
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: { usePointStyle: true, padding: 20 },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
