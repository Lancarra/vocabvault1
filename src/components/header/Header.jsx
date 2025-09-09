import React, { useEffect, useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchImg from "../../assets/search-img.png";
import UserMenu from "../UserMenu";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import "./Header.css";

const Header = () => {
    const { search, pathname } = useLocation();
    const navigate = useNavigate();
    const [q, setQ] = useState("");

    // подтягиваем текущее значение из URL
    useEffect(() => {
        const params = new URLSearchParams(search);
        setQ(params.get("q") || "");
    }, [search]);

    const onSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams(search);
        const value = q.trim();
        value ? params.set("q", value) : params.delete("q");
        navigate({ pathname, search: params.toString() });
    };

    const onClear = () => {
        setQ("");
        const params = new URLSearchParams(search);
        params.delete("q");
        navigate({ pathname, search: params.toString() });
    };

    // === хлебные крошки ===
    const hideBreadcrumbsOn = ["/", "/login", "/signup"];
    const breadcrumbNameMap = {
        dashboard: "Main Page",
        module: "Module",
        folder: "Folder",
        dictionary: "Dictionary",
        learnword: "Words",
        profile: "Profile",
        "change-password": "Change password",
    };

    const crumbs = useMemo(() => {
        if (hideBreadcrumbsOn.includes(pathname)) return [];

        const parts = pathname.split("/").filter(Boolean);
        const isInDashboard = parts[0] === "dashboard";

        const base = isInDashboard
            ? [{ label: "Dashboard", href: "/dashboard" }]
            : [{ label: "Main Page", href: "/" }]

        const rest = (isInDashboard ? parts.slice(1) : parts).map(
            (segment, idx, arr) => {
                const url =
                    "/" +
                    (isInDashboard
                            ? ["dashboard", ...arr.slice(0, idx + 1)]
                            : arr.slice(0, idx + 1)
                    ).join("/");

                const isLast = idx === arr.length - 1;
                return {
                    label: breadcrumbNameMap[segment] || segment,
                    href: isLast ? undefined : url,
                };
            }
        );

        return [...base, ...rest];
    }, [pathname]);

    return (
        <div className="header-container">
            {/* сам хедер */}
            <header className="header">
                <div className="header-left">
                    <Link to="/dashboard" className="logo">
                        LearnIT
                    </Link>
                </div>

                <div className="header-center">
                    <form className="search_bar" onSubmit={onSubmit}>
                        <img src={SearchImg} alt="" aria-hidden />
                        <input
                            type="search"
                            placeholder="Search..."
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            autoComplete="off"
                            aria-label="Search"
                        />
                        {q && (
                            <button
                                type="button"
                                className="search_clear"
                                onClick={onClear}
                                aria-label="Clear search"
                                title="Clear"
                            >
                                ×
                            </button>
                        )}
                    </form>
                </div>

                <div className="header-right">
                    <UserMenu />
                </div>
            </header>

            {/* хлебные крошки ниже хедера */}
            {crumbs.length > 0 && (
                <div className="header-breadcrumbs">
                    <Breadcrumbs items={crumbs} collapseAfter={4} />
                </div>
            )}
        </div>
    );
};

export default Header;