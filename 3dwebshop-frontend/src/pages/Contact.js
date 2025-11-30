import { useState, useRef } from "react";
import "./Contact.css";

const faqData = [
    {
        question: "Как мога да направя поръчка?",
        answer: "Добавяте желания продукт в количката → натискате \"Завърши поръчката\" → попълвате данните за доставка.",
    },
    {
        question: "Моделите предварително принтирани ли са или се изработват след поръчка?",
        answer: "Всеки продукт се принтира след поръчка, за да гарантираме най-доброто качество и свеж материал.",
    },
    {
        question: "Колко време отнема изработката и доставката?",
        answer: "Обикновено 1–3 работни дни за принтиране + стандартно време за доставка според куриера.",
    },
    {
        question: "От какъв материал са моделите?",
        answer: "Повечето модели са от PLA — биоразградим, здрав и лесен за поддръжка материал. По желание можем да използваме PETG, ABS или TPU (ако е посочено в продукта).",
    },
    {
        question: "Мога ли да поръчам модел по заявка (custom model)?",
        answer: "Да! Попълнете формата по-горе и изберете \"Индивидуална поръчка\". Ще се свържем с вас за детайли и цена.",
    },
    {
        question: "Какво да направя, ако моделът пристигне повреден?",
        answer: "Свържете се с нас чрез контактната форма или имейл и приложете снимка. Ще изработим нов модел или ще възстановим сумата — вашето удовлетворение е приоритет.",
    },
    {
        question: "Как поддържам 3D принтиран модел?",
        answer: "Избягвайте висока топлина, директно слънце и агресивни химикали. Подходящ е за декорация, аксесоари и функционални елементи (според описанието в продукта).",
    },
    {
        question: "Безопасни ли са моделите за деца?",
        answer: "Декоративните модели са безопасни, но не препоръчваме да се използват като играчки от деца под 7 години (освен ако в описанието не е посочено друго).",
    },
    {
        question: "Работите ли с FDM 3D принтери?",
        answer: "Да — използваме висококачествени FDM принтери (Bambu, Prusa, Creality), които гарантират стабилни слоеве и отлична повърхност.",
    },
    {
        question: "Мога ли да направя промяна по поръчката след приключване?",
        answer: "Ако поръчката все още не е в процес на принтиране — да. Свържете се с нас възможно най-бързо.",
    },
];

