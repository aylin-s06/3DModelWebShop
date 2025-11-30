import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./RobotLogo.css";

/**
 * Robot logo component with 3D printing animation using Three.js.
 * Displays a robot being "printed" layer by layer, then shows logo text.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.animated - Whether to animate the robot
 * @param {string} props.size - Size variant: "small", "medium", "large"
 * @param {boolean} props.showText - Whether to show "MY3D webshop" text
 * @param {boolean} props.autoPlay - Whether to start animation automatically
 */
export default function RobotLogo({ 
    animated = true, 
    size = "large", 
    showText = true,
    autoPlay = true 
}) {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const animationFrameRef = useRef(null);
    const nozzleRef = useRef(null);
    const robotRef = useRef(null);
    const layersRef = useRef([]);
    const currentLayerRef = useRef(0);
    const animationPhaseRef = useRef(0); // 0: nozzle appears, 1: printing, 2: fade layers, 3: show text
    const logoTextRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0d0d0d);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.set(0, 2, 8);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xff6b00, 1, 100);
        pointLight.position.set(0, 5, 5);
        scene.add(pointLight);

        const spotLight = new THREE.SpotLight(0xff6b00, 2);
        spotLight.position.set(0, 8, 0);
        spotLight.angle = Math.PI / 6;
        spotLight.penumbra = 0.5;
        scene.add(spotLight);

        // Create low-poly robot geometry
        const createRobotGeometry = () => {
            const robotGroup = new THREE.Group();
            robotRef.current = robotGroup;

            // Body (trapezoid shape - V form)
            const bodyShape = new THREE.Shape();
            bodyShape.moveTo(-0.3, -1);
            bodyShape.lineTo(0.3, -1);
            bodyShape.lineTo(0.4, 0.5);
            bodyShape.lineTo(-0.4, 0.5);
            bodyShape.lineTo(-0.3, -1);

            const bodyGeometry = new THREE.ExtrudeGeometry(bodyShape, {
                depth: 0.3,
                bevelEnabled: false,
            });
            const bodyMaterial = new THREE.MeshStandardMaterial({
                color: 0xff6b00,
                emissive: 0xff6b00,
                emissiveIntensity: 0.3,
                metalness: 0.8,
                roughness: 0.2,
            });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.position.y = 0;
            robotGroup.add(body);

            // Head (hexagon/cube)
            const headGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.4);
            const headMaterial = new THREE.MeshStandardMaterial({
                color: 0xff6b00,
                emissive: 0xff6b00,
                emissiveIntensity: 0.3,
                metalness: 0.8,
                roughness: 0.2,
            });
            const head = new THREE.Mesh(headGeometry, headMaterial);
            head.position.set(0, 1.2, 0);
            robotGroup.add(head);

            // Eyes (visor - two orange lines)
            const eyeGeometry = new THREE.BoxGeometry(0.3, 0.05, 0.01);
            const eyeMaterial = new THREE.MeshStandardMaterial({
                color: 0xff6b00,
                emissive: 0xff6b00,
                emissiveIntensity: 2,
            });
            const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            leftEye.position.set(-0.1, 1.2, 0.21);
            robotGroup.add(leftEye);

            const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            rightEye.position.set(0.1, 1.2, 0.21);
            robotGroup.add(rightEye);

            // Arms (simplified - attached to body)
            const armGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.15);
            const armMaterial = new THREE.MeshStandardMaterial({
                color: 0xff6b00,
                emissive: 0xff6b00,
                emissiveIntensity: 0.3,
            });
            const leftArm = new THREE.Mesh(armGeometry, armMaterial);
            leftArm.position.set(-0.5, 0.2, 0);
            robotGroup.add(leftArm);

            const rightArm = new THREE.Mesh(armGeometry, armMaterial);
            rightArm.position.set(0.5, 0.2, 0);
            robotGroup.add(rightArm);

            // Legs
            const legGeometry = new THREE.BoxGeometry(0.2, 0.8, 0.2);
            const legMaterial = new THREE.MeshStandardMaterial({
                color: 0xff6b00,
                emissive: 0xff6b00,
                emissiveIntensity: 0.3,
            });
            const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
            leftLeg.position.set(-0.2, -1.2, 0);
            robotGroup.add(leftLeg);

            const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
            rightLeg.position.set(0.2, -1.2, 0);
            robotGroup.add(rightLeg);

            // Orange accent points on shoulders
            const accentGeometry = new THREE.SphereGeometry(0.05, 8, 8);
            const accentMaterial = new THREE.MeshStandardMaterial({
                color: 0xff6b00,
                emissive: 0xff6b00,
                emissiveIntensity: 1.5,
            });
            const leftAccent = new THREE.Mesh(accentGeometry, accentMaterial);
            leftAccent.position.set(-0.4, 0.6, 0.16);
            robotGroup.add(leftAccent);

            const rightAccent = new THREE.Mesh(accentGeometry, accentMaterial);
            rightAccent.position.set(0.4, 0.6, 0.16);
            robotGroup.add(rightAccent);

            // Initially hide robot
            robotGroup.visible = false;
            robotGroup.scale.set(0, 0, 0);
            scene.add(robotGroup);

            return robotGroup;
        };

        // Create nozzle
        let nozzleTipRef = null;
        const createNozzle = () => {
            const nozzleGroup = new THREE.Group();
            nozzleRef.current = nozzleGroup;

            // Nozzle body
            const nozzleBodyGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.3, 8);
            const nozzleBodyMaterial = new THREE.MeshStandardMaterial({
                color: 0x1a1a1a,
                metalness: 0.9,
                roughness: 0.1,
            });
            const nozzleBody = new THREE.Mesh(nozzleBodyGeometry, nozzleBodyMaterial);
            nozzleGroup.add(nozzleBody);

            // Hot tip (glowing orange)
            const tipGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 8);
            const tipMaterial = new THREE.MeshStandardMaterial({
                color: 0xff6b00,
                emissive: 0xff6b00,
                emissiveIntensity: 3,
            });
            const tip = new THREE.Mesh(tipGeometry, tipMaterial);
            tip.position.y = -0.2;
            nozzleGroup.add(tip);
            nozzleTipRef = tip; // Store reference to tip for material access

            // Initially position above
            nozzleGroup.position.set(1.5, 5, 0);
            nozzleGroup.visible = false;
            scene.add(nozzleGroup);
        };

        createRobotGeometry();
        createNozzle();

        // Create layers for printing effect
        const createLayers = () => {
            const layers = [];
            const layerCount = 20; // Number of printing layers

            for (let i = 0; i < layerCount; i++) {
                const layerHeight = -1.5 + (i * 0.15);
                const layerGeometry = new THREE.PlaneGeometry(1, 0.15);
                const layerMaterial = new THREE.MeshStandardMaterial({
                    color: 0xff6b00,
                    emissive: 0xff6b00,
                    emissiveIntensity: 1,
                    transparent: true,
                    opacity: 0,
                    side: THREE.DoubleSide,
                });
                const layer = new THREE.Mesh(layerGeometry, layerMaterial);
                layer.position.set(0, layerHeight, 0);
                layer.rotation.x = Math.PI / 2;
                layer.visible = false;
                scene.add(layer);
                layers.push(layer);
            }

            layersRef.current = layers;
        };

        createLayers();

        // Animation
        let time = 0;
        const animate = () => {
            if (!animated || !autoPlay) {
                // Static mode - just rotate slightly
                if (robotRef.current) {
                    robotRef.current.rotation.y += 0.005;
                }
                renderer.render(scene, camera);
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }

            time += 0.016; // ~60fps

            // Phase 0: Nozzle appears and descends
            if (animationPhaseRef.current === 0) {
                if (nozzleRef.current) {
                    nozzleRef.current.visible = true;
                    const targetY = 3;
                    const currentY = nozzleRef.current.position.y;
                    if (currentY > targetY) {
                        nozzleRef.current.position.y -= 0.1;
                    } else {
                        animationPhaseRef.current = 1;
                        currentLayerRef.current = 0;
                    }
                    // Vibrate nozzle
                    nozzleRef.current.rotation.z = Math.sin(time * 20) * 0.05;
                }
            }

            // Phase 1: Printing layers
            if (animationPhaseRef.current === 1) {
                if (nozzleRef.current && layersRef.current.length > 0) {
                    const currentLayer = layersRef.current[currentLayerRef.current];
                    if (currentLayer) {
                        currentLayer.visible = true;
                        currentLayer.material.opacity = Math.min(1, currentLayer.material.opacity + 0.1);
                        
                        // Move nozzle along layer
                        const layerProgress = (time * 2) % 1;
                        nozzleRef.current.position.x = Math.sin(layerProgress * Math.PI * 2) * 0.8;
                        nozzleRef.current.position.y = currentLayer.position.y + 0.2;
                        nozzleRef.current.rotation.z = Math.sin(time * 20) * 0.05;

                        // Move to next layer
                        if (currentLayer.material.opacity >= 1 && layerProgress > 0.9) {
                            currentLayerRef.current++;
                            if (currentLayerRef.current >= layersRef.current.length) {
                                animationPhaseRef.current = 2;
                            }
                        }
                    }
                }
            }

            // Phase 2: Finish printing, fade layers and retract nozzle
            if (animationPhaseRef.current === 2) {
                if (nozzleRef.current) {
                    nozzleRef.current.position.x += 0.1;
                    nozzleRef.current.position.y += 0.1;
                    // Fade out tip glow
                    if (nozzleTipRef && nozzleTipRef.material) {
                        nozzleTipRef.material.emissiveIntensity = Math.max(0, nozzleTipRef.material.emissiveIntensity * 0.95);
                    }
                    if (nozzleRef.current.position.y > 6) {
                        nozzleRef.current.visible = false;
                    }
                }

                // Fade out layers
                let allLayersFaded = true;
                layersRef.current.forEach((layer, index) => {
                    if (layer.material.opacity > 0) {
                        layer.material.opacity = Math.max(0, layer.material.opacity - 0.03);
                        allLayersFaded = false;
                    }
                });

                // After layers fade, move to phase 3 (show text)
                if (allLayersFaded && nozzleRef.current && !nozzleRef.current.visible) {
                    animationPhaseRef.current = 3;
                }
            }

            // Phase 3: Show MY3D WebShop text attractively
            if (animationPhaseRef.current === 3) {
                if (logoTextRef.current) {
                    const textElement = logoTextRef.current;
                    const currentOpacity = parseFloat(textElement.style.opacity) || 0;
                    if (currentOpacity < 1) {
                        textElement.style.opacity = Math.min(1, currentOpacity + 0.02);
                    }
                    
                    // Add scale animation
                    const currentScale = parseFloat(textElement.style.transform.match(/scale\(([\d.]+)\)/)?.[1]) || 0;
                    if (currentScale < 1) {
                        const newScale = Math.min(1, currentScale + 0.03);
                        textElement.style.transform = `scale(${newScale})`;
                    }
                }
            }

            renderer.render(scene, camera);
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            if (!containerRef.current) return;
            const newWidth = containerRef.current.clientWidth;
            const newHeight = containerRef.current.clientHeight;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        };

        window.addEventListener("resize", handleResize);

        // Cleanup
        const containerElement = containerRef.current;
        const rendererElement = renderer.domElement;
        
        return () => {
            window.removeEventListener("resize", handleResize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (containerElement && rendererElement && containerElement.contains(rendererElement)) {
                containerElement.removeChild(rendererElement);
            }
            renderer.dispose();
        };
    }, [animated, autoPlay]);

    return (
        <div className={`robot-logo robot-logo-${size}`} ref={containerRef}>
            {showText && (
                <div 
                    className="robot-logo-text" 
                    ref={logoTextRef}
                    style={{
                        opacity: 0,
                        transform: 'scale(0.8)',
                        transition: 'opacity 0.3s ease, transform 0.3s ease'
                    }}
                >
                    <span className="logo-main">MY3D</span>
                    <span className="logo-accent">webshop</span>
                </div>
            )}
        </div>
    );
}

