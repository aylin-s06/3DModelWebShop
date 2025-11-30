import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./RobotLogoNavbar.css";

/**
 * Compact robot logo component for navbar.
 * Displays a simplified 3D robot head with subtle animation and blinking effect.
 */
export default function RobotLogoNavbar() {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const size = 50;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = null; // Transparent
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
        camera.position.set(0, 0, 3);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(size, size);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xff6b00, 1, 100);
        pointLight.position.set(0, 2, 2);
        scene.add(pointLight);

        // Create robot head only
        const headGroup = new THREE.Group();

        // Head (sharp cube - less rounded)
        const headGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.5, 1, 1, 1);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6b00,
            emissive: 0xff6b00,
            emissiveIntensity: 0.3,
            metalness: 0.8,
            roughness: 0.2,
            flatShading: true, // Makes it look sharper/less rounded
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        headGroup.add(head);

        // Eyes (visor - two orange lines)
        const eyeGeometry = new THREE.BoxGeometry(0.35, 0.06, 0.01);
        const eyeMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6b00,
            emissive: 0xff6b00,
            emissiveIntensity: 2,
        });
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.12, 0, 0.26);
        headGroup.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.12, 0, 0.26);
        headGroup.add(rightEye);

        scene.add(headGroup);

        // Subtle rotation animation
        let time = 0;
        const animate = () => {
            time += 0.016;
            headGroup.rotation.y = Math.sin(time * 0.5) * 0.1;
            
            // Blinking effect
            const blinkCycle = Math.sin(time * 2);
            if (blinkCycle < -0.8) {
                leftEye.scale.y = 0.3;
                rightEye.scale.y = 0.3;
            } else {
                leftEye.scale.y = 1;
                rightEye.scale.y = 1;
            }

            renderer.render(scene, camera);
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        const containerElement = containerRef.current;
        const rendererElement = renderer.domElement;
        
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (containerElement && rendererElement && containerElement.contains(rendererElement)) {
                containerElement.removeChild(rendererElement);
            }
            renderer.dispose();
        };
    }, []);

    return <div className="robot-logo-navbar" ref={containerRef}></div>;
}

