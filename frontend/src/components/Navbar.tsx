import {useState} from "react";
import {auth,googleAuthProvider} from "../auth/firebase";
import {useUserContext} from "../hooks/userContext"
import { signInWithPopup } from "firebase/auth";

function Navbar() {

    const [error,setError] = useState<string | null>(null);
    const {user,setUser} = useUserContext();

    const handleLogin = async () => {
        try {
          const result =   await signInWithPopup(auth,googleAuthProvider);
          console.log("USER SIGNED IN..",result.user)
          const user = result.user;
    
          // Set the user details into context
          setUser({ id: user?.uid, email: user?.email || '',displayName: user?.displayName || "" });
    
          console.log('Logged in user:', user);
        } catch (error) {
          setError(error.message);
          console.error('Error during login:', error);
        }
    };

    const handleSignOut = async () => {
        try {
          await auth.signOut();
          setUser({ id: null, email: null,displayName: null});  // Reset user context on sign out
          console.log('Signed out');
        } catch (error) {
          console.error('Error during sign-out:', error);
        }
    };

  return (
    <nav className="bg-indigo-700 text-white shadow-md">
<div className="mx-auto px-4 py-4 flex items-center justify-between">
  <div className="flex items-center space-x-2">
    {/* Chess icon for logo */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-8 h-8"
    >
      <path d="M16.5 11.25v-2.25h1.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-1.5v-2.25c0-.414-.336-.75-.75-.75s-.75.336-.75.75v2.25h-1.5c-.414 0-.75.336-.75.75s.336.75.75.75h1.5v2.25c0 .414.336.75.75.75s.75-.336.75-.75zm-8.25-4.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm0 7.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm11.25 1.5a1.5 1.5 0 01-1.5 1.5h-13.5a1.5 1.5 0 01-1.5-1.5v-10.5a1.5 1.5 0 011.5-1.5h13.5a1.5 1.5 0 011.5 1.5v10.5z" />
    </svg>
    <h1 className="text-xl md:text-2xl font-bold">ChessTime</h1>
  </div>
  <div>
    {
        user.email && user.id ? (
        <div>
            <p>Welcome, {user?.displayName ? user.displayName : 'User'}</p>
           <button onClick={()=> handleSignOut()} className="bg-white text-indigo-700 px-4 py-2 rounded-md font-medium hover:bg-indigo-50 transition-colors duration-300 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50">
            Sign Out
           </button>
           
        </div>
          
        ):(
          <button onClick={()=> handleLogin()} className="bg-white text-indigo-700 px-4 py-2 rounded-md font-medium hover:bg-indigo-50 transition-colors duration-300 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50">
            Sign In
          </button>
        )
    }
    
  </div>
</div>
</nav>
  )
}

export default Navbar