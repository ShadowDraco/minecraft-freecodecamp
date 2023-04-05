import { useFrame, useThree } from '@react-three/fiber'
import { useSphere } from '@react-three/cannon'
import { useRef, useEffect } from 'react'
import { Vector3 } from 'three'

export const Player = () => {
  const { camera } = useThree()

  // create a sphere object that has mass and dynamic position
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 2, 10],
  }))

  const pos = useRef([0, 0, 0])
  // on update set the player position to the position of the three api
  useEffect(() => {
    api.position.subscribe(p => (pos.current = p))
  }, [api.position])

  useFrame(() => {
    camera.position.copy(
      new Vector3(pos.current[0], pos.current[1], pos.current[2])
    )
  })

  return <mesh ref={ref}></mesh>
}
