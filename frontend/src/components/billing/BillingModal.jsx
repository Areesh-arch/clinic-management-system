import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";

function BillingModal({
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-lg",
}) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-[#173B32]/55 px-4 py-6 backdrop-blur-sm sm:px-6"
      onMouseDown={handleBackdropClick}
      role="presentation"
    >
      <div
        className={`relative my-auto flex max-h-[92vh] w-full ${maxWidth} flex-col overflow-hidden rounded-2xl border bg-[#fffdf8] shadow-2xl`}
        style={{
          borderColor: "rgba(23, 59, 50, 0.14)",
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="billing-modal-title"
      >
        {/* Header */}
        <div
          className="shrink-0 border-b px-5 py-4 sm:px-6"
          style={{
            borderColor: "rgba(23, 59, 50, 0.10)",
            backgroundColor: "#fffdf8",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 pr-2">
              <h2
                id="billing-modal-title"
                className="text-lg font-bold tracking-tight sm:text-xl"
                style={{ color: "#173B32" }}
              >
                {title}
              </h2>

              {subtitle && (
                <p
                  className="mt-1 text-xs leading-5 sm:text-sm"
                  style={{ color: "#6f8f7d" }}
                >
                  {subtitle}
                </p>
              )}
            </div>

            {/* Single close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition hover:bg-[#f7f3e9]"
              style={{
                borderColor: "rgba(23, 59, 50, 0.12)",
                color: "#173B32",
              }}
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Gold accent */}
          <div
            className="mt-4 h-0.5 w-16 rounded-full"
            style={{ backgroundColor: "#b4935a" }}
          />
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default BillingModal;