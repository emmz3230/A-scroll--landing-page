import * as THREE from "three";
import gsap from "gsap";
import { Position, Size } from "../types/types";
import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";

// createMedia function: This encapsulates all the logic for setting up a media element with a 3D mesh in a Three.js scene.
function createMedia({
  element,
  scene,
  sizes,
}: {
  element: HTMLImageElement;
  scene: THREE.Scene;
  sizes: Size;
}) {
  let currentScroll = 0;
  let lastScroll = 0;
  let scrollSpeed = 0;

  let geometry: THREE.PlaneGeometry;
  let material: THREE.ShaderMaterial;
  let mesh: THREE.Mesh;
  let nodeDimensions: Size;
  let meshDimensions: Size;
  let meshPosition: Position;
  let elementBounds: DOMRect;
  let observer: IntersectionObserver;

  // createGeometry, createMaterial, createMesh: Functions to create the necessary Three.js objects.
  function createGeometry() {
    geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  }

  function createMaterial() {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: new THREE.Uniform(new THREE.Vector4()),
        uResolution: new THREE.Uniform(new THREE.Vector2(0, 0)),
        uProgress: new THREE.Uniform(0),
        uColor: new THREE.Uniform(new THREE.Color("#242424")),
      },
    });
  }

  function createMesh() {
    mesh = new THREE.Mesh(geometry, material);
  }
  // setNodeBounds, setMeshDimensions, setMeshPosition: Handle positioning and sizing of the mesh.
  function setNodeBounds() {
    elementBounds = element.getBoundingClientRect();

    nodeDimensions = {
      width: elementBounds.width,
      height: elementBounds.height,
    };
  }

  function setMeshDimensions() {
    meshDimensions = {
      width: (nodeDimensions.width * sizes.width) / window.innerWidth,
      height:
        (nodeDimensions.height * sizes.height) / window.innerHeight,
    };

    mesh.scale.x = meshDimensions.width;
    mesh.scale.y = meshDimensions.height;
  }

  function setMeshPosition() {
    meshPosition = {
      x: (elementBounds.left * sizes.width) / window.innerWidth,
      y: (-elementBounds.top * sizes.height) / window.innerHeight,
    };

    meshPosition.x -= sizes.width / 2;
    meshPosition.x += meshDimensions.width / 2;

    meshPosition.y -= meshDimensions.height / 2;
    meshPosition.y += sizes.height / 2;

    mesh.position.x = meshPosition.x;
    mesh.position.y = meshPosition.y;
  }

  // setTexture: Loads the texture and observes when the element is visible on the screen.
  function setTexture() {
    material.uniforms.uTexture.value = new THREE.TextureLoader().load(
      element.src,
      ({ image }) => {
        const { naturalWidth, naturalHeight } = image;

        material.uniforms.uResolution.value = new THREE.Vector2(
          naturalWidth,
          naturalHeight
        );
        observe();
      }
    );
  }
  // updateScroll and updateY: Handle scroll-based updates to the mesh position.
  function updateScroll(scrollY: number) {
    currentScroll = (-scrollY * sizes.height) / window.innerHeight;

    const deltaScroll = currentScroll - lastScroll;
    lastScroll = currentScroll;

    updateY(deltaScroll);
  }

  function updateY(deltaScroll: number) {
    meshPosition.y -= deltaScroll;
    mesh.position.y = meshPosition.y;
  }
  // onVisible and onInvisible: Control 
  // the shader effect when the media is in view or out of view.
  function onVisible() {
    gsap.to(material.uniforms.uProgress, {
      value: 1,
      duration: 1.6,
      ease: "linear",
    });
  }

  function onInvisible() {
    gsap.set(material.uniforms.uProgress, {
      value: 0,
    });
  }

  // observe: Uses the IntersectionObserver
  //  API to trigger visibility changes.
  function observe() {
    observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0].isIntersecting;

        if (isVisible) {
          onVisible();
        } else {
          onInvisible();
        }
      },
      {
        threshold: 0,
      }
    );

    observer.observe(element);
  }

  // onResize: Updates the mesh 
  // dimensions and position when the window is resized.

  function onResize(newSizes: Size) {
    sizes = newSizes;

    setNodeBounds();
    setMeshDimensions();
    setMeshPosition();
  }

  // Initialization
  createGeometry();
  createMaterial();
  createMesh();
  setNodeBounds();
  setMeshDimensions();
  setMeshPosition();
  setTexture();
  scene.add(mesh);

  return {
    updateScroll,
    onResize,
  };
}

export default createMedia;
