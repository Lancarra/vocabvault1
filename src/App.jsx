import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import MainPage from "./pages/main/MainPage.jsx";
import LoginPage from "./pages/authme/login/LoginPage.jsx";
import DashboardPage from "./pages/dashboard/DashboardPage.jsx";
import Register from "./pages/Register";
import Profile from "./pages/profile/Profile.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import ModulePage from "./pages/module/ModulePage.jsx";
import FolderPage from "./pages/folder/FolderPage.jsx";
import DictionaryPage from "./pages/dictionary/DictionaryPage.jsx";
import WordPage from "./pages/word/WordPage.jsx";
import Header from "./components/header/Header";

function App() {
    const location = useLocation();
    const hideHeaderRoutes = ["/login", "/register","/"];
    const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

    return (
        <>
            {shouldShowHeader && <Header />}
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard/module" element={<ModulePage />} />
                <Route path="/dashboard/module/folder" element={<FolderPage />} />
                <Route path="/dashboard/module/folder/dictionary" element={<DictionaryPage />} />
                <Route path="/dashboard/module/folder/dictionary/word" element={<WordPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/change-password" element={<ChangePassword />} />
            </Routes>
        </>
    );
}

export default App;
