import * as THREE from 'three';

const container = document.getElementById('login-canvas-container');

if (container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Geometric Shapes
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshNormalMaterial({ wireframe: true });

    const shapes = [];

    for (let i = 0; i < 5; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = (Math.random() - 0.5) * 10;
        mesh.position.y = (Math.random() - 0.5) * 10;
        mesh.position.z = (Math.random() - 0.5) * 5 - 2;
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;

        // Scale randomization
        const s = Math.random() * 0.5 + 0.5;
        mesh.scale.set(s, s, s);

        scene.add(mesh);
        shapes.push(mesh);
    }

    camera.position.z = 5;

    // Animation
    const animate = () => {
        requestAnimationFrame(animate);

        shapes.forEach(mesh => {
            mesh.rotation.x += 0.002;
            mesh.rotation.y += 0.003;
        });

        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
