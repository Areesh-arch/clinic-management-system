import { useRef, useState } from "react";
import {
  FiUpload,
  FiTrash2,
} from "react-icons/fi";

function ResultForm({ onSave, onCancel }) {
  const beforeInputRef = useRef(null);
  const afterInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    beforeImage: null,
    afterImage: null,
    published: true,
  });

  const handleImageChange = (event, type) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must not exceed 10 MB.");
      return;
    }

    const preview = URL.createObjectURL(file);

    setForm((previous) => ({
      ...previous,
      [type]: {
        file,
        preview,
      },
    }));

    event.target.value = "";
  };

  const removeImage = (type) => {
    const image = form[type];

    if (image?.preview) {
      URL.revokeObjectURL(image.preview);
    }

    setForm((previous) => ({
      ...previous,
      [type]: null,
    }));
  };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      alert("Please enter a treatment name.");
      return;
    }

    if (!form.beforeImage) {
      alert("Please upload the before image.");
      return;
    }

    if (!form.afterImage) {
      alert("Please upload the after image.");
      return;
    }

    onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      beforeImage: form.beforeImage.preview,
      afterImage: form.afterImage.preview,
      beforeFile: form.beforeImage.file,
      afterFile: form.afterImage.file,
      published: form.published,
    });
  };

  return (
    <div className="cms-result-form">
      <div className="cms-result-form-header">
        <div>
          <span className="cms-editor-eyebrow">
            NEW RESULT
          </span>

          <h3>Add Before & After Result</h3>
        </div>

        <button
          type="button"
          className="cms-close-button"
          onClick={onCancel}
        >
          ×
        </button>
      </div>

      <div className="cms-field">
        <label>Treatment Name</label>

        <input
          type="text"
          value={form.title}
          onChange={(event) =>
            setForm((previous) => ({
              ...previous,
              title: event.target.value,
            }))
          }
          placeholder="e.g. Acne Treatment"
        />
      </div>

      <div className="cms-field">
        <label>Description</label>

        <textarea
          value={form.description}
          onChange={(event) =>
            setForm((previous) => ({
              ...previous,
              description: event.target.value,
            }))
          }
          placeholder="Describe the treatment result..."
          rows={5}
        />
      </div>

      <div className="cms-image-grid">
        <ImageUploader
          label="Before Image"
          description="Patient condition before treatment"
          value={form.beforeImage}
          inputRef={beforeInputRef}
          onUpload={(event) =>
            handleImageChange(event, "beforeImage")
          }
          onRemove={() =>
            removeImage("beforeImage")
          }
        />

        <ImageUploader
          label="After Image"
          description="Patient result after treatment"
          value={form.afterImage}
          inputRef={afterInputRef}
          onUpload={(event) =>
            handleImageChange(event, "afterImage")
          }
          onRemove={() =>
            removeImage("afterImage")
          }
        />
      </div>

      <label className="cms-publish-toggle">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(event) =>
            setForm((previous) => ({
              ...previous,
              published: event.target.checked,
            }))
          }
        />

        <span>
          <strong>Publish on website</strong>

          <small>
            When enabled, this result will be visible on the
            public website.
          </small>
        </span>
      </label>

      <div className="cms-form-actions">
        <button
          type="button"
          className="cms-secondary-button"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          type="button"
          className="cms-primary-button"
          onClick={handleSubmit}
        >
          Save Result
        </button>
      </div>
    </div>
  );
}

function ImageUploader({
  label,
  description,
  value,
  inputRef,
  onUpload,
  onRemove,
}) {
  return (
    <div className="cms-image-upload">
      <div className="cms-image-upload-header">
        <div>
          <strong>{label}</strong>

          <span>{description}</span>
        </div>
      </div>

      {value ? (
        <div className="cms-image-preview">
          <img
            src={value.preview}
            alt={label}
          />

          <button
            type="button"
            className="cms-image-remove"
            onClick={onRemove}
          >
            <FiTrash2 />
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="cms-upload-box"
          onClick={() => inputRef.current?.click()}
        >
          <FiUpload />

          <strong>Upload {label}</strong>

          <span>
            JPG, PNG or WEBP · Max 10 MB
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={onUpload}
      />
    </div>
  );
}

export default ResultForm;