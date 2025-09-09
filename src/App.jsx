import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import MainPage from "./pages/main/MainPage.jsx";
import LoginPage from "./pages/authme/login/LoginPage.jsx";
import DashboardPage from "./pages/dashboard/DashboardPage.jsx";
import Register from "./pages/authme/Register/Register.jsx";
import Profile from "./pages/profile/Profile.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import ModulePage from "./pages/module/ModulePage.jsx";
import FolderPage from "./pages/folder/FolderPage.jsx";
import DictionaryPage from "./pages/dictionary/DictionaryPage.jsx";
import LearnWordPage from "./pages/word/LearnPage.jsx";
import Header from "./components/header/Header";
import PrivateRoute from "./components/PrivateRoute";
import LearnPage from "./pages/word/LearnPage.jsx"; // ← добавлено

function App() {
    const location = useLocation();
    const hideHeaderRoutes = ["/login", "/signup", "/"];
    const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

    return (
        <>
            {shouldShowHeader && <Header />}
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<Register />} />

                <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                <Route path="/dashboard/module" element={<PrivateRoute><ModulePage /></PrivateRoute>} />
                <Route path="/dashboard/module/folder" element={<PrivateRoute><FolderPage /></PrivateRoute>} />
                <Route path="/dashboard/module/folder/dictionary" element={<PrivateRoute><DictionaryPage /></PrivateRoute>} />
                <Route path="/dashboard/module/folder/dictionary/learnword" element={<PrivateRoute><LearnPage /></PrivateRoute>} />

                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
            </Routes>
        </>
    );
}

export default App;
