import React from "react";
import { ArrowDownOnSquareIcon } from "@heroicons/react/24/solid";

const PassForm = () => {
  return (
    <div className="flex-1">
      <h2 className="text-lg md:text-3xl font-bold text-center text-gray-800 mb-6 md:mb-8 font-cinzel">
        RESET ACCOUNT PASSWORD
      </h2>

      <div className="pr-2 md:pr-4">
        <form className="space-y-4 md:space-y-6">
          {/* Old Password */}
          <div>
          
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              placeholder="Old Password"
              className="input-field w-full"
            />
          </div>

          {/* New Password */}
          <div>
            
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="New Password"
              className="input-field w-full"
            />
          </div>

          {/* Confirm New Password */}
          <div>
           
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="New Confirm Password"
              className="input-field w-full"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center pt-3 md:pt-4">
            <button type="submit" className="btn-save" id="firstPageButton">
              <span className="inline-flex items-center justify-center gap-2 leading-none align-middle">
                <ArrowDownOnSquareIcon
                  className="h-4 w-4 md:h-5 md:w-5 block"
                  aria-hidden="true"
                />
                <span className="font-semibold text-sm md:text-base">Change Password Now</span>
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
            padding: 24px 0;
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
  );
};

export default PassForm;
