import Layout from "../../components/layout/Layout";

import PhotoHeader from "../../components/photos/PhotoHeader";
import TreatmentInfo from "../../components/photos/TreatmentInfo";
import PhotoUpload from "../../components/photos/PhotoUpload";
import PhotoNotes from "../../components/photos/PhotoNotes";
import BeforeAfterGallery from "../../components/photos/BeforeAfterGallery";
import SavePhotosButton from "../../components/photos/SavePhotosButton";

export default function Photos() {
  return (
    <Layout>

      <div className="space-y-8">

        <PhotoHeader />

        <TreatmentInfo />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <PhotoUpload title="Before Treatment" />

          <PhotoUpload title="After Treatment" />

        </div>

        <PhotoNotes />

        <BeforeAfterGallery />

        <SavePhotosButton />

      </div>

    </Layout>
  );
}