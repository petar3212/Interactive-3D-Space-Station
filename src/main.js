import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

// ========================================
// SCENA
// ========================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.FogExp2(0x000000, 0.0008);

// ========================================
// KAMERA
// ========================================

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 12, 30);

// ========================================
// RENDERER
// ========================================

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

// ========================================
// ORBIT CONTROLS
// ========================================

const controls = new OrbitControls(
  camera,
  renderer.domElement
);

controls.enableDamping = true;

// ========================================
// SVETLA
// ========================================

const ambientLight = new THREE.AmbientLight(
  0xffffff,
  0.4
);

scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(
  0xffffff,
  1.5
);

sunLight.position.set(
  30, 30, 20 );

sunLight.castShadow = true;

sunLight.shadow.mapSize.set(
  2048,
  2048
);

scene.add(sunLight);

const hemisphereLight =
  new THREE.HemisphereLight(
    0xffffff,
    0x222244,
    0.7
  );

scene.add(hemisphereLight);

// ========================================
// SPOT SVETLA
// ========================================

function createSpot(x, y, z) {

  const spot = new THREE.SpotLight(
    0xffffff,
    0.6,
    100,
    Math.PI / 6,
    0.5
  );

  spot.position.set(
    x,
    y,
    z
  );

  spot.castShadow = true;

  scene.add(spot);
}

createSpot(20, 15, 0);
createSpot(-20, 15, 0);
createSpot(0, 15, 20);

// ========================================
// TEKSTURE
// ========================================

const loader =
  new THREE.TextureLoader();

const metalTex =
  loader.load("/static/spaces.jpg");

metalTex.colorSpace =
  THREE.SRGBColorSpace;

metalTex.wrapS =
  THREE.RepeatWrapping;

metalTex.wrapT =
  THREE.RepeatWrapping;

metalTex.repeat.set(
  2, 2
);


// SVEMIR


const spaceTex =
  loader.load("/static/space.jpg");

spaceTex.colorSpace =
  THREE.SRGBColorSpace;

scene.background =
  spaceTex;









// ZEMLJA


const earthTexture =
  loader.load("/static/earth.jpg");

earthTexture.colorSpace =
  THREE.SRGBColorSpace;

const earth =
  new THREE.Mesh(
    new THREE.SphereGeometry(
      18, 64, 64
    ),
    new THREE.MeshStandardMaterial({
      map: earthTexture
    })
  );

earth.position.set(
  -60, -15, -90
);

scene.add(earth);


const atmosphereMaterial =
  new THREE.MeshBasicMaterial({
    color: 0x2288ff,
    transparent: true,
    opacity: 0.18,
    side: THREE.BackSide
  });

const atmosphere =
  new THREE.Mesh(
    new THREE.SphereGeometry(
      18.7,  64, 64
    ),
    atmosphereMaterial
  );

atmosphere.position.copy(
  earth.position
);

scene.add(atmosphere);

// ========================================
// KONTROLA STANICE
// ========================================

const clock =
  new THREE.Clock();

let stationPaused = false;

const manualOffset =
  new THREE.Vector3(
    0,
    0,
    0
  );

const autoPosition =
  new THREE.Vector3(
    0,
    0,
    0
  );

const moveSpeed = 0.15;

const rotationSpeed = 0.03;

const keys = {};

// ========================================
// MATERIJAL STANICE
// ========================================

const metalMat =
  new THREE.MeshStandardMaterial({

    map: metalTex,

    metalness: 0.7,

    roughness: 0.4

  });

// ========================================
// GLAVNI MODUL
// ========================================

const core =
  new THREE.Mesh(
    new THREE.CylinderGeometry(
      3,
      3,
      12,
      32
    ),
    metalMat
  );

// ========================================
// LEVI MODUL
// ========================================

const living =
  new THREE.Mesh(
    new THREE.BoxGeometry(
      5,
      5,
      5
    ),
    metalMat
  );

living.position.set(
  -7,
   0,
   0
);

// ========================================
// DESNI MODUL
// ========================================

