import {useSocket} from '../hooks/useSocket';
import {Chess} from "chess.js";
import { useState,useEffect } from 'react';
import ChessBoard from '../components/ChessBoard';
import Navbar from '../components/Navbar';
import { useUserContext } from '../hooks/userContext';
import Modal from 'react-modal';
import { BounceLoader } from 'react-spinners';
import { useNavigate } from 'react-router';

Modal.setAppElement('#root');

function GamePage() {

    const socket = useSocket();
    const [chess,setChess] = useState(new Chess());
    const [board,setBoard] = useState(chess.board());
    const [waitingGameModal,setWaitingGameModal] = useState(false);
    const {user} = useUserContext();
    const navigate = useNavigate();

    const startGame = ()=>{

        if(!user?.email) {
            alert("Please Sign In to start playing!!");
            return;
        }

        socket?.emit('init_game',{id: user.id,email: user.email});
        setWaitingGameModal(true);
    }

    useEffect(()=>{

        if(!socket) return;

        socket.on("start_game",(gameDetails: {gameId: string,players: [{id: string,email:string}],board: Chess})=>{
          console.log("MATCH FOUND--->>>")
          navigate(`/game/${gameDetails.gameId}`,{state: gameDetails});
        }) 
    })
    
    return (
     <div className='w-screen h-screen mx-auto bg-slate-800'>
        <Navbar/>
        <div className="w-full flex flex-col md:flex-row items-center px-4 my-6 gap-8">
            <div className='w-full md:w-1/2 flex justify-end'>
                {/* CHESSBOARD*/}
                <div>
                   <ChessBoard board={board}/>
                </div>
            </div>
            <div className="w-full md:w-1/2 text-center md:text-left md:px-4">
            <h3 className='text-2xl font-bold my-2 text-white font-mono'>Let's Play Chess ♟️</h3>
            <button onClick={startGame} className="bg-green-500 hover:bg-indigo-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform transition-transform hover:scale-105 cursor-pointer">
              Play Now
            </button>
            </div>
        </div>

        <Modal 
      isOpen={waitingGameModal} 
      onRequestClose={() => setWaitingGameModal(false)} 
      contentLabel="Example Modal"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
          zIndex: 1000,
        },
        content: {
          maxWidth: '400px',    // Set max width
          width: '80%',         // Width as a percentage of the screen size
          height: '200px',       // Auto adjust height
          margin: 'auto',       // Center the modal
          padding: '16px',      // Add some padding
          borderRadius: '8px',  // Optional: rounded corners
          backgroundColor: 'white', // Background color for the modal
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)', // Optional: drop shadow
        },
      }}
    >
      <h2 className='text-center font-semibold text-xl'>Finding the right match for you....</h2>
      {/* Other content */}
      <div className="flex justify-center items-center mt-4">
        <BounceLoader color="#3498db" size={50} />
      </div>
    </Modal>
     </div>
  )
}

export default GamePage