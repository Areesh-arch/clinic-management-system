export default function UploadButton({
  text,
}) {
  return (
    <button
      className="bg-[#7A9E7E] hover:bg-[#6D8F72] text-white px-4 py-2 rounded-lg"
    >
      {text}
    </button>
  );
}