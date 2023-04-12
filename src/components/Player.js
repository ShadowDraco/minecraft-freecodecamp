import { useFrame, useThree } from '@react-three/fiber'
import { useSphere } from '@react-three/cannon'
import { useRef, useEffect } from 'react'
import { Vector3 } from 'three'
import { useKeyboard } from '../hooks/useKeyboard'

const JUMP_FORCE = 3
const SPEED = 4

export const Player = () => {
  const { moveForward, moveBackward, moveLeft, moveRight, jump } = useKeyboard()

  const { camera } = useThree()

  // create a sphere object that has mass and dynamic position
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 2, 0],
  }))

  // create a reference variable that subscribes to a built in api from three.js that tracks physics

  // on update set the player position to the position of the three api
  const pos = useRef([0, 0, 0])
  useEffect(() => {
    api.position.subscribe(p => (pos.current = p))
  }, [api.position])

  // on update set the player velocity = to the three api
  const vel = useRef([0, 0, 0])
  useEffect(() => {
    api.velocity.subscribe(v => (vel.current = v))
  }, [api.velocity])

  // built in hook to track frames and update
  useFrame(() => {
    camera.position.copy(
      new Vector3(pos.current[0], pos.current[1], pos.current[2])
    )

    const direction = new Vector3()
    const frontVector = new Vector3(
      0,
      0,
      (moveBackward ? 1 : 0) - (moveForward ? 1 : 0)
    )
    const sideVector = new Vector3(
      (moveLeft ? 1 : 0) - (moveRight ? 1 : 0),
      0,
      0
    )

    direction
      .subVectors(frontVector, sideVector)
      .normalize() // set the direction
      .multiplyScalar(SPEED) // multiply to set speed in said direction
      .applyEuler(camera.rotation) // apply rotation

    api.velocity.set(direction.x, vel.current[1], direction.z)

    // jump if jump action is true
    if (jump && Math.abs(vel.current[1]) < 0.05) {
      api.velocity.set(vel.current[0], JUMP_FORCE, vel.current[2])
    }
  })

  return <mesh ref={ref}></mesh>
}
