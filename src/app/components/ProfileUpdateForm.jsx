"use client";
import { useEffect, useState } from "react";
import { ArrowDownOnSquareIcon } from "@heroicons/react/24/solid";

export default function ProfileUpdateForm({
  initialValues,
  loading = false,
  onSubmit,
  onChange,                    // <-- NEW
  avatarUrl,
  maxImgMB = 5,
  acceptTypes = ["image/png", "image/jpeg", "image/webp"],
}) {
  const [values, setValues] = useState({
    first_name: "", last_name: "", industry: "",
    job_title: "", company: "", about: "",
    country: "", state: "", city: "",
    website: "", linkedin: "", twitter: "",
    facebook: "", instagram: "", youtube: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(avatarUrl || "");

  useEffect(() => {
    if (!initialValues) return;
    setValues(v => ({ ...v, ...initialValues }));
  }, [initialValues]);

  useEffect(() => { setAvatarPreview(avatarUrl || ""); }, [avatarUrl]);

  useEffect(() => {
    return () => { if (avatarPreview?.startsWith("blob:")) URL.revokeObjectURL(avatarPreview); };
  }, [avatarPreview]);

  const disabled = loading;

  const emit = (next, meta) => {
    setValues(next);
    onChange?.(next, meta);   // <-- tell parent for live preview
  };

  const update = (name) => (e) => {
    const next = { ...values, [name]: e.target.value };
    emit(next);
  };

  const onPickAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!acceptTypes.includes(file.type)) { alert(`Please choose an image (${acceptTypes.join(", ")})`); return; }
    if (file.size > maxImgMB * 1024 * 1024) { alert(`Image must be <= ${maxImgMB}MB`); return; }
    const url = URL.createObjectURL(file);
    setAvatarFile(file);
    setAvatarPreview(url);
    emit(values, { avatarPreviewUrl: url }); // <-- live preview image
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit?.(values, { avatarFile });
  };

  return (
    <div className="flex-1">
      <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-4 md:mb-8 font-cinzel">
        UPDATE YOUR PROFILE CARD
      </h2>

      <div className="max-h-80 md:max-h-96 overflow-y-auto pr-2 md:pr-4 custom-scrollbar">
        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>  

          {/* Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="first_name" placeholder="First Name" className="input-field"
              value={values.first_name} onChange={update("first_name")} disabled={disabled} />
            <input name="last_name" placeholder="Last Name" className="input-field"
              value={values.last_name} onChange={update("last_name")} disabled={disabled} />
          </div>

          {/* Industry */}
          <input name="industry" placeholder="Industry" className="input-field"
            value={values.industry} onChange={update("industry")} disabled={disabled} />

          {/* Job / Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="job_title" placeholder="Job Title" className="input-field"
              value={values.job_title} onChange={update("job_title")} disabled={disabled} />
            <input name="company" placeholder="Company" className="input-field"
              value={values.company} onChange={update("company")} disabled={disabled} />
          </div>

          {/* About */}
          <div>
            <label className="block text-gray-600 text-sm mb-2 font-medium">About</label>
            <textarea name="about" rows={5} placeholder="Enter about executive"
              className="input-field resize-none placeholder-gray-400"
              value={values.about} onChange={update("about")} disabled={disabled} />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="country" placeholder="Country" className="input-field"
              value={values.country} onChange={update("country")} disabled={disabled} />
            <input name="state" placeholder="State" className="input-field"
              value={values.state} onChange={update("state")} disabled={disabled} />
            <input name="city" placeholder="City" className="input-field"
              value={values.city} onChange={update("city")} disabled={disabled} />
          </div>

          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full overflow-hidden ring-2 ring-gray-200 bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={avatarPreview || "/images/avatar-fallback.png"} alt="Avatar preview" className="h-full w-full object-cover" />
            </div>
            <input type="file" name="avatar" accept={acceptTypes.join(",")} onChange={onPickAvatar} disabled={disabled}
              className="input-field file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
          </div>
          <div className="text-center pt-2 md:pt-4">
            <button type="submit" className="btn-save" disabled={disabled}>
              <span className="inline-flex items-center justify-center gap-2 leading-none align-middle">
                <ArrowDownOnSquareIcon className="h-4 w-4 md:h-5 md:w-5 block" aria-hidden="true" />
                <span className="font-semibold text-sm md:text-base">{loading ? "Saving..." : "Save"}</span>
              </span>
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .input-field{width:100%;padding:12px 0;border:none;border-bottom:2px solid #9ca3af;background:transparent;outline:none;font-size:14px;transition:border-color .2s}
        .input-field:focus{border-color:#10b981}.input-field::placeholder{color:#6b7280;font-size:14px}
        .btn-save{background-color:#2d3a6b;color:#fff;padding:8px 24px;border:none;cursor:pointer;transition:background-color .2s;display:inline-flex;align-items:center;justify-content:center;font-size:16px}
        @media(min-width:768px){.btn-save{padding:10px 32px;font-size:18px}}
        button:disabled{opacity:.6;cursor:not-allowed}
      `}</style>
    </div>
  );
}
