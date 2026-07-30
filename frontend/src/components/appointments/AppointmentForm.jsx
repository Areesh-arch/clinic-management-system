function AppointmentForm() {
  return (
    <div>

      <h2 className="text-3xl font-bold text-[#556B55] mb-8">
        New Appointment
      </h2>

      <div className="grid md:grid-cols-2 gap-5">

        <input
          className="border rounded-xl p-3"
          placeholder="Patient Name"
        />

        <input
          className="border rounded-xl p-3"
          placeholder="Doctor Name"
        />

        <input
          className="border rounded-xl p-3"
          placeholder="Treatment"
        />

        <input
          type="date"
          className="border rounded-xl p-3"
        />

        <input
          type="time"
          className="border rounded-xl p-3"
        />

        <select className="border rounded-xl p-3">

          <option>Pending</option>

          <option>Completed</option>

          <option>Cancelled</option>

        </select>

      </div>

      <button
        className="
        mt-8
        bg-[#556B55]
        text-white
        px-6
        py-3
        rounded-xl
        hover:bg-[#465946]
        transition
        "
      >
        Save Appointment
      </button>

    </div>
  );
}

export default AppointmentForm;