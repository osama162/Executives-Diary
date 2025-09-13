import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NavigationButtons() {
  const router = useRouter();
  return (
    <div className="flex justify-center gap-4 mb-2 mt-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 bg-[#28d7a2] text-white px-[12px] py-[6px] rounded-lg hover:bg-[#17b894] transition-colors duration-200 font-medium cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        Back
      </button>
      <Link
        href="/"
        className="flex items-center gap-2 bg-[#1dd1a1] text-white px-[12px] py-[6px]    rounded-lg hover:bg-[#17b894] transition-colors duration-200 font-medium"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
        Home
      </Link>
    </div>
  );
}
