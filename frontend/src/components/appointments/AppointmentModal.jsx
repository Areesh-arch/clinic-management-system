function AppointmentModal({
  open,
  onClose,
  children,
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-[#173B56]/35
        px-4
        py-6
        backdrop-blur-sm
      "
      onMouseDown={onClose}
    >

      <div
        className="
          relative
          flex
          max-h-[92vh]
          w-full
          max-w-4xl
          flex-col
          overflow-hidden
          rounded-[28px]
          border
          border-white/70
          bg-[#FBFCFA]
          shadow-2xl
        "
        onMouseDown={(event) => event.stopPropagation()}
      >

        {/* Top accent */}

        <div className="h-1.5 shrink-0 bg-[#789078]" />

        {/* Close button */}

        <button
          type="button"
          onClick={onClose}
          className="
            absolute
            right-5
            top-5
            z-20
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-white
            text-slate-400
            shadow-sm
            transition
            hover:bg-slate-100
            hover:text-[#294C60]
          "
          aria-label="Close modal"
        >
          <span className="text-2xl leading-none">
            ×
          </span>
        </button>

        {/* Scrollable content */}

        <div
          className="
            overflow-y-auto
            px-6
            py-7
            sm:px-8
            sm:py-8
            lg:px-10
            lg:py-9
          "
        >
          {children}
        </div>

      </div>

    </div>
  );
}

export default AppointmentModal;