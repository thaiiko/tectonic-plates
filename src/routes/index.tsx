import { createFileRoute } from '@tanstack/react-router'
import { Outlines, PerspectiveCamera } from '@react-three/drei'
import { useState, useMemo } from 'react'
import { marked } from 'marked'

import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <Canvas>
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 10]}
        fov={75}
      />
      <mesh position={[0, 0, 5]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[4, 2, 2]} />
        <meshToonMaterial color="blue" />
      </mesh>
      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 0, 5]} color="white" />
    </Canvas>
  )
}
