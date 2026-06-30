import { useEffect, useRef } from 'react'
import { ReactSVG } from 'react-svg'
import LogoIcon from '../../assets/svg/logo.svg'

function AnimatedLogo({ className = '', hoverSpeed = 2.5 }) {
  const svgRef = useRef(null)
  const frameRef = useRef(null)
  const previousFrameTimeRef = useRef(null)
  const speedRef = useRef(1)

  const stopAnimationLoop = () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }

    previousFrameTimeRef.current = null
  }

  const startAnimationLoop = (svg) => {
    stopAnimationLoop()
    svgRef.current = svg

    try {
      svg.pauseAnimations()
    } catch {
      return
    }

    const tick = (time) => {
      const currentSvg = svgRef.current

      if (!currentSvg) return

      if (previousFrameTimeRef.current !== null) {
        const deltaSeconds = (time - previousFrameTimeRef.current) / 1000

        try {
          currentSvg.setCurrentTime(currentSvg.getCurrentTime() + deltaSeconds * speedRef.current)
        } catch {
          stopAnimationLoop()
          return
        }
      }

      previousFrameTimeRef.current = time
      frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => () => {
    stopAnimationLoop()
    svgRef.current = null
  }, [])

  return (
    <ReactSVG
      src={LogoIcon}
      className={className}
      aria-hidden="true"
      beforeInjection={(svg) => {
        svg.setAttribute('focusable', 'false')
        startAnimationLoop(svg)
      }}
      onMouseEnter={() => {
        speedRef.current = hoverSpeed
      }}
      onMouseLeave={() => {
        speedRef.current = 1
      }}
    />
  )
}

export default AnimatedLogo
