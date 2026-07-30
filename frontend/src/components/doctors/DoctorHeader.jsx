function DoctorHeader({ onAddDoctor }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-5">
      <div>
        <h1 className="text-3xl font-bold text-[#45524A]">
          Doctors
        </h1>

        <p className="text-[#7E867F] mt-2">
          Manage clinic doctors
        </p>
      </div>

      <button
        onClick={onAddDoctor}
        className="bg-[#A8C5A0] hover:bg-[#93B88A] text-white px-6 py-3 rounded-xl font-semibold transition"
      >
        + Add Doctor
      </button>
    </div>
  );
}

export default DoctorHeader;