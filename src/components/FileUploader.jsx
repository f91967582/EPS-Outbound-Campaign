export default function FileSelector({ accept = ".csv", onSelect }) {
  return (
    <input
      type="file"
      accept={accept}
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) onSelect(file);
      }}
    />
  );
}
