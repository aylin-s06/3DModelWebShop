import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./About.css";

export default function About() {
    const [activeStep, setActiveStep] = useState(0);
    const timelineRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        // Copy ref value to variable for cleanup function
        const currentTimeline = timelineRef.current;

        if (currentTimeline) {
            observer.observe(currentTimeline);
        }

        return () => {
            if (currentTimeline) {
                observer.unobserve(currentTimeline);
            }
        };
    }, []);

    const timelineSteps = [
        {
            id: 1,
            title: "Концептуално изкуство",
            description: "Всяка идея започва с концепция. Нашите дизайнери създават уникални визии, които ще оживеят като 3D модели.",
            icon: "✏️",
            color: "#ff6b35",
        },
        {
            id: 2,
            title: "3D Моделиране",
            description: "Преобразуваме концепцията в цифров 3D модел с прецизни геометрии и оптимизирани полигони за печат.",
            icon: "🎨",
            color: "#ff8c42",
        },
        {
            id: 3,
            title: "Разделяне на слоеве",
            description: "Моделът се разделя на слоеве, готов за FDM принтиране. Всеки слой е внимателно калкулиран за оптимален резултат.",
            icon: "📐",
            color: "#ffaa4d",
        },
        {
            id: 4,
            title: "Принтиране",
            description: "3D принтерът екструдира материал слой по слой, създавайки физически обект от цифровия модел.",
            icon: "🖨️",
            color: "#ff6b35",
        },
        {
            id: 5,
            title: "Контрол на качеството",
            description: "Всеки модел преминава строг контрол на качеството, за да гарантираме перфектния резултат.",
            icon: "✅",
            color: "#ff8c42",
        },
        {
            id: 6,
            title: "Качване в уеб магазина",
            description: "Готовият модел се качва в нашия webshop, където ти можеш да го изтеглиш и принтираш.",
            icon: "🚀",
            color: "#ffaa4d",
        },
    ];

    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1 className="about-title">
                        От <span className="gradient-text">идея</span> до{" "}
                        <span className="gradient-text">реалност</span>
                    </h1>
                    <p className="about-subtitle">
                        Разгледай пътя на всеки 3D модел - от първата скица до готовия продукт в твоята количка.
                    </p>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="timeline-section" ref={timelineRef}>
                <div className="container">
                    <h2 className="timeline-title">
                        Пътешествието на един <span className="orange-accent">модел</span>
                    </h2>
                    <p className="timeline-subtitle">
                        Шест стъпки, които трансформират идея в реалност
                    </p>

                    <div className={`timeline ${isVisible ? "visible" : ""}`}>
                        {timelineSteps.map((step, index) => (
                            <div
                                key={step.id}
                                className={`timeline-step ${activeStep === index ? "active" : ""} ${
                                    isVisible ? "animate" : ""
                                }`}
                                style={{ animationDelay: `${index * 0.2}s` }}
                                onMouseEnter={() => setActiveStep(index)}
                            >
                                <div className="step-connector">
                                    <div className="connector-line"></div>
                                    <div className="connector-dot"></div>
                                </div>

                                <div className="step-content">
                                    <div
                                        className="step-icon"
                                        style={{
                                            background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}dd 100%)`,
                                        }}
                                    >
                                        <span className="icon-emoji">{step.icon}</span>
                                        <div className="icon-glow"></div>
                                    </div>

                                    <div className="step-info">
                                        <div className="step-number">0{step.id}</div>
                                        <h3 className="step-title">{step.title}</h3>
                                        <p className="step-description">{step.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="mission-section">
                <div className="container">
                    <div className="mission-grid">
                        <div className="mission-card">
                            <div className="mission-icon">🎯</div>
                            <h3>Нашата мисия</h3>
                            <p>
                                Да направим 3D принтирането достъпно за всеки, като предоставим качествени модели
                                и лесен достъп до тях.
                            </p>
                        </div>
                        <div className="mission-card">
                            <div className="mission-icon">💡</div>
                            <h3>Нашата визия</h3>
                            <p>
                                Бъдещето на създаването е в твоите ръце. Ние сме мостът между твоята креативност
                                и физическата реалност.
                            </p>
                        </div>
                        <div className="mission-card">
                            <div className="mission-icon">⚡</div>
                            <h3>Нашите ценности</h3>
                            <p>
                                Качество, иновация и достъпност. Всеки модел е внимателно избран и тестван за
                                перфектен резултат.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="about-cta">
                <div className="container">
                    <h2>Готов да започнеш?</h2>
                    <p>Разгледай нашата колекция от готови 3D модели</p>
                    <Link to="/catalog" className="btn btn-primary">
                        Разгледай каталога
                    </Link>
                </div>
            </section>
        </div>
    );
}
