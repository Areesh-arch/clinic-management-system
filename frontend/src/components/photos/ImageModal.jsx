export default function ImageModal({
  onClose,
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

      <div className="bg-white rounded-xl p-6 w-[700px]">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-2xl font-bold">
            Image Preview
          </h2>

          <button
            onClick={onClose}
            className="text-2xl"
          >
            ×
          </button>

        </div>

        <div className="h-[450px] bg-gray-200 rounded-xl flex items-center justify-center">

          <span className="text-gray-500 text-lg">
            Full Size Image
          </span>

        </div>

      </div>

    </div>
  );
}