const lab =
  new THREE.Mesh(
    new THREE.BoxGeometry(
      6,
      4,
      4
    ),
    metalMat
  );

lab.position.set(
  7,
  0,
  0
);

// ========================================
// TUNEL LEVO
// ========================================

const tunnelLeft =
  new THREE.Mesh(
    new THREE.CylinderGeometry(
      1.4, 1.4, 3, 32
    ),
    metalMat
  );

tunnelLeft.rotation.z =
  Math.PI / 2;

tunnelLeft.position.set(
  -3.5, 0, 0
);
const tunnelRight =
  new THREE.Mesh(
    new THREE.CylinderGeometry(
      1.4, 1.4, 3, 32
    ),
    metalMat
  );

tunnelRight.rotation.z =
  Math.PI / 2;

tunnelRight.position.set(
  3.5,  0, 0
);


// CENTRALNI NOSAČ


const mast =
  new THREE.Mesh(
    new THREE.BoxGeometry(
      1,
      10,
      1
    ),
    metalMat
  );

mast.position.set(
  0,
  5,
  0
);

// ========================================
// GORNJI NOSAČ
// ========================================

const crossBeam =
  new THREE.Mesh(
    new THREE.BoxGeometry(
      1,
      1,
      20
    ),
    metalMat
  );

crossBeam.position.set(
  0,
  10,
  0
);

// ========================================
// SOLARNI PANEL LEVO
// ========================================

const panelLeft =
  new THREE.Mesh(
    new THREE.BoxGeometry(
      20, 0.3, 5
    ),
    metalMat
  );

panelLeft.position.set(
  0,  10,  12
);
const panelRight =
  new THREE.Mesh(
    new THREE.BoxGeometry(
      20, 0.3, 5
    ),
    metalMat
  );

panelRight.position.set(
  0, 10, -12
);

// ========================================
// ROBOTSKA RUKA
// ========================================

const arm =
  new THREE.Mesh(
    new THREE.BoxGeometry(
      1,
      6,
      1
    ),
    metalMat
  );

arm.position.set(
  9,
  -3,
  0
);

// ========================================
// MATRICE
// ========================================

core.updateMatrix();
living.updateMatrix();
lab.updateMatrix();
tunnelLeft.updateMatrix();
tunnelRight.updateMatrix();
mast.updateMatrix();
crossBeam.updateMatrix();
panelLeft.updateMatrix();
panelRight.updateMatrix();
arm.updateMatrix();

// ========================================
// SPAJANJE MODELA
// ========================================

const mergedGeometry =
  BufferGeometryUtils.mergeGeometries([

    core.geometry.clone()
      .applyMatrix4(core.matrix),

    living.geometry.clone()
      .applyMatrix4(living.matrix),

    lab.geometry.clone()
      .applyMatrix4(lab.matrix),

    tunnelLeft.geometry.clone()
      .applyMatrix4(tunnelLeft.matrix),

    tunnelRight.geometry.clone()
      .applyMatrix4(tunnelRight.matrix),

    mast.geometry.clone()
      .applyMatrix4(mast.matrix),

    crossBeam.geometry.clone()
      .applyMatrix4(crossBeam.matrix),

    panelLeft.geometry.clone()
      .applyMatrix4(panelLeft.matrix),

    panelRight.geometry.clone()
      .applyMatrix4(panelRight.matrix),

    arm.geometry.clone()
      .applyMatrix4(arm.matrix)

  ]);

const stationMesh =
  new THREE.Mesh(
    mergedGeometry,
    metalMat
  );

stationMesh.castShadow = true;

stationMesh.receiveShadow = true;

scene.add(stationMesh);

// ========================================
// PROZORI
// ========================================

const windowMaterial =
  new THREE.MeshStandardMaterial({

    color: 0x1677aa,

    emissive: 0x073d5c,

    emissiveIntensity: 2,

    metalness: 0.5,

    roughness: 0.2

  });

function createWindow(
  x,
  y,
  z
) {

  const window =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        1.2,
        1.2,
        0.15
      ),
      windowMaterial
    );

  window.position.set(
    x,
    y,
    z
  );

  scene.add(window);

  return window;
}

