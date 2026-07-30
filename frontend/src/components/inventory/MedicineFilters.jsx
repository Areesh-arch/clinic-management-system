export default function MedicineFilters() {
  return (
    <select className="border rounded-lg px-4 py-2">
      <option>All</option>
      <option>In Stock</option>
      <option>Low Stock</option>
      <option>Out of Stock</option>
    </select>
  );
}