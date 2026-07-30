import { useState } from "react";

export default function MedicineForm({ onSave }) {

  const [medicine, setMedicine] = useState({
    name: "",
    category: "",
    stock: "",
    price: "",
    supplier: "",
    expiry: ""
  });


  const handleChange = (e) => {
    setMedicine({
      ...medicine,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...medicine,
      id: Date.now()
    });


    setMedicine({
      name: "",
      category: "",
      stock: "",
      price: "",
      supplier: "",
      expiry: ""
    });

  };


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      <input
        name="name"
        value={medicine.name}
        onChange={handleChange}
        type="text"
        placeholder="Medicine Name"
        className="w-full border rounded-lg px-4 py-2"
      />


      <input
        name="category"
        value={medicine.category}
        onChange={handleChange}
        type="text"
        placeholder="Category"
        className="w-full border rounded-lg px-4 py-2"
      />


      <input
        name="stock"
        value={medicine.stock}
        onChange={handleChange}
        type="number"
        placeholder="Stock"
        className="w-full border rounded-lg px-4 py-2"
      />


      <input
        name="price"
        value={medicine.price}
        onChange={handleChange}
        type="number"
        placeholder="Price"
        className="w-full border rounded-lg px-4 py-2"
      />


      <input
        name="supplier"
        value={medicine.supplier}
        onChange={handleChange}
        type="text"
        placeholder="Supplier"
        className="w-full border rounded-lg px-4 py-2"
      />


      <input
        name="expiry"
        value={medicine.expiry}
        onChange={handleChange}
        type="date"
        className="w-full border rounded-lg px-4 py-2"
      />


      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Save Medicine
      </button>

    </form>
  );
}