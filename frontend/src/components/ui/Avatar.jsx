function Avatar({ image }) {
  return (
    <img
      src={image}
      alt="avatar"
      className="w-11 h-11 rounded-full border-2 border-[#7A9E7E]"
    />
  );
}

export default Avatar;