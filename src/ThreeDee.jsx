import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { useEffect, useRef } from 'react'
import { generateCube, performMove } from './cube-utils'
import { getRandomMoves } from './utils'

function createCube() {
  const cube = {
    R: [
      ['G', 'B', 'W'],
      ['W', 'R', 'R'],
      ['W', 'W', 'W'],
    ],
    L: [
      ['B', 'R', 'R'],
      ['R', 'O', 'G'],
      ['R', 'Y', 'Y'],
    ],
    D: [
      ['G', 'Y', 'G'],
      ['G', 'W', 'B'],
      ['Y', 'O', 'R'],
    ],
    U: [
      ['Y', 'Y', 'O'],
      ['B', 'Y', 'O'],
      ['B', 'R', 'R'],
    ],
    B: [
      ['B', 'O', 'O'],
      ['Y', 'G', 'G'],
      ['B', 'G', 'G'],
    ],
    F: [
      ['Y', 'W', 'W'],
      ['W', 'B', 'O'],
      ['O', 'B', 'O'],
    ],
  }

  const colorMap = {
    R: 0xff0000, // Red
    G: 0x00ff00, // Green
    B: 0x0000ff, // Blue
    Y: 0xffff00, // Yellow
    M: 0xff00ff, // Magenta
    C: 0x00ffff, // Cyan
    W: 0xffffff, // White
    O: 0xffa500, // Orange
  }

  const group = new THREE.Group()

  const facePositions = {
    R: [0.5, 0, 0],
    L: [-0.5, 0, 0],
    U: [0, 0.5, 0],
    D: [0, -0.5, 0],
    F: [0, 0, 0.5],
    B: [0, 0, -0.5],
  }

  const faceRotations = {
    R: [0, Math.PI / 2, 0],
    L: [0, -Math.PI / 2, 0],
    U: [-Math.PI / 2, 0, 0],
    D: [Math.PI / 2, 0, 0],
    F: [0, 0, 0],
    B: [0, Math.PI, 0],
  }

  for (let faceKey in cube) {
    const face = cube[faceKey]
    for (let i = 0; i < face.length; i++) {
      for (let j = 0; j < face[i].length; j++) {
        const colorKey = face[i][j]
        const geometry = new THREE.BoxGeometry(0.33, 0.33, 0.33)
        const material = new THREE.MeshBasicMaterial({ color: colorMap[colorKey] })
        const smallCube = new THREE.Mesh(geometry, material)

        // Position the small cube relative to the center of the entire cube
        smallCube.position.set(
          facePositions[faceKey][0] + j * 0.33 - 0.33,
          facePositions[faceKey][1] - i * 0.33 + 0.33,
          facePositions[faceKey][2],
        )

        smallCube.rotation.set(...faceRotations[faceKey].map((r) => THREE.MathUtils.degToRad(r)))

        group.add(smallCube)
      }
    }
  }

  return group
}

function ShowCube3D({ cube }) {
  const ref = useRef()
  useEffect(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    )
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    ref.current.appendChild(renderer.domElement)

    const cubes3D = cube.map(createCube)
    cubes3D.forEach((c) => scene.add(c))

    // Add a point light
    const light = new THREE.PointLight(0xffffff, 1, 1000)
    light.position.set(10, 10, 10)
    scene.add(light)

    // Use OrbitControls to make the camera orbit around the cube
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)
    controls.update()

    camera.position.z = 5

    const animate = function () {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()
  }, [])

  return <div ref={ref} />
}

const Cube = () => {
  return <ShowCube3D cube={[0, 1, 2, 3, 4, 5]} />
}

export default Cube
