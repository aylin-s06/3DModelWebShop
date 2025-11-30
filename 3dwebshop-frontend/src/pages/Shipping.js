import { Link } from "react-router-dom";
import "./Shipping.css";

export default function Shipping() {
    return (
        <div className="shipping-page">
            <div className="container">
                <div className="shipping-header">
                    <Link to="/" className="back-link">← Начало</Link>
                    <h1>Доставка</h1>
                    <p className="shipping-subtitle">Информация за доставка и разходи</p>
                </div>

                <div className="shipping-content">
                    <section className="shipping-section">
                        <h2>⏱️ Срокове за доставка</h2>
                        <div className="info-card">
                            <h3>Изработка</h3>
                            <p>Всеки продукт се принтира след поръчка. Срокът за изработка е <strong>1-3 работни дни</strong>, в зависимост от сложността и размера на модела.</p>
                        </div>
                        <div className="info-card">
                            <h3>Доставка</h3>
                            <p>След като продуктът е готов, изпращаме го чрез куриерска компания. Доставката в България обикновено отнема <strong>2-5 работни дни</strong>.</p>
                            <p className="note">Общо време: <strong>3-8 работни дни</strong> от момента на поръчката до получаване.</p>
                        </div>
                    </section>

                    <section className="shipping-section">
                        <h2>💰 Разходи за доставка</h2>
                        <div className="pricing-table">
                            <div className="pricing-row">
                                <span className="pricing-label">Поръчки над 50 лв.</span>
                                <span className="pricing-value">Безплатна доставка</span>
                            </div>
                            <div className="pricing-row">
                                <span className="pricing-label">Поръчки до 50 лв. (до 1 кг)</span>
                                <span className="pricing-value">5 лв.</span>
                            </div>
                            <div className="pricing-row">
                                <span className="pricing-label">Поръчки до 50 лв. (над 1 кг)</span>
                                <span className="pricing-value">8 лв.</span>
                            </div>
                            <div className="pricing-row">
                                <span className="pricing-label">Експресна доставка (24ч)</span>
                                <span className="pricing-value">15 лв.</span>
                            </div>
                        </div>
                    </section>

                    <section className="shipping-section">
                        <h2>📍 Зони за доставка</h2>
                        <div className="info-card">
                            <p>В момента доставяме <strong>само в България</strong>.</p>
                            <p>За международни доставки моля свържете се с нас чрез <Link to="/contact">контактната форма</Link> за индивидуална оферта.</p>
                        </div>
                    </section>

                    <section className="shipping-section">
                        <h2>📦 Проследяване на поръчка</h2>
                        <div className="info-card">
                            <p>След като поръчката бъде изпратена, ще получите <strong>имейл с номер за проследяване</strong>.</p>
                            <p>Можете също да проверите статуса на поръчката в <Link to="/profile">профила си</Link>.</p>
                        </div>
                    </section>

                    <section className="shipping-section">
                        <h2>❓ Допълнителни въпроси</h2>
                        <div className="info-card">
                            <p>Ако имате въпроси относно доставката, моля свържете се с нас:</p>
                            <ul>
                                <li>Чрез <Link to="/contact">контактната форма</Link></li>
                                <li>На имейл: <a href="mailto:contact@my3dwebshop.com">contact@my3dwebshop.com</a></li>
                                <li>Или разгледайте <Link to="/faq">често задаваните въпроси</Link></li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

