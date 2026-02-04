import { createFileRoute } from '@tanstack/react-router'
import { Outlines, PerspectiveCamera } from '@react-three/drei'
import { useState, useCallback, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { PerspectiveCamera as ThreePerspectiveCamera } from 'three'

export const Route = createFileRoute('/')({
  component: App,
})

function CameraController() {
  const cameraRef = useRef<ThreePerspectiveCamera | null>(null)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [isMouseDown, setIsMouseDown] = useState(false)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMouseX(-(e.clientX / window.innerWidth * 2 - 1))
    setMouseY((e.clientY / window.innerHeight * 2 - 1))
  }, [])

  const handleMouseDown = useCallback(() => {
    setIsMouseDown(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false)
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseDown, handleMouseUp])

  useFrame(() => {
    if (cameraRef.current && isMouseDown) {
      const radius = 10
      const maxVerticalAngle = Math.PI / 3

      // Convert cursor deltas into spherical coordinates around the origin
      const horizontalAngle = mouseX * 2 * Math.PI
      const verticalAngle = Math.max(-maxVerticalAngle, Math.min(maxVerticalAngle, mouseY * maxVerticalAngle))

      const projectedRadius = Math.cos(verticalAngle) * radius
      const x = Math.sin(horizontalAngle) * projectedRadius
      const y = Math.sin(verticalAngle) * radius
      const z = Math.cos(horizontalAngle) * projectedRadius

      cameraRef.current.position.set(x, y, z)
      cameraRef.current.lookAt(0, 0, 0)
    }
  })

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 0, 10]}
      fov={45}
    />
  )
}

function App() {
  const [canvasHeight, setCanvasHeight] = useState<number | null>(null)

  useEffect(() => {
    const updateCanvasHeight = () => {
      const header = document.querySelector('header')
      const headerHeight = header?.getBoundingClientRect().height ?? 0
      setCanvasHeight(Math.max(window.innerHeight - headerHeight, 0))
    }

    updateCanvasHeight()
    window.addEventListener('resize', updateCanvasHeight)
    return () => window.removeEventListener('resize', updateCanvasHeight)
  }, [])

  return (
    <div
      style={{
        width: '100%',
        height: canvasHeight !== null ? `${canvasHeight}px` : '100vh',
      }}
    >
      <Canvas style={{ width: '100%', height: '100%' }}>
        <CameraController />
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4, 2, 2]} />
          <meshToonMaterial color="brown" />
          <Outlines color="black" screenspace thickness={0.15}/>
        </mesh>
        <mesh position={[0, 2.1, 0]}>
          <boxGeometry args={[4, 2, 2]} />
          <meshToonMaterial color="orange" />
          <Outlines color="black" screenspace thickness={0.15}/>
        </mesh>
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} color="white" />
      </Canvas>
    </div>
  )
}
