import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import React, { useRef, useEffect, useState } from "react";
import moneyVideo from "../Homepage Components/moneyVideo.mp4";
import moneyBundle from "../Homepage Components/moneyBundle.png";
//import moneyBundle from "../Homepage Components/moneyBundle.png";
//import moneyBundle from "../Homepage Components/moneyBundle.png";
//import moneyBundle from "../Homepage Components/moneyBundle.png";
import "../Homepage Components/Homepage.css";

const Homepage = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current.controls = false;
  }, []);

  const [selected, setSelected] = useState(null);

  const toggleInfo = (item) => {
    if (selected === item) {
      setSelected(null);
    } else {
      setSelected(item);
    }
  };

  return (
    <div className="bg-green-200 min-h-screen">
      <div className="relative flex flex-col">
        <div className="relative w-full h-0 py-52 overflow-hidden">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
            ref={videoRef}
            src={moneyVideo}
            controls
            autoPlay
            loop
            muted
          >
            Your browser does not support the video tag.
          </video>
          <div className="absolute w-full h-full gradient-overlay z-10"></div>
          <div className="absolute bottom-0 left-0 p-4 z-20">
            <h1 className="text-5xl font-black text-green-500">
              Welcome To CashTrack
            </h1>
            <span> </span>
            <p className="text-3xl text-center text-white">
              A Web App for sound financial advice and management
            </p>
          </div>
        </div>
      </div>

      <h1 className="text-center text-2xl font-bold p-8">
        App Details
      </h1>
      <p className="text-center text-xl text-cream p-5">
      This app is an exercise for Noah to practice React and Django
      </p>

      <div className="flex justify-center items-center">
        <ul className="flex text-cream font-bold mx-auto">
          <div
            className={`flex flex-col items-center mx-4 px-4 cursor-pointer clickable-div ${
              selected === "Image One" ? "expanded" : ""
            }`}
            onClick={() => toggleInfo("Image One")}
          >
            <img className="w-28 h-28" src={moneyBundle} alt="largeFish" />
            <li>
              Budgeting
              {selected === "Image One" && (
                <div className="info-container text-gray-500">
                  Allows adding a budget and viewing a budget. Gives monthly budgeting estimates
                </div>
              )}
            </li>
          </div>
          <div
            className="flex flex-col items-center mx-4 px-4 cursor-pointer clickable-div"
            onClick={() => toggleInfo("Image Two")}
          >
            <img className="w-28 h-28" src={moneyBundle} alt="moneyBundle" />
            <li>
              Interest Rates
              {selected === "Image Two" && (
                <div className="info-container text-gray-500">
                Allows calculating the effective interest rate of assets dispersed across different types
                </div>
              )}
            </li>
          </div>
          <div
            className="flex flex-col items-center mx-4 px-4 cursor-pointer clickable-div"
            onClick={() => toggleInfo("Image Three")}
          >
            <img className="w-28 h-28" src={moneyBundle} alt="moneyBundle" />
            <li>
              Net Worth Projections
              {selected === "Image Three" && (
                <div className="text-gray-500 info-container">
                Allows calculating net worth projections based on income and expenses
                </div>
              )}
            </li>
          </div>
        </ul>
      </div>
      <div className="text-center py-10">
        <Link
          to="/Login"
          className="inline-block w-48 text-cream bg-green-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 p-8"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Homepage;
