import { Link } from "react-router-dom";
import "./Privacy.css";

export default function Privacy() {
    return (
        <div className="privacy-page">
            <div className="container">
                <div className="privacy-header">
                    <Link to="/" className="back-link">← Начало</Link>
                    <h1>Политика за поверителност</h1>
                    <p className="privacy-subtitle">Последна актуализация: {new Date().toLocaleDateString('bg-BG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div className="privacy-content">
                    <section className="privacy-section">
                        <h2>1. Въведение</h2>
                        <p>
                            Ние, <strong>3D WebShop</strong>, се ангажираме да защитаваме вашата поверителност. 
                            Тази политика обяснява как събираме, използваме и защитаваме вашата лична информация 
                            при използването на нашия уебсайт.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>2. Каква информация събираме</h2>
                        <div className="info-card">
                            <h3>Информация, която ни предоставяте:</h3>
                            <ul>
                                <li>Име и контактни данни (имейл, телефон, адрес)</li>
                                <li>Потребителско име и парола</li>
                                <li>Информация за плащане (обработва се чрез защитени платежни процесори)</li>
                                <li>Адреси за доставка</li>
                            </ul>
                            
                            <h3>Автоматично събирана информация:</h3>
                            <ul>
                                <li>IP адрес и данни за браузъра</li>
                                <li>Информация за устройството и операционната система</li>
                                <li>Данни за използване на сайта (страници, които посещавате, време на престой)</li>
                                <li>Cookies и подобни технологии</li>
                            </ul>
                        </div>
                    </section>

                    <section className="privacy-section">
                        <h2>3. Как използваме информацията</h2>
                        <div className="info-card">
                            <p>Използваме събраната информация за:</p>
                            <ul>
                                <li>Обработка и изпълнение на вашите поръчки</li>
                                <li>Комуникация относно поръчките и услугите</li>
                                <li>Подобряване на нашия уебсайт и услуги</li>
                                <li>Изпращане на маркетингови съобщения (само с вашето съгласие)</li>
                                <li>Спазване на правни задължения</li>
                                <li>Предотвратяване на измами и злоупотреби</li>
                            </ul>
                        </div>
                    </section>

                    <section className="privacy-section">
                        <h2>4. Споделяне на информация</h2>
                        <div className="info-card">
                            <p>Не продаваме вашата лична информация. Може да споделяме информация с:</p>
                            <ul>
                                <li><strong>Доставчици на услуги:</strong> Куриерски компании, платежни процесори, хостинг доставчици</li>
                                <li><strong>Правни изисквания:</strong> Когато се изисква от закона</li>
                                <li><strong>Защита на права:</strong> За защита на нашите права и безопасност</li>
                            </ul>
                            <p className="note">Всички трети страни са задължени да защитават вашата информация и да я използват само за посочените цели.</p>
                        </div>
                    </section>

                    <section className="privacy-section">
                        <h2>5. Cookies и технологии за проследяване</h2>
                        <div className="info-card">
                            <p>Използваме cookies и подобни технологии за:</p>
                            <ul>
                                <li>Запазване на вашите предпочитания</li>
                                <li>Подобряване на функционалността на сайта</li>
                                <li>Анализ на използването на сайта</li>
                                <li>Персонализиране на съдържанието</li>
                            </ul>
                            <p>Можете да контролирате cookies чрез настройките на вашия браузър.</p>
                        </div>
                    </section>

                    <section className="privacy-section">
                        <h2>6. Защита на данните</h2>
                        <div className="info-card">
                            <p>Прилагаме подходящи технически и организационни мерки за защита на вашите данни:</p>
                            <ul>
                                <li>Криптиране на чувствителни данни</li>
                                <li>Регулярни сигурностни проверки</li>
                                <li>Ограничен достъп до лична информация</li>
                                <li>Регулярни резервни копия</li>
                            </ul>
                        </div>
                    </section>

                    <section className="privacy-section">
                        <h2>7. Вашите права</h2>
                        <div className="info-card">
                            <p>Имате право да:</p>
                            <ul>
                                <li>Достъп до вашите лични данни</li>
                                <li>Корекция на неточни данни</li>
                                <li>Изтриване на вашите данни (при определени условия)</li>
                                <li>Ограничаване на обработката</li>
                                <li>Преносимост на данните</li>
                                <li>Възражение срещу обработка</li>
                            </ul>
                            <p>За упражняване на правата си, моля свържете се с нас на: <a href="mailto:privacy@my3dwebshop.com">privacy@my3dwebshop.com</a></p>
                        </div>
                    </section>

                    <section className="privacy-section">
                        <h2>8. Запазване на данни</h2>
                        <div className="info-card">
                            <p>
                                Запазваме вашите данни докато е необходимо за предоставяне на услугите или 
                                докато законът изисква. След това данните се изтриват безопасно.
                            </p>
                        </div>
                    </section>

                    <section className="privacy-section">
                        <h2>9. Промени в политиката</h2>
                        <div className="info-card">
                            <p>
                                Може да актуализираме тази политика от време на време. Ще ви уведомим за 
                                значими промени чрез имейл или уведомление на сайта.
                            </p>
                        </div>
                    </section>

                    <section className="privacy-section">
                        <h2>10. Контакт</h2>
                        <div className="info-card">
                            <p>За въпроси относно тази политика, моля свържете се с нас:</p>
                            <ul>
                                <li>Имейл: <a href="mailto:privacy@my3dwebshop.com">privacy@my3dwebshop.com</a></li>
                                <li>Чрез <Link to="/contact">контактната форма</Link></li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

