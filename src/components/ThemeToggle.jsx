import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react"; // можно заменить на любые

const ThemeToggle = () => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"));
    };

    return (
        <div className="dropdown-item" onClick={toggleTheme}>
            {theme === "dark" ? (
                <>
                    <Sun size={18} color="#f4b400" />
                    Light Mode
                </>
            ) : (
                <>
                    <Moon size={18} color="#444" />
                    Dark Mode
                </>
            )}
        </div>
    );
};

export default ThemeToggle;
