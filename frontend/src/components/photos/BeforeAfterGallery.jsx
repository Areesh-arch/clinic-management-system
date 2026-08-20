import PhotoCard from "./PhotoCard";

export default function BeforeAfterGallery({
  photos = [],
  onDelete,
  onEdit,
}) {
  const beforePhotos = photos.filter(
    (photo) =>
      photo.photo_type?.toLowerCase() === "before"
  );

  const afterPhotos = photos.filter(
    (photo) =>
      photo.photo_type?.toLowerCase() === "after"
  );

  return (
    <div className="rounded-xl bg-white p-6 shadow">

      <h2 className="mb-2 text-2xl font-semibold text-gray-900">
        Treatment Gallery
      </h2>

      <p className="mb-6 text-sm text-gray-500">
        Before and after treatment photos for the selected visit.
      </p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

        {/* BEFORE */}

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Before Treatment
            </h3>

            <span className="text-sm text-gray-500">
              {beforePhotos.length} photo
              {beforePhotos.length !== 1 ? "s" : ""}
            </span>
          </div>

          {beforePhotos.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
              No before-treatment photos.
            </div>
          ) : (
            <div className="grid gap-4">
              {beforePhotos.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </div>
          )}
        </div>

        {/* AFTER */}

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              After Treatment
            </h3>

            <span className="text-sm text-gray-500">
              {afterPhotos.length} photo
              {afterPhotos.length !== 1 ? "s" : ""}
            </span>
          </div>

          {afterPhotos.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
              No after-treatment photos.
            </div>
          ) : (
            <div className="grid gap-4">
              {afterPhotos.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}