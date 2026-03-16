"use client";
import React, { useState, useContext, useRef, useEffect } from "react";
import { ShopContext } from "@/context/ShopContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Shop", path: "/", key: "shop" },
  { label: "Men", path: "/mens", key: "mens" },
  { label: "Women", path: "/womens", key: "womens" },
  { label: "Kids", path: "/kids", key: "kids" },
];

const Navbar = () => {
  const pathname = usePathname();
  const { getTotalCartItems } = useContext(ShopContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // FIX: ref wraps the ENTIRE navbar so outside-click doesn't
  // fight with the hamburger button being outside the drawer
  const navRef = useRef();

  useEffect(() => {
  setIsLoggedIn(!!localStorage.getItem("auth-token"))
}, [])


  const activeKey = NAV_LINKS.find((l) => l.path === pathname)?.key || "shop";

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // FIX: outside-click closes drawer — ref is on the whole nav
  // so hamburger clicks are correctly "inside" and won't auto-close
  useEffect(() => {
    const handleOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  // Close drawer on route change (navigating closes menu too)
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const cartCount = getTotalCartItems();
 const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    window.location.replace("/login");
  };

  return (
    <nav
      ref={navRef}
      className={`navbar${scrolled ? " navbar--scrolled" : ""}`}
    >
      {/* ── Logo ── */}
      <Link href="/" className="nav-logo">
        <img src="/Assets/logo.png" alt="Shopper logo" />
        <span>SHOPPER</span>
      </Link>

      {/* ── Desktop menu ── */}
      <ul className="nav-menu">
        {NAV_LINKS.map(({ label, path, key }) => (
          <li key={key} className={activeKey === key ? "active" : ""}>
            <Link href={path}>{label}</Link>
          </li>
        ))}
      </ul>

      {/* ── Desktop right actions ── */}
      <div className="nav-actions">
        {isLoggedIn ? (
          <button className="nav-btn nav-btn--outline" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link href="/login">
            <button className="nav-btn nav-btn--outline">Login</button>
          </Link>
        )}

        <Link href="/cart" className="nav-cart">
          <img src="/Assets/cart_icon.png" alt="Cart" />
          {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
        </Link>
      </div>

      {/* ── Mobile: cart + hamburger always visible ── */}
      <div className="nav-mobile-right">
        <Link href="/cart" className="nav-cart">
          <img src="/Assets/cart_icon.png" alt="Cart" />
          {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
        </Link>

        {/* FIX: This button now correctly toggles open/close.
            It is INSIDE navRef so outside-click won't fight it. */}
        <button
          className={`nav-hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {/* FIX: Using visibility/opacity instead of display:none so
          the drawer doesn't disappear before animation ends */}
      <div className={`nav-drawer${menuOpen ? " open" : ""}`}>
        {NAV_LINKS.map(({ label, path, key }) => (
          <Link
            key={key}
            href={path}
            className={`nav-drawer-link${activeKey === key ? " active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </Link>
        ))}

        <div className="nav-drawer-bottom">
          {isLoggedIn ? (
            <button
              className="nav-btn nav-btn--solid"
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
            >
              Logout
            </button>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              <button className="nav-btn nav-btn--solid">Login</button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
