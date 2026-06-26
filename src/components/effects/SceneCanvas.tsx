"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Mesh, Points } from "three";
import * as THREE from "three";

function CameraRig() {
    useFrame((state) => {
        const { pointer, camera } = state;


        camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 1.25, 0.05);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.85, 0.05);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, 9 + Math.abs(pointer.y) * 0.3, 0.03);
        camera.lookAt(pointer.x * 0.5, pointer.y * 0.3, 0);
    });
    return null;
}

function ParticleField() {
    const ref = useRef<Points>(null);
    const count = 2400;

    const { positions, colors } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const c1 = new THREE.Color("#14b8a6");
        const c2 = new THREE.Color("#f59e0b");
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 34;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 34;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 34;
            const mix = Math.random();
            const c = c1.clone().lerp(c2, mix * 0.4);
            col[i * 3] = c.r;
            col[i * 3 + 1] = c.g;
            col[i * 3 + 2] = c.b;
        }
        return { positions: pos, colors: col };
    }, []);

    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime * 0.05;
        ref.current.rotation.y = t + state.pointer.x * 0.28;
        ref.current.rotation.x = Math.sin(t * 0.3) * 0.12 + state.pointer.y * 0.08;
        ref.current.position.x = state.pointer.x * 1.1;
        ref.current.position.y = state.pointer.y * 0.65;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.045}
                vertexColors
                transparent
                opacity={0.9}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

function WireGlobe() {
    const ref = useRef<Mesh>(null);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.y = state.clock.elapsedTime * 0.16 + state.pointer.x * 0.3;
        ref.current.rotation.x = 0.28 + state.pointer.y * 0.12;
        ref.current.position.x = state.pointer.x * 0.3;
        ref.current.position.y = state.pointer.y * 0.18;
    });

    return (
        <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.55}>
            <mesh ref={ref}>
                <icosahedronGeometry args={[2.5, 3]} />
                <meshBasicMaterial color="#14b8a6" wireframe transparent opacity={0.28} />
            </mesh>
        </Float>
    );
}

function InnerCore() {
    const ref = useRef<Mesh>(null);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.y = -state.clock.elapsedTime * 0.1;
        const scale = 1 + Math.sin(state.clock.elapsedTime * 0.9) * 0.06;
        ref.current.scale.setScalar(scale);
    });

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.65, 32, 32]} />
            <meshBasicMaterial color="#14b8a6" transparent opacity={0.15} />
        </mesh>
    );
}

function OrbitRing({ radius, opacity, speed, color }: { radius: number; opacity: number; speed: number; color: string }) {
    const ref = useRef<Mesh>(null);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.z = state.clock.elapsedTime * speed;
        ref.current.rotation.x = Math.PI / 2.3 + state.pointer.y * 0.14;
        ref.current.position.x = state.pointer.x * 0.45;
        ref.current.position.y = state.pointer.y * 0.1;
    });

    return (
        <mesh ref={ref}>
            <torusGeometry args={[radius, 0.02, 12, 96]} />
            <meshBasicMaterial color={color} transparent opacity={opacity} />
        </mesh>
    );
}

function GridPlane() {
    const ref = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.x = -Math.PI / 2.1;
        ref.current.position.y = -4.5;
        ref.current.position.x = state.pointer.x * 0.45;
        ref.current.position.z = state.pointer.y * 0.32;
    });

    return (
        <mesh ref={ref}>
            <planeGeometry args={[40, 40, 52, 52]} />
            <meshBasicMaterial color="#0f766e" wireframe transparent opacity={0.12} />
        </mesh>
    );
}

function FloatingNodes() {
    const group = useRef<THREE.Group>(null);
    const nodes = useMemo(
        () =>
            Array.from({ length: 8 }, (_, i) => ({
                x: Math.cos(i * 0.78) * 4.5,
                y: Math.sin(i * 0.85) * 2.5,
                z: Math.sin(i * 1.1) * 2.5,
                s: 0.05 + (i % 3) * 0.025,
                color: i % 2 === 0 ? "#14b8a6" : "#f59e0b",
            })),
        []
    );

    useFrame((state) => {
        if (!group.current) return;
        group.current.rotation.y = state.clock.elapsedTime * 0.07 + state.pointer.x * 0.05;
    });

    return (
        <group ref={group}>
            {nodes.map((n, i) => (
                <mesh key={i} position={[n.x, n.y, n.z]}>
                    <sphereGeometry args={[n.s, 10, 10]} />
                    <meshBasicMaterial color={n.color} transparent opacity={0.6} />
                </mesh>
            ))}
        </group>
    );
}

function AuroraPlane() {
    const ref = useRef<Mesh>(null);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.z = state.clock.elapsedTime * 0.02;
        ref.current.position.x = state.pointer.x * 0.2;
    });

    return (
        <mesh ref={ref} position={[0, 2, -6]}>
            <planeGeometry args={[18, 10]} />
            <meshBasicMaterial color="#0f766e" transparent opacity={0.06} side={THREE.DoubleSide} />
        </mesh>
    );
}

export function SceneCanvas() {
    const [eventSource, setEventSource] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setEventSource(document.body);
    }, []);

    if (!eventSource) return null;

    return (
        <Canvas
            eventSource={eventSource}
            eventPrefix="client"
            camera={{ position: [0, 0, 9], fov: 50 }}
            gl={{ alpha: true, antialias: true }}
            style={{ background: "transparent" }}
        >
            <CameraRig />
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={0.5} color="#14b8a6" />
            <pointLight position={[-8, -4, 6]} intensity={0.3} color="#f59e0b" />
            <Stars radius={100} depth={50} count={3200} factor={4} saturation={0} fade speed={0.6} />
            <AuroraPlane />
            <ParticleField />
            <WireGlobe />
            <InnerCore />
            <OrbitRing radius={3.4} opacity={0.5} speed={0.1} color="#14b8a6" />
            <OrbitRing radius={4.6} opacity={0.28} speed={-0.06} color="#f59e0b" />
            <OrbitRing radius={5.8} opacity={0.14} speed={0.04} color="#14b8a6" />
            <FloatingNodes />
            <GridPlane />
        </Canvas>
    );
}
