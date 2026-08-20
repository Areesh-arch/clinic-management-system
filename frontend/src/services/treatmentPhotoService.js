import { apiRequest } from "./api";


// =========================================================
// GET ALL TREATMENT PHOTOS
// =========================================================

export async function getTreatmentPhotos() {

  return apiRequest(
    "/treatment-photos/"
  );
}


// =========================================================
// GET SINGLE PHOTO
// =========================================================

export async function getTreatmentPhoto(
  photoId
) {

  return apiRequest(
    `/treatment-photos/${photoId}`
  );
}


// =========================================================
// UPLOAD TREATMENT PHOTO
// =========================================================

export async function uploadTreatmentPhoto({
  visitId,
  photoType,
  image,
  caption,
}) {

  const formData =
    new FormData();

  formData.append(
    "visit_id",
    String(visitId)
  );

  formData.append(
    "photo_type",
    photoType
  );

  if (caption) {

    formData.append(
      "caption",
      caption
    );
  }

  formData.append(
    "image",
    image
  );


  return apiRequest(
    "/treatment-photos/upload",
    {
      method: "POST",
      body: formData,
    }
  );
}


// =========================================================
// UPDATE PHOTO
// =========================================================

export async function updateTreatmentPhoto(
  photoId,
  data
) {

  return apiRequest(
    `/treatment-photos/${photoId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}


// =========================================================
// DELETE PHOTO
// =========================================================

export async function deleteTreatmentPhoto(
  photoId
) {

  return apiRequest(
    `/treatment-photos/${photoId}`,
    {
      method: "DELETE",
    }
  );
}