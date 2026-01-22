export default function TabPanel({ active, children }) {
  return (
    <div className={`tab-content ${active ? "active" : ""}`}>
      {active && children}
    </div>
  );
}
