export default function ProfileSettings({
  profile,
  setProfile,
}) {
  const handleChange = (field, value) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  return (
    <div className="rounded-2xl border border-[#ded5c3] bg-[#fffdf7] p-6 shadow-sm">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dfeadd] text-[#23483a]">
            🏥
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#23483a]">
              Clinic Information
            </h2>

            <p className="mt-1 text-sm text-[#7c837b]">
              Manage your clinic and administrator information.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        {/* Clinic Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#385448]">
            Clinic Name
          </label>

          <input
            type="text"
            value={profile.clinicName}
            onChange={(e) =>
              handleChange(
                "clinicName",
                e.target.value
              )
            }
            placeholder="Clinic Name"
            className="w-full rounded-xl border border-[#d8cdb5] bg-[#fffefb] px-4 py-3 text-[#23483a] outline-none transition placeholder:text-[#a29c8f] focus:border-[#78977d] focus:ring-2 focus:ring-[#dfeadd]"
          />
        </div>

        {/* Administrator */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#385448]">
            Administrator
          </label>

          <input
            type="text"
            value={profile.administrator}
            onChange={(e) =>
              handleChange(
                "administrator",
                e.target.value
              )
            }
            placeholder="Administrator Name"
            className="w-full rounded-xl border border-[#d8cdb5] bg-[#fffefb] px-4 py-3 text-[#23483a] outline-none transition placeholder:text-[#a29c8f] focus:border-[#78977d] focus:ring-2 focus:ring-[#dfeadd]"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#385448]">
            Email Address
          </label>

          <input
            type="email"
            value={profile.email}
            onChange={(e) =>
              handleChange(
                "email",
                e.target.value
              )
            }
            placeholder="admin@clinic.com"
            className="w-full rounded-xl border border-[#d8cdb5] bg-[#fffefb] px-4 py-3 text-[#23483a] outline-none transition placeholder:text-[#a29c8f] focus:border-[#78977d] focus:ring-2 focus:ring-[#dfeadd]"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#385448]">
            Phone Number
          </label>

          <input
            type="text"
            value={profile.phone}
            onChange={(e) =>
              handleChange(
                "phone",
                e.target.value
              )
            }
            placeholder="+92 300 1234567"
            className="w-full rounded-xl border border-[#d8cdb5] bg-[#fffefb] px-4 py-3 text-[#23483a] outline-none transition placeholder:text-[#a29c8f] focus:border-[#78977d] focus:ring-2 focus:ring-[#dfeadd]"
          />
        </div>

      </div>
    </div>
  );
}