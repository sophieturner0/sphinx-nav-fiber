import { isEqual } from 'lodash'
import { useEffect, useRef } from 'react'
import { Box3, Color, Group, Sphere, Vector3 } from 'three'
import { Line2 } from 'three-stdlib'
import { useDataStore } from '~/stores/useDataStore'
import { useGraphStore } from '~/stores/useGraphStore'
import { NodeExtended } from '~/types'
import { Connections } from './Connections'
import { Cubes } from './Cubes'
import { Earth } from './Earth'
import { LoadingNodes } from './LoadingNodes'
import { Particles } from './Particles'
import { NodeDetailsPanel } from './UI'

export type LinkPosition = {
  sx: number
  sy: number
  sz: number
  tx: number
  ty: number
  tz: number
}

export const Graph = () => {
  const { dataInitial, isLoadingNew, isFetching, dataNew, resetDataNew } = useDataStore((s) => s)
  const groupRef = useRef<Group>(null)
  const cameraSettled = useRef<boolean>(false)
  const linksPositionRef = useRef<LinkPosition[]>([])

  const { setData, simulation, simulationCreate, simulationHelpers, graphStyle, setGraphRadius } = useGraphStore(
    (s) => s,
  )

  useEffect(() => {
    if (!dataNew) {
      return
    }

    const nodes = dataNew.nodes || []
    const links = dataNew.links || []

    const nodesClose = structuredClone(nodes)
    const linksClone = structuredClone(links)

    if (simulation) {
      const replace = isEqual(dataNew, dataInitial)

      simulationHelpers.addNodesAndLinks(nodesClose, linksClone, replace)
    }

    if (!simulation) {
      simulationCreate(nodesClose, linksClone)
    }

    resetDataNew()
  }, [setData, dataNew, simulation, simulationCreate, resetDataNew, simulationHelpers, dataInitial])

  useEffect(() => {
    if (!simulation) {
      return
    }

    simulationHelpers.setForces()
  }, [graphStyle, simulationHelpers, simulation])

  useEffect(() => {
    if (!simulation) {
      return
    }

    simulation.on('tick', () => {
      if (!cameraSettled.current && simulation.alpha() < 0.1) {
        const nodesVector = simulation.nodes().map((i: NodeExtended) => new Vector3(i.x, i.y, i.z))

        const boundingBox = new Box3().setFromPoints(nodesVector)

        const boundingSphere = new Sphere()

        boundingBox.getBoundingSphere(boundingSphere)

        const sphereRadius = Math.min(5000, boundingSphere.radius)

        setGraphRadius(sphereRadius)
        cameraSettled.current = true
      }

      if (groupRef.current) {
        const gr = groupRef.current.getObjectByName('simulation-3d-group__nodes') as Group
        const grConnections = groupRef.current.getObjectByName('simulation-3d-group__connections') as Group

        gr.children.forEach((mesh, index) => {
          const simulationNode = simulation.nodes()[index]

          if (simulationNode) {
            mesh.position.set(simulationNode.x, simulationNode.y, simulationNode.z)
          }
        })

        grConnections.children.forEach((r, i) => {
          const link = dataInitial?.links[i]
          const Line = r as Line2

          if (link) {
            const sourceNode = simulation.nodes().find((n: NodeExtended) => n.ref_id === link.source)
            const targetNode = simulation.nodes().find((n: NodeExtended) => n.ref_id === link.target)

            const { x: sx, y: sy, z: sz } = sourceNode
            const { x: tx, y: ty, z: tz } = targetNode

            linksPositionRef.current[i] = {
              sx,
              sy,
              sz,
              tx,
              ty,
              tz,
            }

            Line.geometry.setPositions([sx, sy, sz, tx, ty, tz])

            const { material } = Line

            material.color = new Color('white')
            material.transparent = true
            material.opacity = 0.1
          }
        })
      }
    })

    simulation.on('end', () => {
      const nodesVector = simulation.nodes().map((i: NodeExtended) => new Vector3(i.x, i.y, i.z))

      const boundingBox = new Box3().setFromPoints(nodesVector)

      const boundingSphere = new Sphere()

      boundingBox.getBoundingSphere(boundingSphere)

      const sphereRadius = boundingSphere.radius

      setGraphRadius(sphereRadius)

      cameraSettled.current = false
    })
  }, [dataInitial, simulation, setGraphRadius])

  if (!simulation) {
    return null
  }

  return (
    <group ref={groupRef}>
      <Cubes />
      <Earth />

      {false && <Particles />}
      {(isLoadingNew || isFetching) && <LoadingNodes />}

      {graphStyle !== 'earth' && <Connections linksPositions={linksPositionRef.current} />}
      <NodeDetailsPanel />
    </group>
  )
}
