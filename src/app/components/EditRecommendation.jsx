import { ArrowDownOnSquareIcon } from '@heroicons/react/16/solid'
import React from 'react'

const EditRecommendation = () => {
  return (
    <div className="flex-1">
    <h2 className="text-lg md:text-2xl font-bold text-center text-gray-800 mb-6 md:mb-8 font-cinzel">
    Edit this Recommendation
    </h2>

    <div className="pr-2 md:pr-4">
      <form className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="first_name"
            placeholder="Nuno Martins"
            className="input-field w-full md:col-span-2"
          />
        </div>
        {/* From The Diary Of */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="first_name"
            placeholder="No-Need"
            className="input-field w-full md:col-span-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="first_name"
            placeholder="Linkedin Reference URL"
            className="input-field w-full md:col-span-2"
          />
        </div>

        {/* Submit Button - Made button responsive */}
        <div className="justify-start pt-3 md:pt-4">
          <h2 className="text-lg font-semibold capitalize">Write Recommendation</h2>

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
  </div>  )
}

export default EditRecommendation