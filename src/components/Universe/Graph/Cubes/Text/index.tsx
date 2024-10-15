import { Svg, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Select } from '@react-three/postprocessing'
import { memo, useMemo, useRef } from 'react'
import { Mesh } from 'three'
import { Icons } from '~/components/Icons'
import { useNodeTypes } from '~/stores/useDataStore'
import { useGraphStore, useHoveredNode, useSelectedNode, useSelectedNodeRelativeIds } from '~/stores/useGraphStore'
import { useSchemaStore } from '~/stores/useSchemaStore'
import { NodeExtended } from '~/types'
import { colors } from '~/utils/colors'
import { removeEmojis } from '~/utils/removeEmojisFromText'
import { truncateText } from '~/utils/truncateText'
import { smoothness } from '../Cube/constants'
import { fontProps } from './constants'

const COLORS_MAP = [
  '#fff',
  '#9747FF',
  '#00887A',
  '#0098A6',
  '#0288D1',
  '#33691E',
  '#465A65',
  '#512DA7',
  '#5C6BC0',
  '#5D4038',
  '#662C00',
  '#689F39',
  '#6B1B00',
  '#750000',
  '#78909C',
  '#7E57C2',
  '#8C6E63',
  '#AA47BC',
  '#BF360C',
  '#C2175B',
  '#EC407A',
  '#EF6C00',
  '#F5511E',
  '#FF9696',
  '#FFC064',
  '#FFCD29',
  '#FFEA60',
]

type Props = {
  node: NodeExtended
  hide?: boolean
}

function splitStringIntoThreeParts(text: string): string {
  // Split the string into an array of words

  const truncatedText = truncateText(text, 30)
  const words = truncatedText.split(' ')

  // If the word count is 5 or less, return the original text
  if (text.split(' ').length <= 5) {
    return truncatedText
  }

  // Determine the split points
  const third = Math.ceil(words.length / 3)
  const twoThirds = third * 2

  // Split the array into three parts
  const firstPart = words.slice(0, third).join(' ')
  const secondPart = words.slice(third, twoThirds).join(' ')
  const thirdPart = words.slice(twoThirds).join(' ')

  // Return the three parts as a single string with newline characters in between
  return `${firstPart}\n${secondPart}\n${thirdPart}`
}

export const TextNode = memo(({ node, hide }: Props) => {
  const ref = useRef<Mesh | null>(null)
  const svgRef = useRef<Mesh | null>(null)
  const selectedNode = useSelectedNode()
  const hoveredNode = useHoveredNode()

  const selectedNodeRelativeIds = useSelectedNodeRelativeIds()
  const isRelative = selectedNodeRelativeIds.includes(node?.ref_id || '')
  const isSelected = !!selectedNode && selectedNode?.ref_id === node.ref_id
  const isHovered = !!hoveredNode && hoveredNode?.ref_id === node.ref_id
  const showSelectionGraph = useGraphStore((s) => s.showSelectionGraph)
  const { normalizedSchemasByType } = useSchemaStore((s) => s)

  const nodeTypes = useNodeTypes()

  useFrame(({ camera }) => {
    if (ref?.current) {
      // Make text face the camera
      ref.current.quaternion.copy(camera.quaternion)
    }

    if (svgRef?.current) {
      // Make text face the camera
      svgRef.current.quaternion.copy(camera.quaternion)
    }
  })

  const textScale = useMemo(() => {
    let scale = (node.edge_count || 1) * 20

    if (showSelectionGraph && isSelected) {
      scale = 40
    } else if (!isSelected && isRelative) {
      scale = 0
    }

    const nodeScale = scale / Math.sqrt(node.name.length)

    scale = Math.max(nodeScale, 20)

    return Math.min(scale, 30)
  }, [node.edge_count, node.name, isSelected, isRelative, showSelectionGraph])

  const fillOpacity = useMemo(() => {
    if (selectedNode && !isSelected) {
      return 0.2
    }

    if (hoveredNode && !isHovered) {
      return 0.2
    }

    return 1
  }, [isSelected, selectedNode, isHovered, hoveredNode])

  const primaryColor = normalizedSchemasByType[node.node_type]?.primary_color
  const primaryIcon = normalizedSchemasByType[node.node_type]?.icon

  const color = primaryColor ?? (COLORS_MAP[nodeTypes.indexOf(node.node_type)] || colors.white)

  const Icon = primaryIcon ? Icons[primaryIcon] : null

  const iconName = Icon ? primaryIcon : 'AddCircleIcon'

  const sanitizedNodeName = removeEmojis(String(node.name))

  return (
    <>
      {!Icon ? (
        <Text
          ref={ref}
          anchorX="center"
          anchorY="middle"
          color={color}
          fillOpacity={fillOpacity}
          scale={textScale}
          userData={node}
          visible={!hide}
          {...fontProps}
        >
          {splitStringIntoThreeParts(sanitizedNodeName)}
        </Text>
      ) : (
        <Select enabled={!!isSelected}>
          <mesh name={node.id} userData={node} visible={!hide}>
            <sphereGeometry args={[30, 32, 32]} userData={node} />
            <meshStandardMaterial {...smoothness} color={color} />
            <Svg ref={svgRef} position={[20, 20, 20]} scale={2} src={`svg-icons/${iconName}.svg`} />
          </mesh>
        </Select>
      )}
    </>
  )
})

TextNode.displayName = 'TextNode'
