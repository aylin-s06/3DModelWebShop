import { Link } from "react-router-dom";
import "./Footer.css";

/**
 * Footer component displaying site navigation, social links, and newsletter signup.
 * Contains links to main pages, support pages, and social media.
 */
export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <h3><span>3D</span> WebShop</h3>
                    <p>Маркетплейсът за дигитални творци и 3D ентусиасти.</p>
                    <div className="footer-social">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M15 4h2V0h-3c-3.3 0-5 2-5 5v3H6v4h3v12h4V12h3.1l.9-4H13V5c0-.6.4-1 1-1h1z" fill="currentColor" />
                            </svg>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                            <svg viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
                                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                                <circle cx="17" cy="7" r="1" fill="currentColor" />
                            </svg>
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M22 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-0.8C16 5 12 5 12 5h0s-4 0-7.2.2c-.4 0-1.2 0-2 .8C2.2 6.6 2 8 2 8S1.8 9.6 1.8 11.2v1.6C1.8 14.4 2 16 2 16s.2 1.4.8 2c.8.8 1.8.8 2.2.8 1.6.2 6.8.2 6.8.2s4 0 7.2-.2c.4 0 1.2 0 2-.8.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.6C22.2 9.6 22 8 22 8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                                <path d="M10 15l5-3-5-3v6z" fill="currentColor" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div className="footer-links">
                    <h4>Навигация</h4>
                    <Link to="/">Начало</Link>
                    <Link to="/catalog">Каталог</Link>
                    <Link to="/about">За нас</Link>
                    <Link to="/contact">Контакт</Link>
                </div>

                <div className="footer-links">
                    <h4>Поддръжка</h4>
                    <Link to="/faq">FAQ</Link>
                    <Link to="/shipping">Доставка</Link>
                    <Link to="/returns">Връщане</Link>
                    <Link to="/privacy">Политика за поверителност</Link>
                </div>

                <div className="footer-newsletter">
                    <h4>Бюлетин</h4>
                    <p>Получавай първи новини за модели, уроци и промоции.</p>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Имейл адрес" aria-label="Имейл адрес" />
                        <button type="submit">Абонирай се</button>
                    </form>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© {currentYear} 3D WebShop — Всички права запазени.</p>
                <div className="footer-meta">
                    <Link to="/terms">Общи условия</Link>
                    <span>•</span>
                    <Link to="/support">Поддръжка</Link>
                </div>
            </div>
        </footer>
    );
}