createWindow(
  -7,
  1.2,
  2.55
);

createWindow(
  -7,
  -1.2,
  2.55
);

createWindow(
  7,
  1,
  2.05
);

createWindow(
  7,
  -1,
  2.05
);

createWindow(
  -7,
  1.2,
  -2.55
);

createWindow(
  -7,
  -1.2,
  -2.55
);

// ========================================
// SIGNALNA SVETLA
// ========================================

const greenLightMaterial =
  new THREE.MeshStandardMaterial({

    color: 0x00ff55,

    emissive: 0x00ff55,

    emissiveIntensity: 4

  });

const redLightMaterial =
  new THREE.MeshStandardMaterial({

    color: 0xff2222,

    emissive: 0xff2222,

    emissiveIntensity: 4

  });

function createSignalLight(
  x,
  y,
  z,
  material
) {

  const light =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.2,
        16,
        16
      ),
      material
    );

  light.position.set(
    x,
    y,
    z
  );

  scene.add(light);

  return light;
}

const greenLight =
  createSignalLight(
    0,
    6,
    0.7,
    greenLightMaterial
  );

const redLight =
  createSignalLight(
    0,
    6,
    -0.7,
    redLightMaterial
  );

// ========================================
// ANTENA
// ========================================

const antennaMaterial =
  new THREE.MeshStandardMaterial({

    color: 0x777777,

    metalness: 0.8,

    roughness: 0.3

  });

// Stub

const antennaPole =
  new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.15, 0.15, 3,  16
    ),
    antennaMaterial
  );

antennaPole.position.set(
  0, 13, 0
);
scene.add(antennaPole);
const antennaDish =
  new THREE.Mesh(
    new THREE.ConeGeometry(
      1.5, 0.5, 32
    ),
    antennaMaterial
  );

antennaDish.rotation.x =
  Math.PI;

antennaDish.position.set(
  0, 14.3, 0
);
scene.add(antennaDish);

// ========================================
// DOCKING PORT
// ========================================

const dockingMaterial =
  new THREE.MeshStandardMaterial({

    color: 0x555555,

    metalness: 0.9,

    roughness: 0.25

  });

const dockingPort =
  new THREE.Mesh(
    new THREE.CylinderGeometry(
      1.2,
      1.2,
      0.6,
      32
    ),
    dockingMaterial
  );

dockingPort.rotation.z =
  Math.PI / 2;

dockingPort.position.set(
  10,
  0,
  0
);

scene.add(dockingPort);

const dockingPort2 =
  dockingPort.clone();

dockingPort2.position.set(
  -10,
  0,
  0
);

scene.add(dockingPort2);

// ========================================
// KONTROLNI PANEL
// ========================================

const controlPanel =
  document.createElement("div");

controlPanel.style.position =
  "fixed";

controlPanel.style.top =
  "20px";

controlPanel.style.left =
  "20px";

controlPanel.style.padding =
  "15px";

controlPanel.style.background =
  "rgba(0,0,0,0.75)";

controlPanel.style.color =
  "white";

controlPanel.style.fontFamily =
  "Arial";

controlPanel.style.fontSize =
  "14px";

controlPanel.style.borderRadius =
  "10px";

controlPanel.style.lineHeight =
  "1.6";

controlPanel.style.zIndex =
  "100";

controlPanel.innerHTML = `
  <strong>
    SPACE STATION CONTROL
  </strong>
  <br><br>
  <span id="stationStatus">
    STATUS: RUNNING
  </span>
  <br><br>
  <b>SPACE</b> - Pause / Play
  <br>
  <b>W / S</b> - Up / Down
  <br>
  <b>A / D</b> - Left / Right
  <br>
  <b>Q / E</b> - Forward / Back
  <br>
  <b>← / →</b> - Rotate
  <br>
  <b>↑ / ↓</b> - Rotate
  <br>
  <b>R</b> - Reset
`;

document.body.appendChild(
  controlPanel
);

