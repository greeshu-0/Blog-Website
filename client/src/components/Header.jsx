import React, { useRef } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Header = () => {
  const { setInput, input } = useAppContext();
  const inputRef = useRef();

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setInput(inputRef.current.value);
  };

  const onClear = () => {
    setInput("");
    inputRef.current.value = "";
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-100 py-20 px-6 sm:px-16 xl:px-24 overflow-hidden">
      <img
        src={assets.gradientBackground}
        alt=""
        className="absolute top-0 left-0 w-full h-full object-cover opacity-20 -z-10"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center justify-center gap-3 px-5 py-2 mb-6 border border-primary/40 bg-primary/10 rounded-full text-sm text-primary">
            <p>New AI feature integrated</p>
            <img src={assets.star_icon} alt="star" className="w-4" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold leading-tight text-gray-800 -tracking">
            Your Personal Hub for <span className="text-primary">Insight</span>
            ful Writing
          </h1>

          <p className="mt-6 sm:mt-8 max-w-xl text-gray-600 text-sm sm:text-base mx-auto lg:mx-0">
            This is your space to think out loud, share what matters, and write
            without filters. Whether it's one word or a thousand, your story
            starts right here.
          </p>

          <form
            onSubmit={onSubmitHandler}
            className="mt-8 flex max-w-lg mx-auto lg:mx-0 border border-gray-300 bg-white rounded-lg overflow-hidden shadow-sm"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for blogs"
              required
              className="w-full px-4 py-2 outline-none text-sm"
            />
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 hover:scale-105 transition-all"
            >
              Search
            </button>
          </form>

          {input && (
            <div className="mt-4">
              <button
                onClick={onClear}
                className="text-xs px-3 py-1 border border-gray-300 rounded shadow-sm hover:bg-gray-100 transition"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        <div className="hidden lg:flex justify-center items-center">
          <img
            src={assets.ai}
            alt="Blog Icon"
            className="h-100 opacity-90 rounded-4xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
