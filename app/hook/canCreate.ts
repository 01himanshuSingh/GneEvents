import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";

export function canCreate(universityId: string) {
    const [debouncedId, setDebouncedId] = useState(universityId);

    // Debounce effect
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedId(universityId);
        }, 500); // 500ms delay

        return () => clearTimeout(handler);
    }, [universityId]);

    return useQuery({
        queryKey: ["check-user", debouncedId],
        queryFn: async () => {
            if (!debouncedId) return null;
            const response = await axios.get(`/api/auth/check-user?universityId=${debouncedId}`);
            return response.data;
        },
        enabled: !!debouncedId, // Prevents API calls when empty
    });
}
