import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function createPixelArtCardTexture(
  _mode: 'dark' | 'light',
  onUpdate: (tex: THREE.CanvasTexture) => void
) {
  const textureScale = 1;
  const textureWidth = 720;
  const textureHeight = 1080;
  const canvas = document.createElement('canvas');

  canvas.width = textureWidth * textureScale;
  canvas.height = textureHeight * textureScale;

  const ctx = canvas.getContext('2d')!;
  ctx.scale(textureScale, textureScale);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const drawCard = (avatarImg?: HTMLImageElement) => {
    ctx.clearRect(0, 0, textureWidth, textureHeight);

    ctx.beginPath();
    ctx.roundRect(0, 0, textureWidth, textureHeight, 14);
    ctx.fillStyle = '#0f0f16';
    ctx.fill();

    // Outer Frame Accent Borders
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 7;
    ctx.strokeRect(5, 5, textureWidth - 10, textureHeight - 10);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2;
    ctx.strokeRect(13, 13, textureWidth - 26, textureHeight - 26);

    // Full Image Frame
    const padX = 25;
    const padY = 24;
    const imgX = padX;
    const imgY = padY;
    const imgW = textureWidth - padX * 2;
    const imgH = textureHeight - padY * 2;

    if (avatarImg && avatarImg.complete && avatarImg.naturalWidth > 0) {
      const srcW = avatarImg.naturalWidth || avatarImg.width || 1;
      const srcH = avatarImg.naturalHeight || avatarImg.height || 1;

      const scale = Math.max(imgW / srcW, imgH / srcH);
      const drawW = srcW * scale;
      const drawH = srcH * scale;
      const drawX = imgX + (imgW - drawW) / 2;
      const drawY = imgY + (imgH - drawH) / 2;

      ctx.save();

      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgW, imgH, 10);
      ctx.clip();

      ctx.fillStyle = '#12121a';
      ctx.fillRect(imgX, imgY, imgW, imgH);

      ctx.drawImage(
        avatarImg,
        0,
        0,
        srcW,
        srcH,
        drawX,
        drawY,
        drawW,
        drawH
      );

      ctx.restore();
    } else {
      ctx.fillStyle = '#181822';

      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgW, imgH, 10);
      ctx.fill();

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 70px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        'KAGENOU',
        textureWidth / 2,
        textureHeight / 2
      );
    }

    // Inner Accent Border
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.roundRect(imgX, imgY, imgW, imgH, 10);
    ctx.stroke();
  };

  drawCard();

  const texture = new THREE.CanvasTexture(canvas);

  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  onUpdate(texture);

  const img = new Image();
  img.crossOrigin = 'anonymous';

  img.onload = () => {
    drawCard(img);
    texture.needsUpdate = true;
    onUpdate(texture);
  };

  img.src = '/assets/card-avatar.png';
}

