import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import CategoryService from "../services/CategoryService";
import RobotLogoNavbar from "./RobotLogoNavbar";
import "./Navbar.css";

/**
 * Navigation bar component with search, categories, user menu, and cart.
 * Handles sticky behavior, mobile menu, category dropdown, and user authentication.
 */
export default function Navbar() {
    const navigate = useNavigate();
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const [isSticky, setIsSticky] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Debug: Check admin role
    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('🔍 DEBUG Navbar State:', {
            user,
            userRole: user?.role,
            isAdmin: isAdmin(),
            isAuthenticated,
            hasToken: !!token,
            tokenExists: token ? 'yes' : 'no',
            userMenuOpen
        });
    }, [user, isAdmin, isAuthenticated, userMenuOpen]);

    useEffect(() => {
        const handleScroll = () => setIsSticky(window.scrollY > 40);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        CategoryService.getCategories().then(setCategories);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuOpen && !event.target.closest('.nav-user-menu')) {
                setUserMenuOpen(false);
            }
        };

        if (userMenuOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [userMenuOpen]);

    const handleSearch = (event) => {
        event.preventDefault();
        const query = searchTerm.trim();
        if (!query) return;
        navigate(`/catalog?search=${encodeURIComponent(query)}`);
        setSearchTerm("");
        setMenuOpen(false);
    };

    const navigateTo = (path) => {
        navigate(path);
        setMenuOpen(false);
    };

    const navigateCategory = (id) => {
        navigate(`/catalog?category=${id}`);
        setDropdownOpen(false);
        setMenuOpen(false);
    };

    return (
        <nav className={`navbar ${isSticky ? "sticky" : ""}`}>
            <div className="nav-container">
                <div className="nav-left">
                    <button
                        className={`nav-toggle ${menuOpen ? "open" : ""}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span />
                        <span />
                        <span />
                    </button>

                    <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
                        <RobotLogoNavbar />
                        <span className="logo-text">
                            <span className="logo-accent">MY3D</span> webshop
                        </span>
                    </Link>
                </div>

                <form className="nav-search" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search models, authors, categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Search"
                    />
                    <button type="submit" aria-label="Search model">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                            <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </button>
                </form>

                <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
                    <li>
                        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                    </li>
                    <li>
                        <Link to="/catalog" onClick={() => setMenuOpen(false)}>Catalog</Link>
                    </li>
                    <li
                        className="nav-dropdown"
                        onMouseEnter={() => setDropdownOpen(true)}
                        onMouseLeave={() => setDropdownOpen(false)}
                    >
                        <button type="button" onClick={() => setDropdownOpen(!dropdownOpen)}>
                            Categories
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                        <div className={`dropdown-menu ${dropdownOpen ? "visible" : ""}`}>
                            {categories.length > 0 ? (
                                categories.slice(0, 8).map((category) => (
                                    <button key={category.id} type="button" onClick={() => navigateCategory(category.id)}>
                                        {category.name}
                                    </button>
                                ))
                            ) : (
                                <span className="dropdown-empty">Loading...</span>
                            )}
                        </div>
                    </li>
                    <li>
                        <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
                    </li>
                    <li>
                        <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
                    </li>
                    {isAuthenticated && isAdmin() && (
                        <li>
                            <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
                        </li>
                    )}
                </ul>

                <div className="nav-icons">
                    <button className="icon-button" type="button" onClick={() => navigateTo("/catalog")} aria-label="Search">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                            <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </button>
                    <button className="icon-button" type="button" onClick={() => navigateTo("/cart")} aria-label="Cart">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M3 5h2l2 11h10l2-8H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="9" cy="20" r="1" fill="currentColor" />
                            <circle cx="18" cy="20" r="1" fill="currentColor" />
                        </svg>
                    </button>
                    {isAuthenticated ? (
                        <div className="nav-user-menu">
                            <button
                                className="icon-button user-button"
                                type="button"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                aria-label="User menu"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                                    <path d="M4 20c1.5-3 4.5-5 8-5s6.5 2 8 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <span className="user-name">{user?.username || 'User'}</span>
                            </button>
                            {userMenuOpen && (
                                <div className="user-dropdown">
                                    <Link to="/profile" onClick={() => setUserMenuOpen(false)}>
                                        Profile
                                    </Link>
                                    {isAdmin() && (
                                        <Link to="/admin" onClick={() => setUserMenuOpen(false)}>
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => {
                                            logout();
                                            setUserMenuOpen(false);
                                            navigate('/');
                                        }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="nav-auth">
                            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                            <Link to="/register" className="register-btn" onClick={() => setMenuOpen(false)}>
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
