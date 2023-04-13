import { useEffect, useState } from 'react'
import { useStore } from '../hooks/useStore'
import { useKeyboard } from '../hooks/useKeyboard'

export const TextureSelector = () => {
  const [visible, setVisible] = useState(false)
  const [activeTexture, setTexture] = useStore(state => [
    state.texture,
    state.setTexture,
  ])
  const { dirt, grass, glass, wood, log } = useKeyboard()

  useEffect(() => {
    const pressedTexture = [dirt, grass, glass, wood, log]

    if (pressedTexture) {
      setTexture(pressedTexture)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirt, grass, glass, wood, log])

  useEffect(() => {
    const visibilityTimeout = setTimeout(() => {
      setVisible(false)
    }, 2000)

    setVisible(true)

    return () => {
      clearTimeout(visibilityTimeout)
    }
  }, [activeTexture])

  return visible && <div className='absolute centered'>TextureSelector</div>
}
