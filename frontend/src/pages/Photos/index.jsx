import { useState } from "react";

import Layout from "../../components/layout/Layout";

import PhotoHeader from "../../components/photos/PhotoHeader";
import TreatmentInfo from "../../components/photos/TreatmentInfo";
import PhotoUpload from "../../components/photos/PhotoUpload";
import PhotoNotes from "../../components/photos/PhotoNotes";
import BeforeAfterGallery from "../../components/photos/BeforeAfterGallery";
import SavePhotosButton from "../../components/photos/SavePhotosButton";

import {
  uploadTreatmentPhoto,
} from "../../services/treatmentPhotoService";

export default function Photos() {
  const [visitId, setVisitId] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [uploadingType, setUploadingType] =
    useState(null);

  const [photos, setPhotos] =
    useState([]);

  // =====================================================
  // UPLOAD PHOTO
  // =====================================================

  const handleAddPhoto = async ({
    photoType,
    image,
    caption,
  }) => {
    if (!visitId) {
      alert(
        "Please select a visit before uploading photos."
      );

      return;
    }

    try {
      setUploadingType(photoType);

      const uploadedPhoto =
        await uploadTreatmentPhoto({
          visitId,
          photoType,
          image,
          caption,
        });

      console.log(
        "Photo uploaded successfully:",
        uploadedPhoto
      );

      setPhotos((previous) => [
        ...previous,
        uploadedPhoto,
      ]);

      alert(
        "Treatment photo uploaded successfully."
      );
    } catch (error) {
      console.error(
        "Treatment photo upload failed:",
        error
      );

      alert(
        error.message ||
          "Failed to upload treatment photo."
      );

      throw error;
    } finally {
      setUploadingType(null);
    }
  };

  // =====================================================
  // SAVE PHOTOS
  // =====================================================

  const handleSavePhotos = () => {
    console.log(
      "Photos:",
      photos
    );

    console.log(
      "Notes:",
      notes
    );

    alert(
      "Photos are already uploaded. Notes can be saved with the visit."
    );
  };

  return (
    <Layout>
      <div className="space-y-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <PhotoHeader />

        {/* =================================================
            TREATMENT INFORMATION
        ================================================= */}

        <TreatmentInfo
          visitId={visitId}
          setVisitId={setVisitId}
        />

        {/* =================================================
            BEFORE / AFTER UPLOAD
        ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            gap-8
            lg:grid-cols-2
          "
        >
          <PhotoUpload
            title="Before Treatment"
            photoType="before"
            onAddPhoto={handleAddPhoto}
            loading={
              uploadingType === "before"
            }
          />

          <PhotoUpload
            title="After Treatment"
            photoType="after"
            onAddPhoto={handleAddPhoto}
            loading={
              uploadingType === "after"
            }
          />
        </div>

        {/* =================================================
            NOTES
        ================================================= */}

        <PhotoNotes
          notes={notes}
          onChange={setNotes}
        />

        {/* =================================================
            GALLERY
        ================================================= */}

        <BeforeAfterGallery
          photos={photos}
        />

        {/* =================================================
            SAVE
        ================================================= */}

        <div className="flex justify-end">
          <SavePhotosButton
            onSave={handleSavePhotos}
            disabled={photos.length === 0}
          />
        </div>

      </div>
    </Layout>
  );
}