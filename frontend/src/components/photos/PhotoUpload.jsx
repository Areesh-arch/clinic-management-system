import UploadButton from "./UploadButton";

export default function PhotoUpload({
  title,
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-semibold mb-4">
        {title}
      </h2>

      <div className="border-2 border-dashed rounded-xl h-56 flex flex-col items-center justify-center gap-4">

        <p className="text-gray-500">
          No image selected
        </p>

        <UploadButton
          text="Choose Image"
        />

      </div>

    </div>
  );
}