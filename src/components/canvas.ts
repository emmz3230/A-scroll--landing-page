import * as THREE from 'three';
import { Dimensions, Size } from '../types/types';
import vertexShader from '../shaders/vertex.glsl';
import fragmentShader from '../shaders/fragment.glsl';
import Media from './media';

// createCanvas function: This initializes and configures the scene,
//  camera, renderer, and other elements just like in the class-based approach.
function createCanvas() {
  const element = document.getElementById('webgl') as HTMLCanvasElement;
  const time = 0;
  const medias: Media[] = [];
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 10;
  scene.add(camera);

  const clock = new THREE.Clock();
  
  let dimensions: Dimensions = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(2, window.devicePixelRatio),
  };

  const renderer = new THREE.WebGLRenderer({ canvas: element, alpha: true });
  renderer.setSize(dimensions.width, dimensions.height);
  renderer.setPixelRatio(dimensions.pixelRatio);

  let sizes: Size;
  function setSizes() {
    const fov = camera.fov * (Math.PI / 180);
    const height = camera.position.z * Math.tan(fov / 2) * 2;
    const width = height * camera.aspect;

    sizes = { width, height };
  }

  // setSizes and onResize: These functions handle sizing and resizing, 
  // ensuring the scene adapts to window changes.

  function onResize() {
    dimensions = {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(2, window.devicePixelRatio),
    };

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    setSizes();

    renderer.setPixelRatio(dimensions.pixelRatio);
    renderer.setSize(dimensions.width, dimensions.height);

    medias.forEach((media) => media.onResize(sizes));
  }


  // createMedias and render: These functions handle media creation and rendering, respectively.

  function createMedias() {
    const images = document.querySelectorAll('img');
    images.forEach((image) => {
      const media = new Media({
        element: image,
        scene: scene,
        sizes: sizes,
      });

      medias.push(media);
    });
  }

  function render(scroll: number) {
    const elapsedTime = clock.getElapsedTime();
    
    medias.forEach((media) => {
      media.updateScroll(scroll);
    });

    renderer.render(scene, camera);
  }

  // createDebugMesh: Adds a debug mesh to the scene, useful for testing or development.
  function createDebugMesh() {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      new THREE.ShaderMaterial({ vertexShader, fragmentShader })
    );
    scene.add(mesh);
  }

  setSizes();
  createMedias();

  window.addEventListener('resize', onResize);

  return {
    render,
    getTime: () => clock.getElapsedTime(),
  };
}

export default createCanvas;