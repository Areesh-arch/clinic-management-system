export default function SaveButton({
  onSave,
  saving,
}) {
  return (
    <div className="flex justify-end">

      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-xl bg-[#8a7548] px-7 py-3 font-semibold text-[#fffdf7] shadow-sm transition hover:bg-[#725f38] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving
          ? "Saving..."
          : "Save Changes"}
      </button>

    </div>
  );
}