// ========================================
// TASTATURE
// ========================================

window.addEventListener(
  "keydown",
  (event) => {

    keys[event.code] = true;

    if (
      event.code === "Space" ||
      event.code === "ArrowUp" ||
      event.code === "ArrowDown" ||
      event.code === "ArrowLeft" ||
      event.code === "ArrowRight"
    ) {

      event.preventDefault();

    }

    // SPACE

    if (
      event.code === "Space" &&
      !event.repeat
    ) {

      stationPaused =
        !stationPaused;

      const status =
        document.getElementById(
          "stationStatus"
        );

      if (status) {

        status.textContent =
          stationPaused
            ? "STATUS: PAUSED"
            : "STATUS: RUNNING";

      }

    }

    // RESET

    if (
      event.code === "KeyR"
    ) {

      manualOffset.set(
        0,
        0,
        0
      );

      stationMesh.position.set(
        0,
        0,
        0
      );

      stationMesh.rotation.set(
        0,
        0,
        0
      );

    }

  }
);

// ========================================
// KEY UP
// ========================================

window.addEventListener(
  "keyup",
  (event) => {

    keys[event.code] = false;

  }
);

// ========================================
// RUČNO UPRAVLJANJE
// ========================================

function manualStationControl() {

  if (
    keys["KeyW"]
  ) {

    manualOffset.y += moveSpeed;

  }

  if (
    keys["KeyS"]
  ) {manualOffset.y -= moveSpeed;

  }

  if (
    keys["KeyA"]
  ) { manualOffset.x -= moveSpeed;

  }

  if (
    keys["KeyD"]
  ) {manualOffset.x += moveSpeed;

  }

  if (
    keys["KeyQ"]
  ) {

    manualOffset.z -=
      moveSpeed;

  }


  if (
    keys["KeyE"]
  ) {

    manualOffset.z +=
      moveSpeed;

  }

  // ROTACIJA Y

  if (
    keys["ArrowLeft"]
  ) {

    stationMesh.rotation.y +=
      rotationSpeed;

  }

  if (
    keys["ArrowRight"]
  ) {

    stationMesh.rotation.y -=
      rotationSpeed;

  }

  // ROTACIJA X

  if (
    keys["ArrowUp"]
  ) {

    stationMesh.rotation.x +=
      rotationSpeed;

  }

  if (
    keys["ArrowDown"]
  ) {

    stationMesh.rotation.x -=
      rotationSpeed;

  }

}

// ========================================
// ZVUK
// ========================================

const listener =
  new THREE.AudioListener();
camera.add(listener);
const spaceSound =
  new THREE.Audio(
    listener
  );
const audioLoader =
  new THREE.AudioLoader();
audioLoader.load(
  "/static/space-audio.mp3",
  (buffer) => {

    spaceSound.setBuffer(buffer);
    spaceSound.setLoop(
      true
    );

    spaceSound.setVolume(
      0.3
    );

    spaceSound.play();
  }
);

// ========================================
// ANIMACIJA
// ========================================

function animate() {

  requestAnimationFrame(
    animate
  );

  const t =
    clock.getElapsedTime();

  // AUTOMATSKO KRETANJE

  if (!stationPaused) {

    autoPosition.x =
      Math.sin(t * 0.2) * 2;

    autoPosition.y =
      Math.sin(t * 0.5) * 0.5;

    autoPosition.z =
      Math.cos(t * 0.2) * 2;

    stationMesh.position.x =
      autoPosition.x +
      manualOffset.x;

    stationMesh.position.y =
      autoPosition.y +
      manualOffset.y;

    stationMesh.position.z =
      autoPosition.z +
      manualOffset.z;

    stationMesh.rotation.y +=
      0.005;

  }

  // RUČNO

  manualStationControl();

  // ZEMLJA

  earth.rotation.y +=
    0.0001;

  // KAMERA

  controls.update();

  // RENDER

  renderer.render(
    scene,
    camera
  );

}

animate();

// ========================================
// RESIZE
// ========================================

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }
);