export default function PhotoNotes() {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-semibold mb-4">
        Doctor Notes
      </h2>

      <textarea
        rows="6"
        placeholder="Write treatment observations here..."
        className="w-full border rounded-xl p-4 resize-none"
      />

    </div>
  );
}