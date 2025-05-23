import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch staff only if not already available
    const fetchStaff = useCallback(async () => {
        if (staff) return; // ✅ Prevents unnecessary API calls

        try {
            const response = await axios.get("http://localhost:5002/validate_token", { withCredentials: true });
            if (response.data.staff) {
                setStaff(response.data.staff);
                setLoading(false);
                navigate("/dashboard");
            }
        } catch (error) {
            setStaff(null);
        }
        setLoading(false);
    }, [staff, navigate]); // ✅ Added 'staff' as a dependency

    // Fetch staff info only once on page load
    useEffect(() => {
        fetchStaff();
    }, [fetchStaff]);

    // Logout function
    const logout = async () => {
        await axios.post("http://localhost:5002/api/staff/logout", {}, { withCredentials: true });
        setStaff(null);
    };

    return (
        <AuthContext.Provider value={{ staff, setStaff, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
