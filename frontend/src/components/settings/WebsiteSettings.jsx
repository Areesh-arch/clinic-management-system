import { useEffect, useState } from "react";
import {
  FiGlobe,
  FiHome,
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiMessageCircle,
  FiMap,
  FiSave,
  FiRotateCcw,
} from "react-icons/fi";
import cmsService from "../../services/cmsService";

const EMPTY_SETTINGS = {
  homepage_eyebrow: "",
  homepage_title: "",
  homepage_description: "",
  homepage_image_url: "",

  clinic_name: "",
  phone: "",
  email: "",
  address: "",
  whatsapp: "",
  opening_hours: "",
  map_url: "",
};

function WebsiteSettings() {
  const [settings, setSettings] = useState(EMPTY_SETTINGS);

  const [loading, setLoading] = useState(true);

  const [savingHomepage, setSavingHomepage] = useState(false);
  const [savingContact, setSavingContact] = useState(false);

  const [homepageMessage, setHomepageMessage] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const [homepageError, setHomepageError] = useState("");
  const [contactError, setContactError] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setHomepageError("");
      setContactError("");

      const data = await cmsService.getSiteSettings();

      setSettings({
        homepage_eyebrow: data?.homepage_eyebrow || "",
        homepage_title: data?.homepage_title || "",
        homepage_description: data?.homepage_description || "",
        homepage_image_url: data?.homepage_image_url || "",

        clinic_name: data?.clinic_name || "",
        phone: data?.phone || "",
        email: data?.email || "",
        address: data?.address || "",
        whatsapp: data?.whatsapp || "",
        opening_hours: data?.opening_hours || "",
        map_url: data?.map_url || "",
      });
    } catch (err) {
      const message = err?.message || "";

      if (!message.toLowerCase().includes("not found")) {
        console.error("Failed to load website settings:", err);

        setHomepageError(
          message || "Failed to load website settings."
        );

        setContactError(
          message || "Failed to load website settings."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const cleanValue = (value) => {
    const trimmed = value?.trim?.() || "";
    return trimmed === "" ? null : trimmed;
  };

  const handleSaveHomepage = async () => {
    try {
      setSavingHomepage(true);
      setHomepageMessage("");
      setHomepageError("");

      const homepagePayload = {
        homepage_eyebrow: cleanValue(settings.homepage_eyebrow),
        homepage_title: cleanValue(settings.homepage_title),
        homepage_description: cleanValue(settings.homepage_description),
        homepage_image_url: cleanValue(settings.homepage_image_url),
      };

      const savedSettings =
        await cmsService.updateSiteSettings(homepagePayload);

      setSettings((previous) => ({
        ...previous,
        homepage_eyebrow: savedSettings?.homepage_eyebrow || "",
        homepage_title: savedSettings?.homepage_title || "",
        homepage_description:
          savedSettings?.homepage_description || "",
        homepage_image_url:
          savedSettings?.homepage_image_url || "",
      }));

      setHomepageMessage(
        "Homepage changes saved successfully."
      );
    } catch (err) {
      console.error("Failed to save homepage settings:", err);

      setHomepageError(
        err?.message || "Failed to save homepage changes."
      );
    } finally {
      setSavingHomepage(false);
    }
  };

  const handleSaveContact = async () => {
    try {
      setSavingContact(true);
      setContactMessage("");
      setContactError("");

      const contactPayload = {
        clinic_name: cleanValue(settings.clinic_name),
        phone: cleanValue(settings.phone),
        email: cleanValue(settings.email),
        address: cleanValue(settings.address),
        whatsapp: cleanValue(settings.whatsapp),
        opening_hours: cleanValue(settings.opening_hours),
        map_url: cleanValue(settings.map_url),
      };

      const savedSettings =
        await cmsService.updateSiteSettings(contactPayload);

      setSettings((previous) => ({
        ...previous,
        clinic_name: savedSettings?.clinic_name || "",
        phone: savedSettings?.phone || "",
        email: savedSettings?.email || "",
        address: savedSettings?.address || "",
        whatsapp: savedSettings?.whatsapp || "",
        opening_hours: savedSettings?.opening_hours || "",
        map_url: savedSettings?.map_url || "",
      }));

      setContactMessage(
        "Contact information saved successfully."
      );
    } catch (err) {
      console.error(
        "Failed to save contact information:",
        err
      );

      setContactError(
        err?.message ||
          "Failed to save contact information."
      );
    } finally {
      setSavingContact(false);
    }
  };

  const handleReset = async () => {
    await loadSettings();
    setHomepageMessage("");
    setContactMessage("");
  };

  if (loading) {
    return (
      <section className="rounded-2xl border border-[#D8C99B] bg-[#FBF8F0] p-6 shadow-[0_8px_30px_rgba(38,70,55,0.06)]">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-xl bg-[#DDE6D8]" />

          <div className="space-y-2">
            <div className="h-5 w-48 animate-pulse rounded bg-[#E5E1D5]" />
            <div className="h-3 w-72 animate-pulse rounded bg-[#E5E1D5]" />
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="h-12 animate-pulse rounded-xl bg-[#F0ECE1]" />
          <div className="h-12 animate-pulse rounded-xl bg-[#F0ECE1]" />
          <div className="h-28 animate-pulse rounded-xl bg-[#F0ECE1]" />
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-8">

      {/* =====================================================
          WEBSITE SETTINGS INTRO
      ====================================================== */}
      <section className="overflow-hidden rounded-2xl border border-[#D8C99B] bg-[#FBF8F0] shadow-[0_10px_35px_rgba(38,70,55,0.07)]">

        <div className="bg-[#234D3C] px-6 py-6">
          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#D8C99B]/40 bg-[#315D4B] text-[#E5D39A]">
              <FiGlobe size={23} />
            </div>

            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[#D8C99B]">
                CLINIC WEBSITE
              </p>

              <h2 className="mt-1 text-xl font-semibold text-[#FBF8F0]">
                Website Settings
              </h2>

              <p className="mt-1 text-sm text-[#DDE6D8]">
                Manage the content displayed on your clinic's
                public website.
              </p>
            </div>

          </div>
        </div>

      </section>


      {/* =====================================================
          HOMEPAGE
      ====================================================== */}
      <section className="overflow-hidden rounded-2xl border border-[#D8C99B] bg-[#FBF8F0] shadow-[0_10px_35px_rgba(38,70,55,0.06)]">

        {/* Section Header */}
        <div className="border-b border-[#D8C99B]/60 bg-[#F5F1E7] px-6 py-5">

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DDE6D8] text-[#234D3C]">
              <FiHome size={21} />
            </div>

            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[#9B8246]">
                PUBLIC WEBSITE
              </p>

              <h3 className="mt-1 text-lg font-semibold text-[#234D3C]">
                Homepage
              </h3>

              <p className="mt-1 text-sm text-[#647267]">
                Control the main content visitors see when they
                open your clinic website.
              </p>
            </div>

          </div>

        </div>


        {/* Homepage Form */}
        <div className="space-y-6 p-6">

          {/* Eyebrow */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#234D3C]">
              Homepage Eyebrow
            </label>

            <input
              type="text"
              value={settings.homepage_eyebrow}
              onChange={(e) =>
                handleChange(
                  "homepage_eyebrow",
                  e.target.value
                )
              }
              placeholder="e.g. DERMATOLOGY & AESTHETICS"
              className="w-full rounded-xl border border-[#C9D3C5] bg-[#FFFDF8] px-4 py-3 text-sm text-[#234D3C] outline-none transition placeholder:text-[#9BA59C] focus:border-[#789681] focus:ring-2 focus:ring-[#DDE6D8]"
            />
          </div>


          {/* Main Heading */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#234D3C]">
              Main Heading
            </label>

            <input
              type="text"
              value={settings.homepage_title}
              onChange={(e) =>
                handleChange(
                  "homepage_title",
                  e.target.value
                )
              }
              placeholder="e.g. Reveal Your Most Confident Skin"
              className="w-full rounded-xl border border-[#C9D3C5] bg-[#FFFDF8] px-4 py-3 text-sm text-[#234D3C] outline-none transition placeholder:text-[#9BA59C] focus:border-[#789681] focus:ring-2 focus:ring-[#DDE6D8]"
            />
          </div>


          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#234D3C]">
              Homepage Description
            </label>

            <textarea
              rows={5}
              value={settings.homepage_description}
              onChange={(e) =>
                handleChange(
                  "homepage_description",
                  e.target.value
                )
              }
              placeholder="Write a short introduction about your clinic..."
              className="w-full resize-none rounded-xl border border-[#C9D3C5] bg-[#FFFDF8] px-4 py-3 text-sm leading-6 text-[#234D3C] outline-none transition placeholder:text-[#9BA59C] focus:border-[#789681] focus:ring-2 focus:ring-[#DDE6D8]"
            />
          </div>


          {/* Image URL */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#234D3C]">
              Homepage Image URL
            </label>

            <input
              type="url"
              value={settings.homepage_image_url}
              onChange={(e) =>
                handleChange(
                  "homepage_image_url",
                  e.target.value
                )
              }
              placeholder="https://example.com/homepage-image.jpg"
              className="w-full rounded-xl border border-[#C9D3C5] bg-[#FFFDF8] px-4 py-3 text-sm text-[#234D3C] outline-none transition placeholder:text-[#9BA59C] focus:border-[#789681] focus:ring-2 focus:ring-[#DDE6D8]"
            />

            <p className="mt-2 text-xs text-[#7A857C]">
              Enter the publicly accessible image URL used by
              the homepage.
            </p>
          </div>


          {/* Homepage Error */}
          {homepageError && (
            <div className="rounded-xl border border-[#D8A6A0] bg-[#FBF0EE] px-4 py-3 text-sm text-[#8C443C]">
              {homepageError}
            </div>
          )}


          {/* Homepage Success */}
          {homepageMessage && (
            <div className="rounded-xl border border-[#B7C9B5] bg-[#EEF4EB] px-4 py-3 text-sm text-[#315D4B]">
              {homepageMessage}
            </div>
          )}


          {/* Homepage Save */}
          <div className="flex justify-end border-t border-[#D8C99B]/50 pt-5">

            <button
              type="button"
              onClick={handleSaveHomepage}
              disabled={savingHomepage}
              className="inline-flex items-center gap-2 rounded-xl bg-[#234D3C] px-5 py-3 text-sm font-semibold text-[#FBF8F0] shadow-[0_6px_18px_rgba(35,77,60,0.18)] transition hover:bg-[#193D2F] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiSave size={17} />

              {savingHomepage
                ? "Saving Homepage..."
                : "Save Homepage Changes"}
            </button>

          </div>

        </div>
      </section>


      {/* =====================================================
          CONTACT INFORMATION
      ====================================================== */}
      <section className="overflow-hidden rounded-2xl border border-[#D8C99B] bg-[#FBF8F0] shadow-[0_10px_35px_rgba(38,70,55,0.06)]">

        {/* Contact Header */}
        <div className="border-b border-[#D8C99B]/60 bg-[#F5F1E7] px-6 py-5">

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DDE6D8] text-[#234D3C]">
              <FiPhone size={21} />
            </div>

            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[#9B8246]">
                CLINIC DETAILS
              </p>

              <h3 className="mt-1 text-lg font-semibold text-[#234D3C]">
                Contact Information
              </h3>

              <p className="mt-1 text-sm text-[#647267]">
                Manage the contact details displayed throughout
                the public website.
              </p>
            </div>

          </div>

        </div>


        {/* Contact Form */}
        <div className="space-y-6 p-6">

          {/* Clinic Name */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#234D3C]">
              <FiGlobe
                size={15}
                className="text-[#789681]"
              />
              Clinic Name
            </label>

            <input
              type="text"
              value={settings.clinic_name}
              onChange={(e) =>
                handleChange(
                  "clinic_name",
                  e.target.value
                )
              }
              placeholder="e.g. Elite Dermatology Clinic"
              className="w-full rounded-xl border border-[#C9D3C5] bg-[#FFFDF8] px-4 py-3 text-sm text-[#234D3C] outline-none transition placeholder:text-[#9BA59C] focus:border-[#789681] focus:ring-2 focus:ring-[#DDE6D8]"
            />
          </div>


          {/* Phone + Email */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#234D3C]">
                <FiPhone
                  size={15}
                  className="text-[#789681]"
                />
                Phone
              </label>

              <input
                type="text"
                value={settings.phone}
                onChange={(e) =>
                  handleChange(
                    "phone",
                    e.target.value
                  )
                }
                placeholder="+92 300 1234567"
                className="w-full rounded-xl border border-[#C9D3C5] bg-[#FFFDF8] px-4 py-3 text-sm text-[#234D3C] outline-none transition placeholder:text-[#9BA59C] focus:border-[#789681] focus:ring-2 focus:ring-[#DDE6D8]"
              />
            </div>


            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#234D3C]">
                <FiMail
                  size={15}
                  className="text-[#789681]"
                />
                Email
              </label>

              <input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  handleChange(
                    "email",
                    e.target.value
                  )
                }
                placeholder="info@clinic.com"
                className="w-full rounded-xl border border-[#C9D3C5] bg-[#FFFDF8] px-4 py-3 text-sm text-[#234D3C] outline-none transition placeholder:text-[#9BA59C] focus:border-[#789681] focus:ring-2 focus:ring-[#DDE6D8]"
              />
            </div>

          </div>


          {/* Address */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#234D3C]">
              <FiMapPin
                size={15}
                className="text-[#789681]"
              />
              Address
            </label>

            <textarea
              rows={3}
              value={settings.address}
              onChange={(e) =>
                handleChange(
                  "address",
                  e.target.value
                )
              }
              placeholder="Clinic address..."
              className="w-full resize-none rounded-xl border border-[#C9D3C5] bg-[#FFFDF8] px-4 py-3 text-sm leading-6 text-[#234D3C] outline-none transition placeholder:text-[#9BA59C] focus:border-[#789681] focus:ring-2 focus:ring-[#DDE6D8]"
            />
          </div>


          {/* WhatsApp + Opening Hours */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#234D3C]">
                <FiMessageCircle
                  size={15}
                  className="text-[#789681]"
                />
                WhatsApp
              </label>

              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) =>
                  handleChange(
                    "whatsapp",
                    e.target.value
                  )
                }
                placeholder="+92 300 1234567"
                className="w-full rounded-xl border border-[#C9D3C5] bg-[#FFFDF8] px-4 py-3 text-sm text-[#234D3C] outline-none transition placeholder:text-[#9BA59C] focus:border-[#789681] focus:ring-2 focus:ring-[#DDE6D8]"
              />
            </div>


            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#234D3C]">
                <FiClock
                  size={15}
                  className="text-[#789681]"
                />
                Opening Hours
              </label>

              <input
                type="text"
                value={settings.opening_hours}
                onChange={(e) =>
                  handleChange(
                    "opening_hours",
                    e.target.value
                  )
                }
                placeholder="Mon - Sat: 10:00 AM - 8:00 PM"
                className="w-full rounded-xl border border-[#C9D3C5] bg-[#FFFDF8] px-4 py-3 text-sm text-[#234D3C] outline-none transition placeholder:text-[#9BA59C] focus:border-[#789681] focus:ring-2 focus:ring-[#DDE6D8]"
              />
            </div>

          </div>


          {/* Google Maps */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#234D3C]">
              <FiMap
                size={15}
                className="text-[#789681]"
              />
              Google Maps URL
            </label>

            <input
              type="url"
              value={settings.map_url}
              onChange={(e) =>
                handleChange(
                  "map_url",
                  e.target.value
                )
              }
              placeholder="https://maps.google.com/..."
              className="w-full rounded-xl border border-[#C9D3C5] bg-[#FFFDF8] px-4 py-3 text-sm text-[#234D3C] outline-none transition placeholder:text-[#9BA59C] focus:border-[#789681] focus:ring-2 focus:ring-[#DDE6D8]"
            />

            <p className="mt-2 text-xs text-[#7A857C]">
              Paste the Google Maps location URL for your
              clinic.
            </p>
          </div>


          {/* Contact Error */}
          {contactError && (
            <div className="rounded-xl border border-[#D8A6A0] bg-[#FBF0EE] px-4 py-3 text-sm text-[#8C443C]">
              {contactError}
            </div>
          )}


          {/* Contact Success */}
          {contactMessage && (
            <div className="rounded-xl border border-[#B7C9B5] bg-[#EEF4EB] px-4 py-3 text-sm text-[#315D4B]">
              {contactMessage}
            </div>
          )}


          {/* Bottom Actions */}
          <div className="flex flex-col gap-4 border-t border-[#D8C99B]/50 pt-5 sm:flex-row sm:items-center sm:justify-between">

            <button
              type="button"
              onClick={handleReset}
              disabled={
                savingHomepage || savingContact
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#C9D3C5] bg-[#F5F1E7] px-4 py-3 text-sm font-medium text-[#496253] transition hover:border-[#B5C2B3] hover:bg-[#EEE9DC] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiRotateCcw size={16} />
              Reload Saved Settings
            </button>


            <button
              type="button"
              onClick={handleSaveContact}
              disabled={savingContact}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#234D3C] px-5 py-3 text-sm font-semibold text-[#FBF8F0] shadow-[0_6px_18px_rgba(35,77,60,0.18)] transition hover:bg-[#193D2F] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiSave size={17} />

              {savingContact
                ? "Saving Contact Information..."
                : "Save Contact Information"}
            </button>

          </div>

        </div>
      </section>
    </div>
  );
}

export default WebsiteSettings;