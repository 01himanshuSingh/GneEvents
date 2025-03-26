"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check user authentication status       isme mutation lgane ki jarurat ni hai bar bar jarurat padegi hme api call to check user 
    const checkUser = async () => {
      try {
        const res = await axios.get("/api/auth/loggedme", { withCredentials: true });
        if (res.data.isAuthenticated) {
          setIsLoggedIn(true);
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
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="flex justify-center gap-3 items-center p-4 bg-white shadow-md w-full">
      <h1 className="text-3xl font-bold">events</h1>

      <div className="hidden md:flex">
        <input
          type="text"
          placeholder="Search for events and hackathon"
          className="px-4 py-2 w-80 border-2 border-[#635BFF] rounded-lg shadow-inner shadow-[#8983FF] text-sm"
        />
      </div>

      <div className="hidden md:flex">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 cursor-pointer text-white px-6 py-2 text-lg font-semibold rounded-md shadow-md"
          >
            Logout
          </button>
        ) : (
          <Link href="/auth/login">
            <button className="bg-[#635BFF] cursor-pointer text-white px-6 py-2 text-lg font-semibold rounded-md shadow-[#8983FF] shadow-md">
              Login
            </button>
          </Link>
        )}
      </div>

      <div className="md:hidden flex items-center gap-4">
        <Menu size={30} className="cursor-pointer" />
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
