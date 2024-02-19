import { Injectable } from '@angular/core';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Injectable({
  providedIn: 'root'
})
export class MotorGraficoService {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  orbitControls: OrbitControls;
  gltfLoader: GLTFLoader;
  mouse: THREE.Vector2;
  model: THREE.Group<THREE.Object3DEventMap>;

  isLoaded: boolean = false;

  width: number = window.innerWidth;
  height:number = window.innerHeight;
  aspectRatio:number = this.width/this.height;

  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.aspectRatio, 0.1, 1000);
    this.gltfLoader = new GLTFLoader();
    this.mouse = new THREE.Vector2();
  }

  init() {
    const elemento = document.getElementById("modelo3D");
    elemento.appendChild(this.renderer.domElement);
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(6, 6, 6);
    this.orbitControls.update();
    this.orbitControls.enableZoom = true;
    this.orbitControls.minPolarAngle = 1.5;
    this.orbitControls.maxPolarAngle = 1.5;
  }

  loadModel(url: string, callback: () => void) {
    // Si el modelo ya está cargado, simplemente llama al callback y devuelve
    if(this.isLoaded) {
      callback();
      return;
    }

    this.gltfLoader.load(url, (gltf: any) => {
      this.model = gltf.scene;
      this.scene.add(this.model);

      // Llamamos al callback para notificar que la carga ha terminado
      callback();
      this.isLoaded = true;
    });
  }

  animate() {
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    this.renderer.setAnimationLoop(() => this.animate());
  }

}
