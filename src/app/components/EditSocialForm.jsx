"use client";

import { ArrowDownOnSquareIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useMemo, useState } from "react";

const EditSocialForm = ({ executiveId, API_BASE, token, authHeadersJSON }) => {
  const [initial, setInitial] = useState(null);
  const [saving, setSaving] = useState(false);

  // form state
  const [name, setName] = useState("");          // maps to diary_title
  const [gmail, setGmail] = useState("");        // user_email (readOnly by default)
  const [website, setWebsite] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");

  const fetchExec = async () => {
    if (!executiveId || !token) return;
    try {
      const res = await fetch(`${API_BASE}/api/executives/${executiveId}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to load executive");
      const d = json?.data ?? json;
      setInitial(d);

      setName(d?.diary_title || `${d?.user_first_name ?? ""} ${d?.user_last_name ?? ""}`.trim());
      setGmail(d?.user_email || "");
      setWebsite(d?.website || "");
      setLinkedin(d?.linkedin || "");
      setTwitter(d?.twitter || "");
      setFacebook(d?.facebook || "");
      setInstagram(d?.instagram || "");
      setYoutube(d?.youtube || "");
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchExec(); }, [executiveId, token, API_BASE]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!executiveId) return;

    // only send changed fields
    const patch = {};
    if (name !== (initial?.diary_title || "")) patch.diary_title = name;
    // If your API allows email update, uncomment:
    // if (gmail !== (initial?.user_email || "")) patch.user_email = gmail;
    if (website !== (initial?.website || "")) patch.website = website;
    if (linkedin !== (initial?.linkedin || "")) patch.linkedin = linkedin;
    if (twitter !== (initial?.twitter || "")) patch.twitter = twitter;
    if (facebook !== (initial?.facebook || "")) patch.facebook = facebook;
    if (instagram !== (initial?.instagram || "")) patch.instagram = instagram;
    if (youtube !== (initial?.youtube || "")) patch.youtube = youtube;

    if (Object.keys(patch).length === 0) return;

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/executives/${executiveId}/`, {
        method: "PATCH",
        headers: authHeadersJSON,
        body: JSON.stringify(patch),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Update failed");
      setInitial(json?.data ?? json);
    } catch (err) {
      alert(err.message || "Update failed");
    } finally {
      setSaving(false);
      // refetch so the left side updates
      fetchExec();
    }
  };

  return (
    <div className="flex-1">
      <h2 className="text-lg md:text-2xl font-bold text-center text-gray-800 mb-6 md:mb-8 font-cinzel">
        Edit Account Information
      </h2>

      <div className="pr-2 md:pr-4">
        <form className="space-y-4 md:space-y-6" onSubmit={onSubmit}>
          {/* From The Diary Of */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Name"
              className="input-field w-full md:col-span-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Gmail (read-only by default) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="gmail"
              placeholder="Gmail"
              className="input-field w-full md:col-span-2"
              value={gmail}
              onChange={(e) => setGmail(e.target.value)}
              readOnly
            />
          </div>

          <h2 className="text-lg md:text-2xl font-bold text-center text-gray-800 mb-6 md:mb-8 font-cinzel">
            Edit Social Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="website_url"
              placeholder="Website URL"
              className="input-field w-full md:col-span-2"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="linkedin_url"
              placeholder="Linkdin URL"
              className="input-field w-full md:col-span-2"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="twitter_url"
              placeholder="Twitter URL/Username"
              className="input-field w-full md:col-span-2"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="facebook_url"
              placeholder="Facebook URL"
              className="input-field w-full md:col-span-2"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="instagram_url"
              placeholder="Instagram URL"
              className="input-field w-full md:col-span-2"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="youtube_url"
              placeholder="Youtube URL"
              className="input-field w-full md:col-span-2"
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="text-center pt-3 md:pt-4">
            <button type="submit" className="btn-save" id="firstPageButton" disabled={saving}>
              <span className="inline-flex items-center justify-center gap-2 leading-none align-middle">
                <ArrowDownOnSquareIcon
                  className="h-4 w-4 md:h-5 md:w-5 block"
                  aria-hidden="true"
                />
                <span className="font-semibold text-sm md:text-base">
                  {saving ? "Saving…" : "Save"}
                </span>
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Custom Styles (unchanged visual) */}
      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 10px 0;
          border: none;
          border-bottom: 2px solid #9ca3af;
          background: transparent;
          outline: none;
          font-size: 14px;
          transition: border-color 0.2s ease;
        }
        @media (min-width: 768px) {
          .input-field { padding: 12px 0; }
        }
        .input-field:focus { border-color: #10b981; }
        .input-field::placeholder { color: #9ca3af; font-size: 1.05rem; }

        .btn-save {
          background-color: #2d3a6b;
          color: white;
          padding: 8px 24px;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        @media (min-width: 768px) {
          .btn-save { padding: 10px 32px; font-size: 18px; }
        }
        .btn-save:hover { background-color: #10b981; }
      `}</style>
    </div>
  );
};

export default EditSocialForm;
