import React from "react";
import { RiCloseFill, RiErrorWarningFill } from "react-icons/ri";

const RequestModal = ({
  onClose,
  onPost,
}: {
  onClose: () => void;
  onPost: () => void;
}) => {
  return (
    <div className="fixed top-0 left-0 bg-black/20 w-full h-screen flex items-center justify-center">
      <div className="w-3/4 lg:w-1/6 bg-white p-6 rounded-2xl flex flex-col items-center justify-center gap-6">
        <div className="w-full flex flex-row items-center justify-end">
          <RiCloseFill
            size={16}
            color="black"
            className="cursor-pointer"
            onClick={onClose}
          />
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-1">
          <RiErrorWarningFill size={42} color="green" />
          <p className="text-sm font-bold text-green-700">Attention!</p>
        </div>

        <p className="text-sm font-normal text-center">
          Once submitted, you won't be able to edit the data!
        </p>
        <div
          className="p-3 rounded-xl bg-green-700 text-sm font-normal text-white cursor-pointer"
          onClick={onPost}
        >
          Submit
        </div>
      </div>
    </div>
  );
};

export default RequestModal;
