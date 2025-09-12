// components/ProfileUpdateForm.js
"use client"
import { useEffect, useState } from "react";
import { ArrowDownOnSquareIcon } from "@heroicons/react/24/solid"


export default function DiaryUpdateForm({
  initialValues,
  loading = false,
  onSubmit,
  onChange, // <-- NEW
}) {
  const [values, setValues] = useState({ diary_title: "" });

  useEffect(() => {
    if (initialValues) setValues((v) => ({ ...v, ...initialValues }));
  }, [initialValues]);

  const update = (name) => (e) => {
    const next = { ...values, [name]: e.target.value };
    setValues(next);
    onChange?.(next); // <-- emit live updates
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit?.(values);
  };

  return (
    <div className="flex-1">
      <h2 className="text-lg md:text-2xl font-bold text-center text-gray-800 mb-6 md:mb-8 font-cinzel">
        UPDATE YOUR PROFILE CARD
      </h2>

      <div className="pr-2 md:pr-4">
        <form className="space-y-4 md:space-y-6">
          {/* From The Diary Of */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="diary_title"
              placeholder="From The Diary Of"
              className="input-field w-full md:col-span-2"
              value={values.diary_title}
              onChange={update("diary_title")}
              disabled={loading}
            />
          </div>

          {/* File Upload */}
          <div>
            <input
              type="file"
              name="cover"
              className="input-field file:mr-2 md:file:mr-4 file:py-1 md:file:py-2 file:px-2 md:file:px-4 file:rounded file:border-0 file:text-xs md:file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              accept="image/jpeg,image/png"
            />
            <p id="avatar-help" className="mt-2 text-xs md:text-sm text-red-600">
              * JPEG and PNG only
            </p>
          </div>

          {/* Submit Button - Made button responsive */}
          <div className="text-center pt-3 md:pt-4">
            <button type="submit" className="btn-save" disabled={loading}>
              <ArrowDownOnSquareIcon className="h-4 w-4 md:h-5 md:w-5" />
              <span className="font-semibold text-sm md:text-base ml-2">
                {loading ? "Saving..." : "Save"}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Custom Styles - Added responsive button sizing */}
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
          .input-field {
            padding: 12px 0;
          }
        }

        .input-field:focus {
          border-color: #10b981;
        }

        .input-field::placeholder {
          color: #9ca3af;
          font-size: 14px;
          font-size: 1.05rem;
        }

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
          .btn-save {
            padding: 10px 32px;
            font-size: 18px;
          }
        }

        .btn-save:hover {
          background-color: #10b981;
        }

        .btn-save i {
          margin-right: 8px;
        }
      `}</style>
    </div>
  )
}

