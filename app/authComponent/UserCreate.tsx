"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import useMutationData from "../hook/usmutationdata";
import { useZodFormhook } from "../hook/zodFormhook";
import { useLoginschema } from "../zodSchema/loginschema";

function Login() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState(""); // ✅ State for login error

    const { register, handleSubmit, errors } = useZodFormhook(useLoginschema(), {
        universityId: "",
        password: "",
    });

    const { mutate, isPending } = useMutationData({
        mutationKey: ["login"],
        mutationFn: async (data: { universityId: string; password: string }) => {
            const response = await axios.post(
                "http://localhost:3000/api/auth/login",
                data,
                { withCredentials: true }
            );
            return response.data;
        },
        onSuccess: () => {
            toast.success("Login Successful 🎉"); // ✅ Show success toast
            setTimeout(() => {
                router.push("/"); // ✅ Redirect to home page
            }, 2000);
        },
        onError: (error: any) => {
            const message = error.response?.data?.error || "Login failed. Please try again.";
            setErrorMessage(message); // ✅ Set error message
        },
    });

    const onSubmit = handleSubmit((values: any) => {
        setErrorMessage(""); // ✅ Clear error before submitting
        mutate(values);
    });

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="w-full max-w-sm p-6 rounded-lg shadow-md bg-white">
                <h1 className="text-2xl font-bold text-center mb-4">Login</h1>

                {/* ✅ Error Message Box Below Heading */}
                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="University ID"
                        className="border p-3 rounded w-full"
                        {...register("universityId")}
                    />
                    {errors.universityId && <p className="text-red-500 text-sm">{errors.universityId.message}</p>}

                    <input
                        type="password"
                        placeholder="Password"
                        className="border p-3 rounded w-full"
                        {...register("password")}
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

                    <button
                        type="submit"
                        className="bg-[#635BFF] text-white p-3 rounded-lg shadow-md w-full"
                        disabled={isPending}
                    >
                        {isPending ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
