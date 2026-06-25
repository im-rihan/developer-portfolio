"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Points } from "three";
import * as THREE from "three";

function ParticleField() {
    const ref = useRef<Points>(null);
    const count = 800;

    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            arr[i * 3] = (Math.random() - 0.5) * 20;
            arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        return arr;
    }, []);

    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime * 0.08;
        ref.current.rotation.y = t;
        ref.current.rotation.x = Math.sin(t * 0.5) * 0.1;
        const { x, y } = state.pointer;
        ref.current.position.x = x * 0.5;
        ref.current.position.y = y * 0.3;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.04}
                color="#14b8a6"
                transparent
                opacity={0.75}
                sizeAttenuation
                depthWrite={false}
            />
        </points>
    );
}

function GridPlane() {
    const ref = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.x = -Math.PI / 2.2;
        ref.current.position.y = -3;
        ref.current.position.x = state.pointer.x * 0.3;
        ref.current.position.z = state.pointer.y * 0.2;
    });

    return (
        <mesh ref={ref}>
            <planeGeometry args={[24, 24, 32, 32]} />
            <meshBasicMaterial
                color="#0f766e"
                wireframe
                transparent
                opacity={0.12}
            />
        </mesh>
    );
}

export function SceneCanvas() {
    return (
        <Canvas
            camera={{ position: [0, 0, 8], fov: 60 }}
            gl={{ alpha: true, antialias: true }}
            style={{ background: "transparent" }}
        >
            <ambientLight intensity={0.4} />
            <ParticleField />
            <GridPlane />
        </Canvas>
    );
}
