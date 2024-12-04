import React from "react";
import { FaWrench } from "react-icons/fa";
import { FaHardHat } from "react-icons/fa";

const EmptyState = ({
  title = "Under Construction",
  description = "Nothing to see here.",
  icon: IconOne = FaWrench,
  icon: IconTwo = FaHardHat,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative flex items-center space-x-4">
        {/* <div className="relative">
          <IconOne
            className="w-20 h-20 text-yellow-500 animate-spin"
            strokeWidth={1.5}
          />
          <div className="absolute inset-0 animate-ping">
            <IconOne
              className="w-20 h-20 text-yellow-400 opacity-75"
              strokeWidth={1.5}
            />
          </div>
        </div> */}

        <div className="relative">
          <IconTwo
            className="w-12 h-12 text-orange-500 animate-bounce duration-500 delay-800 opacity-60"
            strokeWidth={1.5}
          />
          {/* <div className="absolute inset-0 animate-ping">
            <IconTwo
              className="w-20 h-20 text-orange-400 opacity-75"
              strokeWidth={1.5}
            />
          </div> */}
        </div>
      </div>

      {/* <h2 className="text-2xl font-semibold text-gray-700">{title}</h2> */}

      <p className="text-gray-500 my-1 max-w-xs">{description}</p>

      {/* <div className="flex items-center space-x-2 bg-yellow-100 px-4 py-2 rounded-full">
        <FaWrench className="w-4 h-4 text-yellow-600" />
        <span className="text-sm text-yellow-800">
          Coming soon! We're working on it.
        </span>
      </div> */}
    </div>
  );
};

export default EmptyState;
