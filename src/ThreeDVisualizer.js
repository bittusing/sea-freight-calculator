// ThreeDVisualizer.js
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedBox({ item, position, color, delay }) {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.getElapsedTime();
      const rise = Math.min(1, (time - delay) * 2);
      meshRef.current.position.y = THREE.MathUtils.lerp(0, position[1], rise);
    }
  });

  return (
    <mesh ref={meshRef} position={[position[0], 0, position[2]]}>
      <boxGeometry args={[item.length / 100, item.height / 100, item.width / 100]} />
      <meshStandardMaterial color={color} transparent opacity={0.9} />
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(item.length / 100, item.height / 100, item.width / 100)]} />
        <lineBasicMaterial attach="material" color="white" />
      </lineSegments>
      <Html distanceFactor={10} style={{ color: 'white', fontSize: '12px' }}>
        {item.name}
      </Html>
    </mesh>
  );
}

function ContainerOutline({ container }) {
  const { length, height, width } = container;
  return (
    <mesh position={[length / 200, height / 200, width / 200]}>
      <boxGeometry args={[length / 100, height / 100, width / 100]} />
      <meshBasicMaterial color="#ffffff" wireframe />
    </mesh>
  );
}

function BoxesLayered({ items }) {
  const spacing = 1;
  const boxes = [];

  let currentX = 0;
  let currentY = 0;
  let currentZ = 0;
  let maxHeight = 0;
  let delay = 0;

  items.forEach((item, index) => {
    const w = item.width / 100;
    const h = item.height / 100;
    const l = item.length / 100;
    const maxPerRow = 5;
    const boxCount = Math.min(item.count, 50);

    for (let i = 0; i < boxCount; i++) {
      const x = currentX;
      const y = currentY;
      const z = currentZ;

      boxes.push(
        <AnimatedBox
          key={`box-${index}-${i}`}
          item={item}
          position={[x, y + h / 2, z]}
          color={item.color}
          delay={delay}
        />
      );

      currentX += l + spacing;
      if ((i + 1) % maxPerRow === 0) {
        currentX = 0;
        currentZ += w + spacing;
        if ((i + 1) % (maxPerRow * 2) === 0) {
          currentZ = 0;
          currentY += h + spacing;
        }
      }

      delay += 0.05; // increment animation delay
    }
  });

  return <>{boxes}</>;
}

export default function ThreeDVisualizer({ container, items }) {
  return (
    <div style={{ width: '100%', height: '600px', background: 'black' }}>
      <Canvas
        style={{ background: 'black' }}
        camera={{ position: [10, 10, 20], fov: 50 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <OrbitControls />
        <ContainerOutline container={container} />
        <BoxesLayered items={items} />
      </Canvas>
    </div>
  );
}
