"use client";
import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import EditSocialForm from "../../../components/EditSocialForm";
import UpdateSocialForm from "../../../components/UpdateSocialForm";

const Setting = () => {
  const { id: executiveId } = useParams();
  const API_BASE = (process.env.NEXT_PUBLIC_API_DOMAIN || "").replace(/\/$/, "");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const authHeadersJSON = useMemo(
    () => ({ Authorization: `Token ${token}`, "Content-Type": "application/json" }),
    [token]
  );

  return (
    <div
      className="
        relative mx-auto my-4 md:my-10
        w-[95vw] max-w-[1700px]
        h-auto md:h-[640px] min-h-[600px]
        border-[#1e1c4d] border-[12px] md:border-[19px] border-x-[20px] md:border-x-[30px]
        rounded-[8px] md:rounded-[10px]
        shadow-[0_4px_16px_rgba(0,0,0,0.15)] md:shadow-[0_8px_24px_rgba(0,0,0,0.15)]
      "
    >
      {/* Inner white sheet */}
      <div
        className="
          bg-white relative z-10 h-full
          overflow-hidden
          rounded-[6px] md:rounded-[8px]
        "
      >
        {/* 3-column grid: left | divider | right */}
        <div
          className="
            grid h-full
            [grid-template-columns:minmax(0,1fr)_4px_minmax(0,1fr)]
          "
        >
          {/* Left (scrollable) */}
          <div
            className="
              flex items-start justify-center
              px-4 md:px-10 py-6 md:py-10 h-full
              overflow-y-auto
              [scrollbar-gutter:stable_both-edges]
              overscroll-contain
              custom-scrollbar
            "
          >
            <UpdateSocialForm
              executiveId={executiveId}
              API_BASE={API_BASE}
              token={token}
            />
          </div>

          {/* Divider */}
          <div className="bg-[#2d3a6b] hidden md:block" aria-hidden />

          {/* Right (scrollable) */}
          <div
            className="
              flex items-start px-4 md:px-10 py-6 md:py-10 h-full overflow-y-auto
              [scrollbar-gutter:stable_both-edges]
              overscroll-contain
              custom-scrollbar
            "
          >
            <EditSocialForm
              executiveId={executiveId}
              API_BASE={API_BASE}
              token={token}
              authHeadersJSON={authHeadersJSON}
            />
          </div>
        </div>
      </div>

      {/* Ribbon */}
      <div className="absolute -bottom-13 right-7 z-0">
        <Image
          src="/images/SHAPE.png"
          alt="ribbon"
          height={120}
          width={120}
          priority
        />
      </div>
    </div>
  );
};

export default Setting;