// FAQ Icons Grid - Low-poly icons with hover animations
const faqIcons = [
    {
        id: "time",
        title: "Време за изработка",
        faqIndex: 2, // "Колко време отнема изработката и доставката?"
        icon: (
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="faq-icon-svg">
                {/* Low-poly hourglass */}
                <polygon points="30,15 70,15 60,35 40,35" fill="currentColor" fillOpacity="0.1" />
                <polygon points="40,35 60,35 55,50 45,50" fill="currentColor" fillOpacity="0.15" />
                <polygon points="45,50 55,50 50,65 40,65" fill="currentColor" fillOpacity="0.15" />
                <polygon points="30,85 70,85 60,65 40,65" fill="currentColor" fillOpacity="0.1" />
                <line x1="50" y1="35" x2="50" y2="50" />
                <circle cx="50" cy="42" r="2.5" fill="currentColor" />
                <circle cx="50" cy="58" r="3" fill="currentColor" />
            </svg>
        ),
        animationType: "tick-tock",
    },
    {
        id: "materials",
        title: "Материали",
        faqIndex: 3, // "От какъв материал са моделите?"
        icon: (
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="faq-icon-svg">
                {/* Low-poly filament spool */}
                <rect x="35" y="25" width="30" height="50" rx="3" fill="currentColor" fillOpacity="0.1" />
                <circle cx="50" cy="30" r="12" fill="none" />
                <circle cx="50" cy="70" r="12" fill="none" />
                <polygon points="35,30 50,20 65,30 65,45 35,45" fill="currentColor" fillOpacity="0.1" />
                <polygon points="35,55 50,65 65,55 65,70 35,70" fill="currentColor" fillOpacity="0.1" />
                <path d="M 38 35 Q 38 50 42 50 Q 46 50 46 50" className="filament-line" strokeWidth="2" />
                <path d="M 46 50 Q 50 50 50 55 Q 50 60 54 60" className="filament-line" strokeWidth="2" />
                <path d="M 54 60 Q 58 60 62 55" className="filament-line" strokeWidth="2" />
            </svg>
        ),
        animationType: "filament-unwind",
    },
    {
        id: "damaged",
        title: "Повреден модел",
        faqIndex: 5, // "Какво да направя, ако моделът пристигне повреден?"
        icon: (
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="faq-icon-svg">
                {/* Low-poly cracked cube */}
                <rect x="30" y="30" width="40" height="40" fill="currentColor" fillOpacity="0.1" />
                <line x1="30" y1="50" x2="70" y2="50" strokeWidth="2" />
                <line x1="50" y1="30" x2="50" y2="70" strokeWidth="2" />
                <polygon points="30,30 50,30 50,50 30,50" fill="currentColor" fillOpacity="0.05" />
                <polygon points="50,50 70,50 70,70 50,70" fill="currentColor" fillOpacity="0.05" />
                <line x1="35" y1="35" x2="45" y2="45" strokeWidth="2.5" />
                <line x1="55" y1="55" x2="65" y2="65" strokeWidth="2.5" />
                <line x1="40" y1="60" x2="50" y2="70" strokeWidth="2.5" />
                <line x1="60" y1="40" x2="70" y2="50" strokeWidth="2.5" />
            </svg>
        ),
        animationType: "shake",
    },
    {
        id: "custom",
        title: "Индивидуална поръчка",
        faqIndex: 4, // "Мога ли да поръчам модел по заявка (custom model)?"
        icon: (
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="faq-icon-svg">
                {/* Low-poly pencil/CAD line */}
                <polygon points="40,20 60,40 55,45 35,25" fill="currentColor" fillOpacity="0.1" />
                <polygon points="60,40 75,55 80,50" fill="currentColor" fillOpacity="0.05" />
                <polygon points="80,50 85,60 75,65 60,55" fill="currentColor" fillOpacity="0.05" />
                <line x1="60" y1="40" x2="75" y2="55" className="cad-line" />
                <line x1="75" y1="55" x2="80" y2="50" className="cad-line" />
                <line x1="80" y1="50" x2="85" y2="60" className="cad-line" />
                <line x1="85" y1="60" x2="75" y2="65" className="cad-line" />
                <line x1="75" y1="65" x2="60" y2="55" className="cad-line" />
                <line x1="60" y1="55" x2="60" y2="40" className="cad-line" />
                <circle cx="40" cy="20" r="3.5" fill="currentColor" />
            </svg>
        ),
        animationType: "draw-line",
    },
    {
        id: "maintenance",
        title: "Поддръжка",
        faqIndex: 6, // "Как поддържам 3D принтиран модел?"
        icon: (
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="faq-icon-svg">
                {/* Low-poly wrench */}
                <polygon points="25,50 25,40 35,30 45,40 45,50" fill="currentColor" fillOpacity="0.1" />
                <polygon points="45,50 50,55 65,40 60,35" fill="currentColor" fillOpacity="0.1" />
                <circle cx="70" cy="30" r="8" fill="none" />
                <polygon points="70,22 75,25 75,35 70,38 65,35 65,25" fill="currentColor" fillOpacity="0.15" />
                <path d="M 75 25 L 70 30 L 75 35" strokeWidth="3" />
            </svg>
        ),
        animationType: "rotate",
    },
    {
        id: "printers",
        title: "3D принтери",
        faqIndex: 8, // "Работите ли с FDM 3D принтери?"
        icon: (
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="faq-icon-svg">
                {/* Low-poly 3D printer */}
                <rect x="20" y="40" width="60" height="40" rx="2" fill="currentColor" fillOpacity="0.1" />
                <rect x="25" y="45" width="50" height="30" fill="currentColor" fillOpacity="0.05" />
                <rect x="35" y="20" width="30" height="25" rx="1" fill="currentColor" fillOpacity="0.1" />
                <polygon points="30,20 40,20 40,25 30,25" fill="currentColor" fillOpacity="0.15" />
                <polygon points="60,20 70,20 70,25 60,25" fill="currentColor" fillOpacity="0.15" />
                <line x1="50" y1="20" x2="50" y2="15" strokeWidth="3" />
                <circle cx="50" cy="15" r="4" className="nozzle" />
                <rect x="30" y="50" width="5" height="20" fill="currentColor" fillOpacity="0.2" />
                <rect x="65" y="50" width="5" height="20" fill="currentColor" fillOpacity="0.2" />
            </svg>
        ),
        animationType: "nozzle-glow",
    },
];

