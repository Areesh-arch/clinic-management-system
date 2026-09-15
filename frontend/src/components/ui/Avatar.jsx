function Avatar({
  image,
  name = "Owner",
  size = "md",
}) {
  const initials =
    name
      ?.trim()
      ?.split(/\s+/)
      ?.map((word) => word[0])
      ?.join("")
      ?.slice(0, 2)
      ?.toUpperCase() || "O";

  const sizeClass =
    size === "lg"
      ? "w-24 h-24 text-2xl"
      : "w-11 h-11 text-sm";

  return (
    <div
      className={`${sizeClass} shrink-0 overflow-hidden rounded-full border-2 border-[#A58B52] bg-[#173B32] flex items-center justify-center text-[#F7F3E9] font-semibold`}
    >
      {image ? (
        <img
          src={image}
          alt={`${name} profile`}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

export default Avatar;