import PhotoCard from "./PhotoCard";

export default function BeforeAfterGallery() {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-2xl font-semibold mb-6">
        Treatment Gallery
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <PhotoCard title="Before Treatment" />

        <PhotoCard title="After Treatment" />

      </div>

    </div>
  );
}