const contactCards = [
    {
        type: "email",
        label: "Имейл",
        value: "contact@my3dwebshop.com",
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 6l10 6 10-6" />
            </svg>
        ),
    },
    {
        type: "location",
        label: "Локация",
        value: "Пловдив / София / отдалечено",
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
            </svg>
        ),
    },
    {
        type: "phone",
        label: "Телефон",
        value: "+359 XX XXX XXX",
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <path d="M12 18h.01" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        type: "socials",
        label: "Социални мрежи",
        value: "Instagram / GitHub / TikTok",
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8M12 8v8" />
            </svg>
        ),
    },
];

export default function Contact() {
    const [openFaq, setOpenFaq] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [hoveredIcon, setHoveredIcon] = useState(null);
    const faqSectionRef = useRef(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const handleIconClick = (faqIndex) => {
        toggleFaq(faqIndex);
        // Scroll to FAQ section after a short delay
        setTimeout(() => {
            if (faqSectionRef.current) {
                faqSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 100);
    };

    return (
        <div className="contact-page">
            <section className="contact-hero">
                <div className="contact-hero-overlay" />
                <div className="container">
                    <div className="contact-hero-content">
                        <div className="contact-icons-container">
                            <div className="hero-icons-grid">
                                {faqIcons.map((item, index) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className={`hero-faq-icon ${hoveredIcon === index ? "hovered" : ""} ${openFaq === item.faqIndex ? "active" : ""} icon-${item.animationType}`}
                                        onMouseEnter={() => setHoveredIcon(index)}
                                        onMouseLeave={() => setHoveredIcon(null)}
                                        onClick={() => handleIconClick(item.faqIndex)}
                                        aria-label={item.title}
                                        title={item.title}
                                    >
                                        <div className="hero-icon-wrapper">
                                            {item.icon}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="contact-hero-text">
                            <p className="contact-eyebrow">Свържете се с нас</p>
                            <h1>
                                Имате <span className="gradient-text">въпроси</span>?
                            </h1>
                            <p className="contact-subtitle">
                                Открийте отговори на често задаваните въпроси или се свържете директно с нашия екип.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="contact-cards-section">
                <div className="container">
                    <div className="section-headline">
                        <div>
                            <p className="section-eyebrow">Директна връзка</p>
                            <h2>Контактна информация</h2>
                        </div>
                    </div>
                    <div className="contact-cards-grid">
                        {contactCards.map((card, index) => (
                            <div
                                key={card.type}
                                className={`contact-card ${hoveredCard === index ? "hovered" : ""}`}
                                onMouseEnter={() => setHoveredCard(index)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div className="contact-card-icon">{card.icon}</div>
                                <div className="contact-card-content">
                                    <h3>{card.label}</h3>
                                    <p>{card.value}</p>
                                </div>
                                <div className="contact-card-glow" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="faq-section" ref={faqSectionRef}>
                <div className="container">
                    <div className="section-headline">
                        <div>
                            <p className="section-eyebrow">Често задавани въпроси</p>
                            <h2>FAQ</h2>
                        </div>
                    </div>
                    <div className="faq-list">
                        {faqData.map((faq, index) => (
                            <div
                                key={index}
                                className={`faq-item ${openFaq === index ? "open" : ""}`}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <button
                                    type="button"
                                    className="faq-question"
                                    onClick={() => toggleFaq(index)}
                                    aria-expanded={openFaq === index}
                                >
                                    <div className="faq-question-content">
                                        <div className="faq-robot-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="8" width="18" height="12" rx="2" />
                                                <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
                                                <circle cx="12" cy="14" r="1.5" />
                                                <path d="M9 14h6" />
                                            </svg>
                                        </div>
                                        <span className="faq-question-text">{faq.question}</span>
                                    </div>
                                    <div className="faq-arrow">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M6 9l6 6 6-6" />
                                        </svg>
                                    </div>
                                </button>
                                <div className="faq-answer-wrapper">
                                    <div className="faq-answer">
                                        <div className="faq-answer-line" />
                                        <div className="faq-answer-content">
                                            <div className="faq-extruder-icon">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <path d="M12 6v6M12 12l4 4" />
                                                </svg>
                                            </div>
                                            <p>{faq.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
