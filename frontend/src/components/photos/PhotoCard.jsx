export default function PhotoCard({
  title,
}) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">

      <div className="h-56 bg-gray-200 flex items-center justify-center">

        <span className="text-gray-500">
          Image Preview
        </span>

      </div>

      <div className="p-4">

        <h3 className="font-semibold mb-4">
          {title}
        </h3>

        <div className="flex gap-2">

          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
            View
          </button>

          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}