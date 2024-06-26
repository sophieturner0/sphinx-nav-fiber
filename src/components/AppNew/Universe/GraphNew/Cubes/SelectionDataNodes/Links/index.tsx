import { Point, Points, Segment, SegmentObject } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { QuadraticBezierCurve3, Vector3 } from 'three'
import { EdgeExtendedNew } from '~/network/fetchGraphDataNew/types'
import { useGraphStore, useSelectedNode } from '~/stores/useGraphStore'
import { PathwayBadge } from './Badge'

type Props = {
  link: EdgeExtendedNew
  title: string
  onRemove: () => void
}

const getSpherePosition = (points: Vector3[], progress: number): THREE.Vector3 => {
  const totalLength = points.reduce((acc, point, index) => {
    if (index < points.length - 1) {
      const nextPoint = points[index + 1]
      const segmentLength = new Vector3().subVectors(nextPoint, point).length()

      return acc + segmentLength
    }

    return acc
  }, 0)

  let currentLength = 0

  for (let i = 0; i < points.length - 1; i += 1) {
    const startPoint = points[i]
    const endPoint = points[i + 1]
    const segmentLength = new Vector3().subVectors(endPoint, startPoint).length()

    if (progress <= (currentLength + segmentLength) / totalLength) {
      const t = (progress * totalLength - currentLength) / segmentLength
      const position = new Vector3().lerpVectors(startPoint, endPoint, t)

      return position
    }

    currentLength += segmentLength
  }

  return points[points.length - 1] // In case progress is beyond the line length, return the last point
}

export const SelectionLink = ({ link, title, onRemove }: Props) => {
  const ref = useRef<SegmentObject>(null)
  const pointsRef = useRef(null)
  const selectedNode = useSelectedNode()
  const [start, setStart] = useState(new Vector3(0, 0, 0))
  const [end, setEnd] = useState(new Vector3(0, 0, 0))
  const [color, setColor] = useState('#ff13c9')
  const [selectionGraphData] = useGraphStore((s) => [s.selectionGraphData])

  const [progress, setProgress] = useState(0)

  // Animation function
  useFrame(() => {
    // Update progress to animate
    setProgress((prevProgress) => (prevProgress + 0.01) % 1) // Adjust the speed by changing the increment value
  })

  useEffect(() => {
    setStart(new Vector3(link.sourcePosition?.x || 0, link.sourcePosition?.y || 0, link.sourcePosition?.z || 0))
    setEnd(new Vector3(link.targetPosition?.x || 0, link.targetPosition?.y || 0, link.targetPosition?.z || 0))
    setColor('#ff13c9')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNode, link])

  const midPoint = new Vector3().addVectors(start, end).multiplyScalar(0.5)

  useFrame(() => {
    if (ref.current) {
      const source = selectionGraphData.nodes.find((f) => f.ref_id === link.source)

      const target = selectionGraphData.nodes.find((f) => f.ref_id === link.target)

      ref.current.start.set(source?.x || 0, source?.y || 0, source?.z || 0)
      ref.current.end.set(target?.x || 0, target?.y || 0, target?.z || 0)

      setStart(new Vector3(source?.x || 0, source?.y || 0, source?.z || 0))
      setEnd(new Vector3(target?.x || 0, target?.y || 0, target?.z || 0))
    }
  })

  const controlPoint = new Vector3(0, 0, 0)
  const curved = ![link.target, link.source].includes(selectedNode?.ref_id || '')
  const curve = new QuadraticBezierCurve3(start, controlPoint, end)
  const points = curved ? curve.getPoints(2) : [start, end]

  return (
    <>
      <Segment ref={ref} color="transparent" end={end} start={start} />
      <Points
        limit={1} // Optional: max amount of items (for calculating buffer size)
        range={1} // Optional: draw-range
      >
        <pointsMaterial vertexColors />
        <Point ref={pointsRef} color={color} position={getSpherePosition(points, progress)} size={20} />
      </Points>
      <PathwayBadge onRemove={onRemove} position={midPoint} title={title} />
    </>
  )
}
