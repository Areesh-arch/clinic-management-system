function DoctorSearch({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search doctor..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full lg:w-96 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#A8C5A0]"
    />
  );
}

export default DoctorSearch;