export const LanyardCanvas: React.FC<{
  theme?: 'dark' | 'light';
}> = ({ theme = 'dark' }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  const cardMatRef =
    useRef<THREE.MeshBasicMaterial | null>(null);

  const strapMatRef =
    useRef<THREE.MeshBasicMaterial | null>(null);

  useEffect(() => {
    if (cardMatRef.current) {
      createPixelArtCardTexture(theme, (tex) => {
        if (!cardMatRef.current) return;

        cardMatRef.current.map = tex;
        cardMatRef.current.needsUpdate = true;
      });
    }

    if (strapMatRef.current) {
      strapMatRef.current.color.setHex(0xef4444);
    }
  }, [theme]);

  useEffect(() => {
    const container = mountRef.current;

    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      25,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    camera.position.set(0, 0, 13);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });

    renderer.setSize(
      container.clientWidth,
      container.clientHeight
    );

    const isSmallDevice =
      window.matchMedia('(max-device-width: 767px)').matches;

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        isSmallDevice ? 0.9 : 1.25
      )
    );

    renderer.toneMapping =
      THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure = 1.15;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      Math.PI * 1.1
    );

    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(
      0xffffff,
      3
    );

    keyLight.position.set(-1, -1, 5);
    scene.add(keyLight);

    const getAnchorX = () => {
      const w = container.clientWidth;

      let anchorX: number;

      if (w < 640) {
        anchorX = 0.2;
      } else if (w < 1024) {
        anchorX = 1.2;
      } else if (w < 1280) {
        anchorX = 1.7;
      } else {
        anchorX = 2.1;
      }

      return anchorX * 1.3;
    };

    const anchor = new THREE.Vector3(
      getAnchorX(),
      3.2,
      0
    );

    const numNodes = 4;
    const segmentLen = 0.72;

    const nodes = Array.from(
      { length: numNodes },
      (_, idx) => ({
        pos: new THREE.Vector3(
          anchor.x + idx * 0.08,
          anchor.y - idx * segmentLen,
          0
        ),

        prev: new THREE.Vector3(
          anchor.x + idx * 0.08 - 0.14,
          anchor.y - idx * segmentLen + 0.05,
          0
        ),

        lerped: new THREE.Vector3(
          anchor.x + idx * 0.08,
          anchor.y - idx * segmentLen,
          0
        ),
      })
    );

    const texLoader = new THREE.TextureLoader();

    const bandTexture = texLoader.load(
      '/assets/band-plain.png'
    );

    bandTexture.wrapS = THREE.RepeatWrapping;
    bandTexture.wrapT = THREE.RepeatWrapping;

    bandTexture.magFilter = THREE.LinearFilter;
    bandTexture.minFilter =
      THREE.LinearMipmapLinearFilter;

    bandTexture.colorSpace =
      THREE.SRGBColorSpace;

    bandTexture.repeat.set(1, 1);

    const curvePointsCount = 24;

    const strapGeo = new THREE.BufferGeometry();

    const positions = new Float32Array(
      (curvePointsCount + 1) * 2 * 3
    );

    const uvs = new Float32Array(
      (curvePointsCount + 1) * 2 * 2
    );

    const indices: number[] = [];

    for (
      let i = 0;
      i <= curvePointsCount;
      i++
    ) {
      const u = i / curvePointsCount;

      uvs[i * 4 + 0] = u * 3.2;
      uvs[i * 4 + 1] = 0;

      uvs[i * 4 + 2] = u * 3.2;
      uvs[i * 4 + 3] = 1;

      if (i < curvePointsCount) {
        const a = i * 2;
        const b = a + 1;
        const c = a + 2;
        const d = a + 3;

        indices.push(
          a,
          b,
          c,
          b,
          d,
          c
        );
      }
    }

    strapGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    strapGeo.setAttribute(
      'uv',
      new THREE.BufferAttribute(uvs, 2)
    );

    strapGeo.setIndex(indices);

    const strapMat =
      new THREE.MeshBasicMaterial({
        map: bandTexture,
        color: 0xffffff,
        transparent: false,
        opacity: 1,
        side: THREE.DoubleSide,
        depthTest: false,
      });

    strapMatRef.current = strapMat;

    const strapMesh = new THREE.Mesh(
      strapGeo,
      strapMat
    );

    strapMesh.renderOrder = 10;

    scene.add(strapMesh);

    const cardPivot = new THREE.Group();

    scene.add(cardPivot);

    const cardInner = new THREE.Group();

    // Card scale
    const cardScale =
      container.clientWidth < 640
        ? 1.8096
        : 2.3088;

    cardInner.scale.setScalar(cardScale);

    cardInner.position.set(
      0,
      -1.0,
      -0.05
    );

    cardPivot.add(cardInner);

    // Lightweight raycast bounding box
    const hitGeo = new THREE.BoxGeometry(
      1.65,
      2.35,
      0.3
    );

    const hitMat =
      new THREE.MeshBasicMaterial({
        visible: false,
      });

    const hitMesh = new THREE.Mesh(
      hitGeo,
      hitMat
    );

    hitMesh.position.set(0, 0, 0);

    cardPivot.add(hitMesh);

    const gltfLoader = new GLTFLoader();

    gltfLoader.load(
      '/assets/kartu.glb',
      (gltf) => {
        let cardMeshObj: THREE.Mesh | null = null;
        let clipMeshObj: THREE.Mesh | null = null;
        let clampMeshObj: THREE.Mesh | null = null;

        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;

            if (m.name === 'card') {
              cardMeshObj = m;
            } else if (m.name === 'clip') {
              clipMeshObj = m;
            } else if (m.name === 'clamp') {
              clampMeshObj = m;
            }
          }
        });

        if (cardMeshObj) {
          const cardGeometry =
            (cardMeshObj as THREE.Mesh).geometry;

          const baseMaterial =
            new THREE.MeshBasicMaterial({
              color: 0x0f0f16,
              side: THREE.DoubleSide,
            });

          cardInner.add(
            new THREE.Mesh(
              cardGeometry,
              baseMaterial
            )
          );

          cardGeometry.computeBoundingBox();

          const bounds =
            cardGeometry.boundingBox;

          if (!bounds) {
            throw new Error(
              'Card geometry is missing bounds'
            );
          }

          const size =
            bounds.getSize(
              new THREE.Vector3()
            );

          const center =
            bounds.getCenter(
              new THREE.Vector3()
            );

          const imageMaterial =
            new THREE.MeshBasicMaterial({
              side: THREE.DoubleSide,
              transparent: true,
              depthWrite: false,
              toneMapped: false,
              polygonOffset: true,
              polygonOffsetFactor: -1,
              polygonOffsetUnits: -1,
            });

          cardMatRef.current =
            imageMaterial;

          const imagePlane =
            new THREE.Mesh(
              new THREE.PlaneGeometry(
                size.x,
                size.y
              ),
              imageMaterial
            );

          imagePlane.position.set(
            center.x,
            center.y,
            bounds.max.z + 0.002
          );

          imagePlane.renderOrder = 1;

          cardInner.add(imagePlane);

          createPixelArtCardTexture(
            theme,
            (tex) => {
              tex.anisotropy = Math.min(
                4,
                renderer.capabilities
                  .getMaxAnisotropy()
              );

              imageMaterial.map = tex;
              imageMaterial.needsUpdate = true;
            }
          );
        }

        if (clipMeshObj) {
          const metalMat =
            new THREE.MeshStandardMaterial({
              color: new THREE.Color(
                0x64748b
              ),
              metalness: 0.8,
              roughness: 0.25,
            });

          const clipMesh =
            new THREE.Mesh(
              (clipMeshObj as THREE.Mesh).geometry,
              metalMat
            );

          cardInner.add(clipMesh);

          if (clampMeshObj) {
            const clampMesh =
              new THREE.Mesh(
                (clampMeshObj as THREE.Mesh)
                  .geometry,
                metalMat
              );

            cardInner.add(clampMesh);
          }
        }
      }
    );

    const curve =
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]);

    curve.curveType = 'chordal';

    // Scratch vectors
    const scratchVel =
      new THREE.Vector3();

    const scratchDelta =
      new THREE.Vector3();

    const scratchRopeDir =
      new THREE.Vector3();

    const scratchJointOffset =
      new THREE.Vector3();

    const scratchTangent =
      new THREE.Vector3();

    const scratchPerp =
      new THREE.Vector3();

    const scratchUnproject =
      new THREE.Vector3();

    const scratchDir =
      new THREE.Vector3();

    const scratchWorldPoint =
      new THREE.Vector3();

    const curvePts =
      Array.from(
        {
          length:
            curvePointsCount + 1,
        },
        () => new THREE.Vector3()
      );

    const raycaster =
      new THREE.Raycaster();

    const pointer =
      new THREE.Vector2();

    let isDragging = false;
    let isHovered = false;
    let isInView = true;

    const dragOffset =
      new THREE.Vector3();

    let angVelY = 0;
    let rotY = 0;

    // IMPORTANT:
    // Card is scaled up, but cardInner itself
    // is positioned at Y = -1.0.
    // So compensate that -1.0 offset here.
    const jointOffsetY =
      container.clientWidth < 640
        ? 1.62392
        : 2.34776;

    const updatePointer = (
      e: PointerEvent
    ) => {
      const rect =
        renderer.domElement
          .getBoundingClientRect();

      pointer.x =
        ((e.clientX - rect.left) /
          rect.width) *
          2 -
        1;

      pointer.y =
        -(
          ((e.clientY - rect.top) /
            rect.height) *
            2 -
          1
        );
    };

    const getWorldPointUnderPointer = () => {
      scratchUnproject
        .set(
          pointer.x,
          pointer.y,
          0.5
        )
        .unproject(camera);

      scratchDir
        .copy(scratchUnproject)
        .sub(camera.position)
        .normalize();

      return scratchWorldPoint
        .copy(camera.position)
        .add(
          scratchDir.multiplyScalar(
            camera.position.length()
          )
        );
    };

    const onPointerDown = (
      e: PointerEvent
    ) => {
      if (!isInView) return;

      updatePointer(e);

      raycaster.setFromCamera(
        pointer,
        camera
      );

      const hits =
        raycaster.intersectObject(
          hitMesh,
          false
        );

      if (hits.length > 0) {
        isDragging = true;

        document.body.style.cursor =
          'grabbing';

        const wp =
          getWorldPointUnderPointer();

        dragOffset
          .copy(wp)
          .sub(
            nodes[numNodes - 1].pos
          );
      }
    };

    const onPointerMove = (
      e: PointerEvent
    ) => {
      if (!isInView) return;

      updatePointer(e);

      if (isDragging) {
        const wp =
          getWorldPointUnderPointer();

        wp.sub(dragOffset);

        if (pointer.y < -0.25) {
          wp.y = Math.max(
            wp.y,
            -0.8
          );
        }

        nodes[numNodes - 1]
          .pos.copy(wp);

        return;
      }

      raycaster.setFromCamera(
        pointer,
        camera
      );

      const hits =
        raycaster.intersectObject(
          hitMesh,
          false
        );

      const nowHovered =
        hits.length > 0;

      if (
        nowHovered !== isHovered
      ) {
        isHovered = nowHovered;

        document.body.style.cursor =
          isHovered
            ? 'grab'
            : 'auto';
      }
    };

    const onPointerUp = () => {
      if (isDragging) {
        isDragging = false;

        document.body.style.cursor =
          isHovered
            ? 'grab'
            : 'auto';
      }
    };

    const domEl =
      renderer.domElement;

    domEl.addEventListener(
      'pointerdown',
      onPointerDown,
      { passive: true }
    );

    window.addEventListener(
      'pointermove',
      onPointerMove,
      { passive: true }
    );

    window.addEventListener(
      'pointerup',
      onPointerUp,
      { passive: true }
    );

    const onResize = () => {
      if (!container) return;

      anchor.x =
        getAnchorX();

      camera.aspect =
        container.clientWidth /
        container.clientHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        container.clientWidth,
        container.clientHeight
      );
    };

    window.addEventListener(
      'resize',
      onResize,
      { passive: true }
    );

    let animId = 0;

    const gravityY = -0.012;

    const animationStart =
      performance.now();

    const animate = () => {
      if (!isInView) {
        animId = 0;
        return;
      }

      animId =
        requestAnimationFrame(
          animate
        );

      const elapsed =
        (performance.now() -
          animationStart) /
        1000;

      const breezeX =
        Math.sin(
          elapsed * 0.8
        ) *
          0.0018 +
        Math.sin(
          elapsed * 1.7 + 1.2
        ) *
          0.0007;

      const breezeZ =
        Math.sin(
          elapsed * 0.65 + 0.8
        ) *
        0.0005;

      // Verlet integration
      for (
        let i = 1;
        i < numNodes;
        i++
      ) {
        if (
          isDragging &&
          i === numNodes - 1
        ) {
          continue;
        }

        const node = nodes[i];

        scratchVel
          .copy(node.pos)
          .sub(node.prev)
          .multiplyScalar(0.96);

        node.prev.copy(
          node.pos
        );

        node.pos.add(
          scratchVel
        );

        const windStrength =
          i /
          (numNodes - 1);

        node.pos.x +=
          breezeX *
          windStrength;

        node.pos.z +=
          breezeZ *
          windStrength;

        node.pos.y +=
          gravityY;
      }

      // Distance constraints
      for (
        let iter = 0;
        iter < 8;
        iter++
      ) {
        nodes[0].pos.copy(
          anchor
        );

        for (
          let i = 0;
          i < numNodes - 1;
          i++
        ) {
          const n1 = nodes[i];
          const n2 =
            nodes[i + 1];

          scratchDelta
            .copy(n2.pos)
            .sub(n1.pos);

          const dist =
            scratchDelta.length() ||
            0.0001;

          const diff =
            (dist - segmentLen) /
            dist;

          if (i === 0) {
            if (
              !(
                isDragging &&
                i + 1 ===
                  numNodes - 1
              )
            ) {
              n2.pos.addScaledVector(
                scratchDelta,
                -diff
              );
            }
          } else if (
            isDragging &&
            i + 1 ===
              numNodes - 1
          ) {
            n1.pos.addScaledVector(
              scratchDelta,
              diff
            );
          } else {
            const halfDiff =
              diff * 0.5;

            n1.pos.addScaledVector(
              scratchDelta,
              halfDiff
            );

            n2.pos.addScaledVector(
              scratchDelta,
              -halfDiff
            );
          }
        }
      }

      // Lerp rope nodes
      for (
        let i = 0;
        i < numNodes;
        i++
      ) {
        nodes[i].lerped.lerp(
          nodes[i].pos,
          i === 0 ||
            i ===
              numNodes - 1
            ? 1
            : 0.35
        );
      }

      const endNode =
        nodes[numNodes - 1];

      const prevNode =
        nodes[numNodes - 2];

      scratchRopeDir
        .copy(endNode.pos)
        .sub(prevNode.pos)
        .normalize();

      const targetRotZ =
        Math.atan2(
          scratchRopeDir.x,
          -scratchRopeDir.y
        ) * 0.45;

      const targetRotX =
        Math.atan2(
          scratchRopeDir.z,
          -scratchRopeDir.y
        ) * 0.35;

      cardPivot.rotation.z +=
        (targetRotZ -
          cardPivot.rotation.z) *
        0.16;

      cardPivot.rotation.x +=
        (targetRotX -
          cardPivot.rotation.x) *
        0.16;

      scratchJointOffset
        .set(
          0,
          jointOffsetY,
          0
        )
        .applyEuler(
          cardPivot.rotation
        );

      cardPivot.position
        .copy(endNode.pos)
        .sub(
          scratchJointOffset
        );

      const lateralVel =
        endNode.pos.x -
        endNode.prev.x;

      angVelY +=
        lateralVel * 0.06 -
        rotY * 0.025;

      angVelY *= 0.92;

      rotY += angVelY;

      cardPivot.rotation.y =
        rotY;

      // Rope curve
      curve.points[0].copy(
        endNode.pos
      );

      curve.points[1].copy(
        nodes[2].lerped
      );

      curve.points[2].copy(
        nodes[1].lerped
      );

      curve.points[3].copy(
        nodes[0].pos
      );

      for (
        let i = 0;
        i <= curvePointsCount;
        i++
      ) {
        curve.getPoint(
          i / curvePointsCount,
          curvePts[i]
        );
      }

      const halfWidth = 0.095;

      const posAttr =
        strapGeo.getAttribute(
          'position'
        ) as THREE.BufferAttribute;

      for (
        let i = 0;
        i <= curvePointsCount;
        i++
      ) {
        const p =
          curvePts[i];

        const nextP =
          curvePts[
            Math.min(
              i + 1,
              curvePointsCount
            )
          ];

        const prevP =
          curvePts[
            Math.max(
              i - 1,
              0
            )
          ];

        scratchTangent
          .copy(nextP)
          .sub(prevP)
          .normalize();

        scratchPerp
          .set(
            -scratchTangent.y,
            scratchTangent.x,
            0
          )
          .normalize();

        posAttr.setXYZ(
          i * 2,
          p.x -
            scratchPerp.x *
              halfWidth,
          p.y -
            scratchPerp.y *
              halfWidth,
          p.z
        );

        posAttr.setXYZ(
          i * 2 + 1,
          p.x +
            scratchPerp.x *
              halfWidth,
          p.y +
            scratchPerp.y *
              halfWidth,
          p.z
        );
      }

      posAttr.needsUpdate = true;

      renderer.render(
        scene,
        camera
      );
    };

    // Pause render when Hero is out of view
    const observer =
      new IntersectionObserver(
        (entries) => {
          const entry =
            entries[0];

          isInView =
            entry.isIntersecting;

          if (
            isInView &&
            !animId
          ) {
            animId =
              requestAnimationFrame(
                animate
              );
          }
        },
        {
          threshold: 0.01,
        }
      );

    observer.observe(
      container
    );

    animId =
      requestAnimationFrame(
        animate
      );

    return () => {
      isInView = false;

      if (animId) {
        cancelAnimationFrame(
          animId
        );
      }

      observer.disconnect();

      domEl.removeEventListener(
        'pointerdown',
        onPointerDown
      );

      window.removeEventListener(
        'pointermove',
        onPointerMove
      );

      window.removeEventListener(
        'pointerup',
        onPointerUp
      );

      window.removeEventListener(
        'resize',
        onResize
      );

      document.body.style.cursor =
        'auto';

      renderer.dispose();
    };
  }, []);

  return (
    <div
      className="responsive-wrapper"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <div
        ref={mountRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          pointerEvents: 'auto',
          background: 'transparent',
        }}
      />
    </div>
  );
};