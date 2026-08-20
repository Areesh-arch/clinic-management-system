import { useState } from "react";

export default function MedicineForm({ onSave }) {
  const [medicine, setMedicine] = useState({
    name: "",
    category: "",
    brand: "",
    unit: "",
    quantity: "",
    minimum_stock: "",
    purchase_price: "",
    selling_price: "",
    expiry_date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setMedicine((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: medicine.name.trim(),
      category: medicine.category.trim(),
      brand: medicine.brand.trim() || null,
      unit: medicine.unit.trim(),
      quantity: Number(medicine.quantity),
      minimum_stock: Number(medicine.minimum_stock),
      purchase_price: Number(medicine.purchase_price),
      selling_price: Number(medicine.selling_price),
      expiry_date: medicine.expiry_date || null,
    };

    await onSave(payload);

    setMedicine({
      name: "",
      category: "",
      brand: "",
      unit: "",
      quantity: "",
      minimum_stock: "",
      purchase_price: "",
      selling_price: "",
      expiry_date: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Medicine Name */}
      <input
        name="name"
        value={medicine.name}
        onChange={handleChange}
        type="text"
        placeholder="Medicine Name"
        required
        className="w-full border rounded-lg px-4 py-2"
      />

      {/* Category */}
      <input
        name="category"
        value={medicine.category}
        onChange={handleChange}
        type="text"
        placeholder="Category"
        required
        className="w-full border rounded-lg px-4 py-2"
      />

      {/* Brand */}
      <input
        name="brand"
        value={medicine.brand}
        onChange={handleChange}
        type="text"
        placeholder="Brand"
        className="w-full border rounded-lg px-4 py-2"
      />

      {/* Unit */}
      <input
        name="unit"
        value={medicine.unit}
        onChange={handleChange}
        type="text"
        placeholder="Unit (e.g. Box, Bottle, Tablet)"
        required
        className="w-full border rounded-lg px-4 py-2"
      />

      {/* Quantity */}
      <input
        name="quantity"
        value={medicine.quantity}
        onChange={handleChange}
        type="number"
        min="0"
        placeholder="Quantity"
        required
        className="w-full border rounded-lg px-4 py-2"
      />

      {/* Minimum Stock */}
      <input
        name="minimum_stock"
        value={medicine.minimum_stock}
        onChange={handleChange}
        type="number"
        min="0"
        placeholder="Minimum Stock"
        required
        className="w-full border rounded-lg px-4 py-2"
      />

      {/* Purchase Price */}
      <input
        name="purchase_price"
        value={medicine.purchase_price}
        onChange={handleChange}
        type="number"
        min="0"
        step="0.01"
        placeholder="Purchase Price"
        required
        className="w-full border rounded-lg px-4 py-2"
      />

      {/* Selling Price */}
      <input
        name="selling_price"
        value={medicine.selling_price}
        onChange={handleChange}
        type="number"
        min="0"
        step="0.01"
        placeholder="Selling Price"
        required
        className="w-full border rounded-lg px-4 py-2"
      />

      {/* Expiry Date */}
      <input
        name="expiry_date"
        value={medicine.expiry_date}
        onChange={handleChange}
        type="date"
        className="w-full border rounded-lg px-4 py-2"
      />

      {/* Submit */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Save Medicine
      </button>
    </form>
  );
}