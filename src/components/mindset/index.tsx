import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Socket } from 'socket.io-client'
import styled from 'styled-components'
import { Flex } from '~/components/common/Flex'
import { Universe } from '~/components/Universe'
import { useSocket } from '~/hooks/useSockets'
import { fetchNodeEdges } from '~/network/fetchGraphData'
import { getNode } from '~/network/fetchSourcesData'
import { useDataStore } from '~/stores/useDataStore'
import { useMindsetStore } from '~/stores/useMindsetStore'
import { usePlayerStore } from '~/stores/usePlayerStore'
import { FetchDataResponse, Link, Node } from '~/types'
import { Header } from './components/Header'
import { PlayerControl } from './components/PlayerContols'
import { SideBar } from './components/Sidebar'

export const MindSet = () => {
  const { addNewNode, isFetching, runningProjectId } = useDataStore((s) => s)
  const [dataInitial, setDataInitial] = useState<FetchDataResponse | null>(null)
  const [showTwoD, setShowTwoD] = useState(false)
  const setSelectedEpisode = useMindsetStore((s) => s.setSelectedEpisode)
  const setClips = useMindsetStore((s) => s.setClips)
  const clips = useMindsetStore((s) => s.clips)
  const socket: Socket | undefined = useSocket()
  const requestRef = useRef<number | null>(null)
  const previousTimeRef = useRef<number | null>(null)
  const nodesAndEdgesRef = useRef<FetchDataResponse | null>(null)

  const queueRef = useRef<FetchDataResponse | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const navigate = useNavigate()

  const { episodeId: selectedEpisodeId } = useParams()

  const { setPlayingNode } = usePlayerStore((s) => s)

  useEffect(() => {
    const init = async (id: string) => {
      try {
        const data = await getNode(id)

        if (data) {
          setPlayingNode(data)
          setSelectedEpisode(data)
          addNewNode({ nodes: [data], edges: [] })
        }
      } catch (error) {
        navigate('/')
        console.error(error)
      }
    }

    if (selectedEpisodeId) {
      init(selectedEpisodeId)
    }
  }, [selectedEpisodeId, setPlayingNode, setSelectedEpisode, addNewNode, navigate])

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch the initial set of edges and nodes for the episode
        const starterNodes = await fetchNodeEdges(selectedEpisodeId || '', 0, 50, {
          nodeType: ['Show', 'Host', 'Guest'],
          useSubGraph: false,
        })

        const clipNodes = await fetchNodeEdges(selectedEpisodeId || '', 0, 50, {
          nodeType: ['Clip'],
          useSubGraph: false,
        })

        // Update the graph with starter nodes
        addNewNode({
          nodes: starterNodes?.nodes ? starterNodes?.nodes : [],
          edges: starterNodes?.edges ? starterNodes.edges : [],
        })

        if (clipNodes?.nodes) {
          setClips(clipNodes?.nodes)
        }
      } catch (error) {
        navigate('/')
        console.error('Error fetching initial data:', error)
      }
    }

    if (selectedEpisodeId) {
      fetchInitialData()
    }
  }, [selectedEpisodeId, addNewNode, setClips, navigate])

  useEffect(() => {
    if (!clips) {
      return
    }

    const processClipNodes = async () => {
      try {
        const refIds = clips?.map((node) => node.ref_id).filter(Boolean) || []

        const combinedData: FetchDataResponse = {
          nodes: nodesAndEdgesRef.current?.nodes || [],
          edges: nodesAndEdgesRef.current?.edges || [],
        }

        // eslint-disable-next-line no-restricted-syntax
        for (const refId of refIds) {
          // eslint-disable-next-line no-await-in-loop
          const data = await fetchNodeEdges(refId, 0, 50)

          if (data) {
            combinedData.nodes.push(...(data?.nodes || []))
            combinedData.edges.push(...(data?.edges || []))

            nodesAndEdgesRef.current = combinedData
            setDataInitial({ ...combinedData })
          }
        }

        // Update references and state after all requests complete
      } catch (error) {
        console.error('Error processing clip nodes:', error)
      }
    }

    processClipNodes()
  }, [clips])

  const handleNewNodeCreated = useCallback(
    (data: FetchDataResponse) => {
      if (isFetching) {
        return
      }

      if (!queueRef.current) {
        queueRef.current = { nodes: [], edges: [] }
      }

      if (data.edges) {
        queueRef.current.edges.push(...data.edges)
      }

      if (data.nodes) {
        queueRef.current.nodes.push(...data.nodes)
      }

      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(() => {
        // Combine all queued data into a single update

        if (queueRef.current) {
          const { nodes: newNodes, edges: newEdges } = queueRef.current
          const batchedData = { nodes: newNodes, edges: newEdges }

          queueRef.current = { nodes: [], edges: [] }
          addNewNode(batchedData)
        }
      }, 3000) // Adjust delay as necessary
    },
    [addNewNode, isFetching],
  )

  useEffect(() => {
    if (socket) {
      socket.connect()

      socket.on('connect_error', (error: unknown) => {
        console.error('Socket connection error:', error)
      })

      if (runningProjectId) {
        socket.on('new_node_created', handleNewNodeCreated)
      }
    }

    return () => {
      if (socket) {
        socket.off()
      }
    }
  }, [socket, handleNewNodeCreated, runningProjectId])

  useEffect(() => {
    const update = (time: number) => {
      const { playerRef } = usePlayerStore.getState()

      if (previousTimeRef.current !== null) {
        const deltaTime = time - previousTimeRef.current

        if (deltaTime > 1000) {
          if (nodesAndEdgesRef.current && playerRef) {
            const { nodes, edges } = nodesAndEdgesRef.current
            const currentTime = playerRef?.getCurrentTime()

            const [matchingLinks, remainingLinks] = edges.reduce<[Link[], Link[]]>(
              ([matches, remaining], link) => {
                if (link?.properties?.start !== undefined && (link?.properties?.start as number) < currentTime + 1) {
                  matches.push(link)
                } else {
                  remaining.push(link)
                }

                return [matches, remaining]
              },
              [[], []],
            )

            const [matchingNodes, remainingNodes] = nodes.reduce<[Node[], Node[]]>(
              ([matches, remaining], node) => {
                if (matchingLinks.some((edge) => edge.target === node.ref_id || edge.source === node.ref_id)) {
                  matches.push(node)
                } else {
                  remaining.push(node)
                }

                return [matches, remaining]
              },
              [[], []],
            )

            nodesAndEdgesRef.current = {
              nodes: remainingNodes,
              edges: remainingLinks,
            }

            if (matchingNodes.length || matchingLinks.length) {
              addNewNode({ nodes: matchingNodes, edges: matchingLinks })
            }
          }

          previousTimeRef.current = time
        }
      } else {
        previousTimeRef.current = time
      }

      requestRef.current = requestAnimationFrame(update)
    }

    requestRef.current = requestAnimationFrame(update)

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [nodesAndEdgesRef, addNewNode])

  useEffect(() => {
    if (runningProjectId) {
      try {
        socket?.emit('update_project_id', { id: runningProjectId })
      } catch (error) {
        console.error(error)
      }
    }
  }, [runningProjectId, socket])

  const markers = useMemo(() => {
    if (dataInitial) {
      const edgesMention: Array<{ source: string; target: string; start: number }> = dataInitial.edges
        .filter((e) => e?.properties?.start)
        .map((edge) => ({ source: edge.source, target: edge.target, start: edge.properties?.start as number }))

      const nodesWithTimestamps = dataInitial.nodes
        .filter((node) => dataInitial.edges.some((ed) => ed.source === node.ref_id || ed.target === node.ref_id))
        .map((node) => {
          const edge = edgesMention.find((ed) => node.ref_id === ed.source || node.ref_id === ed.target)

          return { ...node, start: edge?.start || 0 }
        })
        .filter(
          (node) => node && node.node_type !== 'Clip' && node.node_type !== 'Episode' && node.node_type !== 'Show',
        )

      return nodesWithTimestamps
    }

    return []
  }, [dataInitial])

  return (
    <MainContainer>
      <ContentWrapper direction="row">
        <>
          <Flex>
            <Flex onClick={() => setShowTwoD(!showTwoD)}>
              <Header />
            </Flex>
            <SideBar />
          </Flex>
          <ContentContainer>
            <Flex basis="100%" grow={1} shrink={1}>
              <Universe />
            </Flex>
          </ContentContainer>
        </>
      </ContentWrapper>
      <PlayerControlWrapper>
        <PlayerControl markers={markers} />
      </PlayerControlWrapper>
    </MainContainer>
  )
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
`

const ContentWrapper = styled(Flex)`
  flex: 1;
  overflow: hidden;
`

const ContentContainer = styled(Flex)`
  flex-basis: 100%;
  flex-shrink: 1;
  flex-grow: 1;
  padding: 16px 16px 16px 0;
`

const PlayerControlWrapper = styled(Flex)`
  padding: 16px 16px 16px 0;
  margin-left: 18px;
`
