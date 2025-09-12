// components/ProfileUpdateForm.js
"use client";
import { ArrowDownOnSquareIcon } from "@heroicons/react/24/solid";

const EditorForm = () => {
  return (
    <div className="flex-1">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8 font-cinzel">
      Editor
      </h2>

      <div className="max-h-96 overflow-y-auto pr-4 custom-scrollbar">
        <form className="space-y-6">
         
          
          <div>
           
            <textarea
              name="about"
              rows={5}
              placeholder="Write Answer"
              className="input-field resize-none placeholder-gray-400"
            />
          </div>

         
          {/* Submit Button */}
          <div className="text-center pt-4">
            <button type="submit" className="btn-save" id="firstPageButton">
              <span className="inline-flex items-center justify-center gap-2 leading-none align-middle">
                <ArrowDownOnSquareIcon
                  className="h-5 w-5 block"
                  aria-hidden="true"
                />
                <span className="font-semibold">Save</span>
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
     

        .input-field {
          width: 100%;
          padding: 12px 0;
          border: none;
          border-bottom: 2px solid #d1d5db;
          background: transparent;
          outline: none;
          font-size: 14px;
          transition: border-color 0.2s ease;
        }

        .input-field:focus {
          border-color: #10b981;
        }

        .input-field::placeholder {
          color: #9ca3af;
          font-size: 14px;
        }

        .btn-save {
          background-color: #2d3a6b;
          color: white;
          font-weight: 600;
          padding: 12px 32px;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .btn-save:hover {
          background-color: #10b981;
        }

        .btn-save i {
          margin-right: 8px;
        }
      `}</style>
    </div>
  );
};

export default EditorForm;
