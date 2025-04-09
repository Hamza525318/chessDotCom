import { useNavigate } from "react-router"
import Navbar from "../components/Navbar"


function LandingPage() {

    const navigate = useNavigate();

  return (
    <div className="w-screen mx-auto">
    <Navbar/>
    <div className="flex flex-col md:flex-row items-center px-4 my-4 gap-8">
      {/* Left side - Image */}
      <div className="w-full md:w-1/2">
        <div className="relative rounded-lg overflow-hidden shadow-xl">
          <img
            src="./assets/chess-hero.jpg"
            alt="Chess board with pieces in space"
            className="w-full h-auto object-cover md:h-[500px]"
          />
        </div>
      </div>

      {/* Right side - Text and Play button */}
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
          Play Chess in Real-Time
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Challenge players around the world, improve your skills, and have fun with our real-time chess platform. No downloads required!
        </p>
        <button onClick={()=> navigate('/game')} className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform transition-transform hover:scale-105 cursor-pointer">
          Play Online
        </button>
      </div>
    </div>
  </div>
  )
}

export default LandingPage