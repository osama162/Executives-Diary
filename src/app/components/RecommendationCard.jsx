'use client';
import Image from 'next/image';

const RecommendationCard = ({
  name = "Nuno Martins",
  photo = "/profile.jpg",
  recommendation = `Fantastic speaker. Our audience really loved Joyce's combination of information and inspiration. Her leading-edge perspective helped us to look at current events and how they can help us plan for the future. She was able to virtually engage our international audience to the point that every person who asked a question began by complimenting her on her excellent presentation. We are looking forward to having Joyce back next year in person.`,
  designation = "Executive Director",
  organization = "Envision Humanity",
  profileUrl = "#"
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
      <h2 className="text-center font-cinzel text-2xl md:text-3xl font-semibold text-[#1e1c4d] mb-6">ACCOUNT INFORMATION</h2>

      <div className="bg-[#f0dfc6] shadow-lg p-4 md:p-6 flex gap-4">
        <div className="flex-shrink-0">
          <Image
            src={photo}
            alt={name}
            width={64}
            height={64}
            className=" w-16 h-16 object-cover"
          />
        </div>

        <div className="flex flex-col justify-between font-semibold">
          <p className=" mb-2 text-sm md:text-base text-gray-800 font-semibold">You Recommended {name}</p>
          <p className="text-gray-900 text-sm md:text-[15px] font-semibold leading-relaxed mb-4">
            {recommendation}
          </p>
          <p className=" text-gray-800 text-sm font-semibold md:text-base">{name}</p>
          <p className="text-sm text-gray-700 font-semibold">{designation}</p>
          <p className="text-sm text-gray-700 mb-4 font-semibold">{organization}</p>

          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-fit bg-[#171744] text-white text-sm font-semibold px-4 py-2 mt-1  shadow hover:bg-[#0e0e33]"
          >
            Visit Linkedin Profile
          </a>
        </div>
      </div>

      <div className="mt-6">
      <button className="inline-flex items-center px-3 py-1.5 text-sm bg-red-500 text-white  hover:bg-red-600 transition-colors">

           <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
           Delete this Recommendation
        </button>
      </div>
    </div>
  );
};

export default RecommendationCard;
