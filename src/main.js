import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll reveals: each content group enters as it reaches the viewport.
if (!reduceMotion) {
  gsap.utils.toArray('.reveal').forEach((element) => {
    gsap.fromTo(element,
      { autoAlpha: 0, y: 42, rotateX: 4 },
      {
        autoAlpha: 1, y: 0, rotateX: 0,
        duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 86%', once: true }
      }
    );
  });

  gsap.from('.hero-portrait-wrap', {
    autoAlpha: 0, x: -35, duration: 1.1, delay: 0.15, ease: 'power3.out'
  });
  gsap.from('.hero-copy > *', {
    autoAlpha: 0, y: 22, duration: 0.8, stagger: 0.12, delay: 0.35, ease: 'power3.out'
  });
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
}

// Cursor aura is decorative only; disabled on touch and reduced-motion devices.
const aura = document.querySelector('.cursor-aura');
if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    aura.style.transform = `translate(${event.clientX - 140}px, ${event.clientY - 140}px)`;
  }, { passive: true });
}

// Small pixel field in the opening scene.
const pixelField = document.querySelector('.hero-pixel-field');
if (pixelField && !reduceMotion) {
  for (let i = 0; i < 34; i++) {
    const pixel = document.createElement('i');
    pixel.style.left = `${Math.random() * 100}%`;
    pixel.style.top = `${Math.random() * 100}%`;
    pixel.style.setProperty('--delay', `${Math.random() * 5}s`);
    pixel.style.setProperty('--duration', `${3 + Math.random() * 5}s`);
    pixelField.appendChild(pixel);
  }
}

// Capability section: real 3D objects, not flat rotating images.
const canvas = document.querySelector('#three-canvas');
const section = document.querySelector('.capabilities');
let renderer, scene, camera, objects = [], frameId = 0;

function initThree() {
  if (!canvas || !section || reduceMotion) return;

  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setSize(section.clientWidth, section.clientHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(38, section.clientWidth / section.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 10);

    scene.add(new THREE.AmbientLight(0xffffff, 1.7));
    const keyLight = new THREE.PointLight(0xff3045, 35, 30);
    keyLight.position.set(3, 4, 6);
    scene.add(keyLight);
    const fillLight = new THREE.PointLight(0xffffff, 16, 25);
    fillLight.position.set(-4, -2, 5);
    scene.add(fillLight);

    const redMetal = new THREE.MeshStandardMaterial({
      color: 0x9d1727, metalness: 0.78, roughness: 0.24
    });
    const paleMetal = new THREE.MeshStandardMaterial({
      color: 0xd8d4d0, metalness: 0.82, roughness: 0.2
    });
    const darkGlass = new THREE.MeshPhysicalMaterial({
      color: 0x3b1118, metalness: 0.35, roughness: 0.12,
      transmission: 0.35, thickness: 1.1, transparent: true
    });

    const cube = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.05, 1.05), redMetal);
    cube.position.set(-3.7, 0.3, 0);
    scene.add(cube);
    objects.push({ mesh: cube, rx: 0.25, ry: 0.45 });

    const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.58, 0.18, 120, 16), paleMetal);
    knot.position.set(-1.25, -0.2, 0);
    scene.add(knot);
    objects.push({ mesh: knot, rx: 0.18, ry: 0.3 });

    const drop = new THREE.Mesh(new THREE.SphereGeometry(0.72, 48, 48), darkGlass);
    drop.scale.set(0.72, 1.05, 0.72);
    drop.position.set(1.2, 0.25, 0);
    scene.add(drop);
    objects.push({ mesh: drop, rx: 0.2, ry: 0.35 });

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.13, 24, 90), redMetal);
    ring.rotation.set(0.8, 0.3, 0.2);
    ring.position.set(3.7, -0.1, 0);
    scene.add(ring);
    objects.push({ mesh: ring, rx: 0.3, ry: 0.24 });

    const resize = () => {
      if (!renderer) return;
      const w = section.clientWidth;
      const h = section.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = w < 700 ? 12.5 : 10;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    const clock = new THREE.Clock();
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      objects.forEach((item, index) => {
        item.mesh.rotation.x += 0.0025 * item.rx;
        item.mesh.rotation.y += 0.003 * item.ry;
        item.mesh.position.y += Math.sin(t * 0.7 + index) * 0.0009;
      });
      renderer.render(scene, camera);
    };
    animate();
  } catch (error) {
    console.warn('3D scene could not start. The rest of the portfolio will still work.', error);
    canvas.style.display = 'none';
  }
}
initThree();

// Mobile navigation.
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuButton?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('nav-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.textContent = isOpen ? '×' : '＋';
});
nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('nav-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    if (menuButton) menuButton.textContent = '＋';
  });
});

window.addEventListener('beforeunload', () => {
  cancelAnimationFrame(frameId);
  renderer?.dispose();
});
