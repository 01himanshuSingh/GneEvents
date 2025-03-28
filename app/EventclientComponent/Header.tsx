"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

function  Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    // Check user authentication status       isme mutation lgane ki jarurat ni hai bar bar jarurat padegi hme api call to check user 
    const checkUser = async () => {
      try {
        const res = await axios.get("/api/auth/loggedme", { withCredentials: true });
        if (res.data.isAuthenticated) {
          setIsLoggedIn(true);
          console.log(res.data.user) 
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });

      setIsLoggedIn(false);
      setIsSidebarOpen(false)
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="flex justify-center gap-3 items-center p-4 w-full">

     <Link href='/'> <h1 className="text-3xl font-bold">events</h1></Link>

      <div className="hidden md:flex">
        <input
          type="text"
          placeholder="Search for events and hackathon"
          className="px-8 py-2 w-90  bg-[#f8f8f8]    text-sm "
        />
      </div>

      <div className="hidden md:flex">
        {isLoggedIn ? (
          <button
          
            className="bg-black cursor-pointer text-white px-3 py-2 font-semibold rounded-xl shadow-md text-sm"
          >
            <p className="txet-xs">continue to Workspace</p>
          </button>
        ) : (
          <Link href="/auth/login">
            <button className="bg-[#635BFF] cursor-pointer text-white px-6 py-2 w-[90px] text-sm font-semibold rounded-4xl  shadow-[#8983FF] shadow-md">
              Log in
            </button>
          </Link>
        )}
      </div>

        {isLoggedIn &&(

<div className=" flex items-center gap-4">
<Menu size={30} className="cursor-pointer" onClick={()=>setIsSidebarOpen(true)}  />
</div>
        )}
      <div
        className={`fixed top-0 right-0 h-full w-74 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        {/* Close Button */}
        <div className="flex justify-between p-4 ">
          <h2 className="text-lg font-semibold">Hey Himanshu!</h2>
          <X size={24} className="cursor-pointer" onClick={() => setIsSidebarOpen(false)} />
        </div>
        <div className="flex justify-center items-center h-screen">
  <button className="flex justify-center cursor-pointer w-[144px] px-3 py-1 rounded-4xl bg-black text-white" onClick={handleLogout}>
    Logout
  </button>
</div>
</div>

        
      {!isLoggedIn && (
        <div className="md:hidden absolute left-4 bottom-4">
          <Link href="/auth/login">
            <button className="bg-[#635BFF] cursor-pointer text-white px-6 py-2 text-lg font-semibold rounded-md shadow-md">
              Login
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Header;
