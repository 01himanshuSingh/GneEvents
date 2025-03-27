"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import useMutationData from "../hook/usmutationdata";
import { useZodFormhook } from "../hook/usezodFormhook";
import { useLoginschema } from "../Schema/loginschema";
import { usecanCreateWorkspaces } from "../hook/usecanCreateWorkspaces";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

function Login() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, watch, errors } = useZodFormhook(useLoginschema(), {
        universityId: "",
        password: "",
    });

    const universityId = watch("universityId");
    const { data: userData } = usecanCreateWorkspaces(universityId); // ✅ Call API with debounced query

    const { mutate, isPending } = useMutationData({
        mutationKey: ["/auth/login"],
        mutationFn: async (data: { universityId: string; password: string }) => {
            const response = await axios.post(
                "http://localhost:3000/api/auth/login",
                data,
                { withCredentials: true }
            );
            return response.data;
        },
        onSuccess: () => {
            toast.success("Login Successful 🎉");
            setTimeout(() => {
                router.push("/");
            }, 2000);
        },
        onError: (error: any) => {
            const message = error.response?.data?.error || "Login failed. Please try again.";
            setErrorMessage(message);
        },
    });

    const onSubmit = handleSubmit((values: any) => {
        setErrorMessage("");
        mutate(values);
    });

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="text-black font-bold text-[30px] top-1 absolute mt-2"><h1>events</h1></div>
            <div className="w-full max-w-sm p-6 rounded-lg shadow-md bg-white">
                <h1 className="text-2xl font-medium text-center mb-4">Get Started</h1>
                    <p className="text-sm mb-4.5"> Access your account and start enrolling in events! </p>
                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="University ID"
                        className={`border p-3 text-[13px] rounded w-full ${
                            errors.universityId ? "border-red-500" : "border-[#635BFF]"
                            }`}
                        {...register("universityId")}
                    />
                    {errors.universityId && <p className="text-red-500 text-[13px]">{errors.universityId.message}</p>}

                <div className="relative">
                    <input
                         type={showPassword ? "text" : "password"}
                         placeholder="Password"
                         className={`border p-3 rounded text-[13px] w-full ${
                            errors.password ? "border-red-500" : "border-[#635BFF]"
                            }`}
                            
                            {...register("password")}
                            />
                            <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                            </div>
                            <div className="flex justify-end">
                        <Link href="/forget">
                            <p className="text-xs text-[#3d3a3a] cursor-pointer hover:underline">Forgot Password?</p>
                        </Link>
                    </div>
                  
                    {errors.password && <p className="text-red-500 text-[13px] relative top-[-16px]">{errors.password.message}</p>}

                                
                    <button
                        type="submit"
                        className={`p-3  shadow-md w-full ${
                            userData?.canCreate ? "bg-red-500 shadow-[#d8859e]" : "bg-[#635BFF] shadow-[#8983FF]"
                        } text-white `}
                        disabled={isPending}
                    >
                        {isPending ? "Logging in..." : userData?.canCreate ? "Login as Admin" : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
