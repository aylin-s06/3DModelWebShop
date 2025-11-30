import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./Printer3D.css";

/**
 * 3D Printer animation component using Three.js.
 * Displays an animated 3D printer that prints layers on a build plate.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.animated - Whether to animate the printer
 * @param {string} props.size - Size variant: "small", "medium", "large"
 * @param {boolean} props.autoPlay - Whether to start animation automatically
 */
export default function Printer3D({ 
    animated = true, 
    size = "large",
    autoPlay = true 
}) {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const animationFrameRef = useRef(null);
    const nozzleRef = useRef(null);
    const streamRef = useRef(null);
    const layersRef = useRef([]);
    const timeRef = useRef(0);

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
        // Camera positioned to clearly see bed (Y=0) and layers stacking upward
        // Lower angle to see the alignment between bed and layers better
        camera.position.set(0, 1.5, 7);
        camera.lookAt(0, 0, 0); // Look directly at bed center (Y=0)

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        // Lights - Increased intensity for better visibility
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 3, 100);
        pointLight.position.set(3, 5, 5);
        pointLight.castShadow = true;
        scene.add(pointLight);

        const spotLight = new THREE.SpotLight(0xffffff, 5, 100, Math.PI / 4, 0.5);
        spotLight.position.set(0, 8, 0);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // Additional accent light for printer visibility
        const accentLight = new THREE.PointLight(0xff6b35, 2, 50);
        accentLight.position.set(0, 2, 3);
        scene.add(accentLight);

        // Reference point: Bed top surface = Y = 0 (center of scene)
        const BED_TOP_Y = 0;
        const LAYER_HEIGHT = 0.15;
        const NOZZLE_OFFSET = 0.3; // Distance from layer to nozzle tip

        // Create 3D Printer
        const createPrinter = () => {
            const printerGroup = new THREE.Group();

            // Printer frame (base structure) - Lighter gray for visibility
            const frameGeometry = new THREE.BoxGeometry(3, 2, 2.5);
            const frameMaterial = new THREE.MeshStandardMaterial({
                color: 0x555555,  // Lighter gray
                metalness: 0.5,
                roughness: 0.4,
                emissive: 0x333333,
                emissiveIntensity: 0.1,
            });
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.position.y = -1.05; // Frame bottom, so bed top is at 0
            frame.castShadow = true;
            printerGroup.add(frame);

            // Printer bed (build plate) - Visible metallic surface
            // Bed top surface must be at Y = BED_TOP_Y (0)
            const bedGeometry = new THREE.BoxGeometry(2.5, 0.1, 2.5);
            const bedMaterial = new THREE.MeshStandardMaterial({
                color: 0x666666,  // Lighter for better visibility
                metalness: 0.9,
                roughness: 0.2,
                emissive: 0x444444,
                emissiveIntensity: 0.1, // More visible
            });
            const bed = new THREE.Mesh(bedGeometry, bedMaterial);
            // Bed center Y = -0.05 (half of 0.1 height), so top surface = 0
            // This ensures top surface is exactly at BED_TOP_Y
            bed.position.set(0, BED_TOP_Y - 0.05, 0);
            bed.receiveShadow = true;
            printerGroup.add(bed);
            
            // Add visible border on bed top surface to mark print area
            const bedBorderGeometry = new THREE.PlaneGeometry(2.0, 2.0);
            const bedBorderMaterial = new THREE.MeshStandardMaterial({
                color: 0x888888,
                emissive: 0x333333,
                emissiveIntensity: 0.15,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide,
            });
            const bedBorder = new THREE.Mesh(bedBorderGeometry, bedBorderMaterial);
            bedBorder.rotation.x = -Math.PI / 2;
            bedBorder.position.set(0, BED_TOP_Y + 0.001, 0); // Just above bed surface
            printerGroup.add(bedBorder);

            // Printer gantry (X-axis rail)
            const gantryGeometry = new THREE.BoxGeometry(3, 0.15, 0.15);
            const gantryMaterial = new THREE.MeshStandardMaterial({
                color: 0x666666,  // Lighter gray
                metalness: 0.8,
                roughness: 0.2,
                emissive: 0x333333,
                emissiveIntensity: 0.1,
            });
            const gantry = new THREE.Mesh(gantryGeometry, gantryMaterial);
            gantry.position.set(0, 2, 0);
            printerGroup.add(gantry);

            // Printer columns (Z-axis)
            const columnGeometry = new THREE.BoxGeometry(0.15, 3, 0.15);
            const columnMaterial = new THREE.MeshStandardMaterial({
                color: 0x666666,  // Lighter gray
                metalness: 0.8,
                roughness: 0.2,
                emissive: 0x333333,
                emissiveIntensity: 0.1,
            });
            
            const leftColumn = new THREE.Mesh(columnGeometry, columnMaterial);
            leftColumn.position.set(-1.4, 0.5, -1.2);
            printerGroup.add(leftColumn);

            const rightColumn = new THREE.Mesh(columnGeometry, columnMaterial);
            rightColumn.position.set(1.4, 0.5, -1.2);
            printerGroup.add(rightColumn);

            const backLeftColumn = new THREE.Mesh(columnGeometry, columnMaterial);
            backLeftColumn.position.set(-1.4, 0.5, 1.2);
            printerGroup.add(backLeftColumn);

            const backRightColumn = new THREE.Mesh(columnGeometry, columnMaterial);
            backRightColumn.position.set(1.4, 0.5, 1.2);
            printerGroup.add(backRightColumn);

            scene.add(printerGroup);
            return printerGroup;
        };

        createPrinter();

        // Create Nozzle with movement capability
        const createNozzle = () => {
            const nozzleGroup = new THREE.Group();
            nozzleRef.current = nozzleGroup;

            // Nozzle heating block
            const blockGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
            const blockMaterial = new THREE.MeshStandardMaterial({
                color: 0x2a2a2a,
                metalness: 0.9,
                roughness: 0.1,
            });
            const block = new THREE.Mesh(blockGeometry, blockMaterial);
            nozzleGroup.add(block);

            // Nozzle tip (glowing orange)
            const tipGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.2, 16);
            const tipMaterial = new THREE.MeshStandardMaterial({
                color: 0xff6b35,
                emissive: 0xff6b35,
                emissiveIntensity: 2,
            });
            const tip = new THREE.Mesh(tipGeometry, tipMaterial);
            tip.position.y = -0.25;
            tip.rotation.z = Math.PI / 2;
            nozzleGroup.add(tip);

            // Heat break (thin tube)
            const breakGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.3, 16);
            const breakMaterial = new THREE.MeshStandardMaterial({
                color: 0x444444,
                metalness: 0.8,
                roughness: 0.2,
            });
            const heatBreak = new THREE.Mesh(breakGeometry, breakMaterial);
            heatBreak.position.y = 0.15;
            heatBreak.rotation.z = Math.PI / 2;
            nozzleGroup.add(heatBreak);

            // Initial position (above printer, will descend to first layer)
            // Start high, will animate down to first layer position
            nozzleGroup.position.set(0, BED_TOP_Y + 3, 0);
            nozzleGroup.visible = true;
            scene.add(nozzleGroup);

            return nozzleGroup;
        };

        createNozzle();

        // Create Filament Stream
        const createFilamentStream = () => {
            const streamGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
            const streamMaterial = new THREE.MeshStandardMaterial({
                color: 0xff6b35,
                emissive: 0xff6b35,
                emissiveIntensity: 1.5,
                transparent: true,
                opacity: 0.9,
            });
            const stream = new THREE.Mesh(streamGeometry, streamMaterial);
            stream.rotation.z = Math.PI / 2;
            stream.visible = false;
            streamRef.current = stream;
            nozzleRef.current.add(stream);
            scene.add(stream);
            return stream;
        };

        createFilamentStream();

        // Create Printing Layers (flat planes that stack) - Perfectly aligned with bed
        const createLayers = () => {
            const layers = [];
            const layerCount = 30; // More layers for smoother effect
            
            // Bed dimensions: 2.5 x 2.5, so we print inside bounds (leave margin)
            const printAreaSize = 1.8; // Smaller than bed to stay within bounds

            for (let i = 0; i < layerCount; i++) {
                const layerGeometry = new THREE.PlaneGeometry(printAreaSize, printAreaSize);
                const layerMaterial = new THREE.MeshStandardMaterial({
                    color: 0xe8e8e8,
                    emissive: 0xff6b35,
                    emissiveIntensity: 0.2,
                    transparent: true,
                    opacity: 0,
                    side: THREE.DoubleSide,
                });
                const layer = new THREE.Mesh(layerGeometry, layerMaterial);
                layer.rotation.x = -Math.PI / 2;
                
                // PERFECT ALIGNMENT: First layer starts exactly on bed top surface
                // Plane geometry is centered, so for the layer to start at bed top:
                // - Layer bottom = layerCenter - LAYER_HEIGHT/2 = BED_TOP_Y
                // - Therefore: layerCenter = BED_TOP_Y + LAYER_HEIGHT/2
                // - Next layers: layerCenter = BED_TOP_Y + (layerIndex * LAYER_HEIGHT) + LAYER_HEIGHT/2
                const layerCenterY = BED_TOP_Y + (i * LAYER_HEIGHT) + (LAYER_HEIGHT / 2);
                layer.position.y = layerCenterY;
                layer.position.x = 0; // Centered on bed
                layer.position.z = 0; // Centered on bed
                layer.visible = false;
                layer.castShadow = true;
                layer.receiveShadow = true;
                scene.add(layer);
                layers.push(layer);
            }

            layersRef.current = layers;
            return layers;
        };

        createLayers();

        // Animation loop
        let time = 0;
        let currentLayerIndex = 0;
        let layerPrintProgress = 0;
        let isPrinting = false;

        const animate = () => {
            if (!animated || !autoPlay) {
                // Static mode - slight idle movement
                if (nozzleRef.current) {
                    nozzleRef.current.rotation.y += 0.002;
                }
                renderer.render(scene, camera);
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }

            time += 0.016;
            timeRef.current = time;

            // Phase 1: Nozzle descends to first layer printing position
            if (time < 1.5) {
                if (nozzleRef.current && layersRef.current.length > 0) {
                    // Target: First layer position + nozzle offset
                    const firstLayer = layersRef.current[0];
                    const targetY = firstLayer.position.y + NOZZLE_OFFSET;
                    const currentY = nozzleRef.current.position.y;
                    if (currentY > targetY) {
                        nozzleRef.current.position.y = Math.max(targetY, currentY - 0.08);
                    }
                    // Show filament stream
                    if (streamRef.current && currentY < firstLayer.position.y + 1) {
                        streamRef.current.visible = true;
                        const distanceToLayer = currentY - firstLayer.position.y;
                        streamRef.current.scale.y = Math.max(0.2, distanceToLayer);
                        streamRef.current.position.y = -0.15;
                    }
                    // Nozzle tip glow pulse
                    if (nozzleRef.current.children[1]) {
                        nozzleRef.current.children[1].material.emissiveIntensity = 2 + Math.sin(time * 10) * 0.5;
                    }
                }
            }
            // Phase 2: Start printing layers
            else if (time < 1.5 + (layersRef.current.length * 0.3)) {
                isPrinting = true;
                const printTime = time - 1.5;
                currentLayerIndex = Math.floor(printTime / 0.3);
                layerPrintProgress = (printTime % 0.3) / 0.3;

                if (currentLayerIndex < layersRef.current.length) {
                    const currentLayer = layersRef.current[currentLayerIndex];
                    if (currentLayer) {
                        // Make layer visible
                        currentLayer.visible = true;
                        
                        // Realistic printing pattern: square/rectangular path within bed bounds
                        // Bed is 2.5 x 2.5, print area is 1.8 x 1.8 (centered at 0,0)
                        // So nozzle can move from -0.9 to 0.9 on X and Z axes
                        const printAreaBounds = 0.9; // Half of 1.8
                        const patternProgress = layerPrintProgress;
                        
                        // Realistic rectangular path: start at corner, move in square pattern
                        let xOffset = 0;
                        let zOffset = 0;
                        
                        if (patternProgress < 0.25) {
                            // Bottom edge: left to right
                            const edgeProgress = patternProgress / 0.25;
                            xOffset = -printAreaBounds + (edgeProgress * printAreaBounds * 2);
                            zOffset = -printAreaBounds;
                        } else if (patternProgress < 0.5) {
                            // Right edge: bottom to top
                            const edgeProgress = (patternProgress - 0.25) / 0.25;
                            xOffset = printAreaBounds;
                            zOffset = -printAreaBounds + (edgeProgress * printAreaBounds * 2);
                        } else if (patternProgress < 0.75) {
                            // Top edge: right to left
                            const edgeProgress = (patternProgress - 0.5) / 0.25;
                            xOffset = printAreaBounds - (edgeProgress * printAreaBounds * 2);
                            zOffset = printAreaBounds;
                        } else {
                            // Left edge: top to bottom
                            const edgeProgress = (patternProgress - 0.75) / 0.25;
                            xOffset = -printAreaBounds;
                            zOffset = printAreaBounds - (edgeProgress * printAreaBounds * 2);
                        }
                        
                        // Move nozzle along printing path (within bed bounds)
                        // PERFECT ALIGNMENT: Nozzle always at layerY + NOZZLE_OFFSET
                        if (nozzleRef.current) {
                            nozzleRef.current.position.x = xOffset;
                            nozzleRef.current.position.z = zOffset;
                            // Formula: layerY + nozzleOffset (exactly above current layer)
                            nozzleRef.current.position.y = currentLayer.position.y + NOZZLE_OFFSET;
                            
                            // Vibrate nozzle slightly
                            nozzleRef.current.rotation.z = Math.sin(time * 30) * 0.03;
                            
                            // Filament stream follows nozzle, connecting to layer
                            if (streamRef.current) {
                                streamRef.current.visible = true;
                                const streamLength = NOZZLE_OFFSET;
                                streamRef.current.scale.y = streamLength;
                                streamRef.current.position.y = -NOZZLE_OFFSET * 0.5; // Center of stream
                            }
                        }

                        // Layer material fades in as nozzle moves
                        currentLayer.material.opacity = Math.min(1, patternProgress * 1.5);
                        
                        // Add slight layer glow
                        currentLayer.material.emissiveIntensity = 0.2 + (patternProgress * 0.3);
                    }

                    // Complete previous layers
                    for (let i = 0; i < currentLayerIndex; i++) {
                        const layer = layersRef.current[i];
                        if (layer) {
                            layer.material.opacity = 1;
                            layer.material.emissiveIntensity = 0.15;
                        }
                    }
                }
            }
            // Phase 3: Finish printing, nozzle retracts
            else {
                // Complete all layers
                layersRef.current.forEach(layer => {
                    if (layer) {
                        layer.material.opacity = 1;
                        layer.material.emissiveIntensity = 0.1;
                    }
                });

                // Retract nozzle
                if (nozzleRef.current) {
                    const retractProgress = (time - (1.5 + layersRef.current.length * 0.3)) / 1;
                    if (retractProgress < 1) {
                        nozzleRef.current.position.y += 0.05;
                        nozzleRef.current.position.x *= 0.98;
                        nozzleRef.current.position.z *= 0.98;
                        
                        // Fade out filament stream
                        if (streamRef.current) {
                            streamRef.current.material.opacity = Math.max(0, 0.9 - retractProgress);
                        }
                        
                        // Fade out nozzle glow
                        if (nozzleRef.current.children[1]) {
                            nozzleRef.current.children[1].material.emissiveIntensity = Math.max(0, 2 - retractProgress * 2);
                        }
                    } else {
                        if (streamRef.current) {
                            streamRef.current.visible = false;
                        }
                    }
                }
            }

            // Continuous rotation for visual interest
            if (nozzleRef.current && isPrinting) {
                nozzleRef.current.rotation.y += 0.001;
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
        <div className={`printer-3d printer-3d-${size}`} ref={containerRef} />
    );
}

