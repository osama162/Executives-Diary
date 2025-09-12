"use client"
import Image from "next/image"
import PassForm from "../../../components/PassForm"

const ChangePassword = () => {
  return (
    // Outer canvas - Made responsive for mobile screens
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
      <div className="bg-white relative z-10 mt-4h-full flex justify-center items-center">
        <div className="w-full px-4 md:px-10 py-6 md:py-10">
          <PassForm />
        </div>
      </div>

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
  )
}

export default ChangePassword
