import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Hero3DCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 420;

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for mouse interaction and smooth rotation
    const group = new THREE.Group();
    scene.add(group);

    // Main Central 3D Geometry (Knowledge Crystal / Icosahedron)
    const geometry = new THREE.IcosahedronGeometry(1.6, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6, // Vibrant purple
      emissive: 0x6d28d9, // Violet luminescence
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.3,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const mainMesh = new THREE.Mesh(geometry, material);
    group.add(mainMesh);

    // Inner Glowing Core (Cyan Knowledge Node)
    const coreGeometry = new THREE.OctahedronGeometry(0.85, 0);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x06b6d4, // Cyan
      emissive: 0x0891b2,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.4,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(coreMesh);

    // Orbital Rings (Mathematically scaled to fit inside viewport without edge clipping)
    const ringGeometry = new THREE.TorusGeometry(2.25, 0.024, 16, 120);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.4,
      transparent: true,
      opacity: 0.85,
    });

    const ringMesh1 = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh1.rotation.x = Math.PI / 3;
    group.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh2.rotation.y = Math.PI / 3.5;
    ringMesh2.scale.set(1.1, 1.1, 1.1);
    group.add(ringMesh2);

    // Floating Star / Knowledge Particle Dust
    const particlesCount = 140;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;
      positions[i + 1] = (Math.random() - 0.5) * 8;
      positions[i + 2] = (Math.random() - 0.5) * 6;

      if (Math.random() > 0.5) {
        colors[i] = 0.55; // R
        colors[i + 1] = 0.36; // G
        colors[i + 2] = 0.96; // B (Violet)
      } else {
        colors[i] = 0.06;
        colors[i + 1] = 0.75;
        colors[i + 2] = 0.88; // Cyan
      }
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Lighting (Warm and bright so elements never look black or dull)
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight.position.set(5, 10, 8);
    scene.add(dirLight);

    const pointLight1 = new THREE.PointLight(0xa855f7, 6, 40);
    pointLight1.position.set(4, 4, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 5, 40);
    pointLight2.position.set(-4, -4, 3);
    scene.add(pointLight2);

    // Dynamic Camera Distance Auto-Framing Function:
    // Calculates the exact distance needed to guarantee the entire object + orbital rings
    // never get clipped or cut off horizontally on narrow or mobile screens.
    const updateFraming = () => {
      if (!container) return;
      const w = container.clientWidth || 360;
      const h = container.clientHeight || 420;
      const aspect = w / h;
      camera.aspect = aspect;

      // Vertical FOV in radians
      const vFovRad = (camera.fov * Math.PI) / 360;
      const tanV = Math.tan(vFovRad);
      const tanH = tanV * aspect;

      // Maximum bounding radius of rotating rings + slight mouse tilt allowance
      const boundingRadius = 2.65;
      const distV = boundingRadius / tanV;
      const distH = boundingRadius / tanH;

      // Add 20% margin to ensure rings never touch the viewport borders
      camera.position.z = Math.max(distV, distH) * 1.2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    updateFraming();

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      mouseX = (x / (container.clientWidth || 1) - 0.5) * 2;
      mouseY = -(y / (container.clientHeight || 1) - 0.5) * 2;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', updateFraming);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      group.rotation.y = elapsedTime * 0.28 + targetX * 0.6;
      group.rotation.x = Math.sin(elapsedTime * 0.18) * 0.15 - targetY * 0.6;

      coreMesh.rotation.y = -elapsedTime * 0.5;
      coreMesh.rotation.z = elapsedTime * 0.25;

      ringMesh1.rotation.z = elapsedTime * 0.18;
      ringMesh2.rotation.x = -elapsedTime * 0.14;

      particlesMesh.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', updateFraming);
      cancelAnimationFrame(animationFrameId);

      renderer.dispose();
      geometry.dispose();
      material.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full min-h-[300px] sm:min-h-[380px] lg:min-h-[460px] relative pointer-events-none flex items-center justify-center"
      aria-hidden="true"
    />
  );
};

export default Hero3DCanvas;
