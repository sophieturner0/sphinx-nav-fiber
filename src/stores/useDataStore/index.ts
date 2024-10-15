// @ts-nocheck
// @ts-ignore

import { isEqual } from 'lodash'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { fetchGraphData } from '~/network/fetchGraphData'
import { FilterParams, GraphData, Link, NodeExtended, NodeType, Sources, Trending, TStats } from '~/types'
import { useAiSummaryStore } from '../useAiSummaryStore'
import { useAppStore } from '../useAppStore'

const deduplicateByRefId = (items) => {
  const uniqueMap = new Map()

  items.forEach((item) => {
    if (!uniqueMap.has(item.ref_id)) {
      uniqueMap.set(item.ref_id, item)
    }
  })

  return Array.from(uniqueMap.values())
}

export type GraphStyle = 'sphere' | 'force' | 'split' | 'earth'

export const graphStyles: GraphStyle[] = ['sphere', 'force', 'split', 'earth']

export type FetchNodeParams = {
  word?: string
  skip_cache?: string
  free?: string
  media_type?: string
}

export type SidebarFilterWithCount = {
  name: string
  count: number
}

export type DataStore = {
  splashDataLoading: boolean
  abortRequest: boolean
  categoryFilter: NodeType | null
  dataInitial: { nodes: NodeExtended[]; links: Link[] } | null
  dataNew: { nodes: NodeExtended[]; links: Link[] } | null
  filters: FilterParams
  isFetching: boolean
  isLoadingNew: boolean
  selectedTimestamp: NodeExtended | null
  sources: Sources[] | null
  queuedSources: Sources[] | null
  hideNodeDetails: boolean
  sidebarFilter: string
  sidebarFilters: string[]
  sidebarFilterCounts: SidebarFilterWithCount[]
  trendingTopics: Trending[]
  stats: TStats | null
  nodeTypes: string[]
  seedQuestions: string[] | null
  runningProjectId: string
  runningProjectMessages: string[]

  setTrendingTopics: (trendingTopics: Trending[]) => void
  setDataNew: (data: GraphData) => void
  resetDataNew: () => void
  setStats: (stats: TStats) => void
  setSidebarFilter: (filter: string) => void
  setCategoryFilter: (categoryFilter: NodeType | null) => void
  fetchData: (
    setBudget: (value: number | null) => void,
    setAbortRequests: (status: boolean) => void,
    AISearchQuery?: string,
    params?: FetchNodeParams,
  ) => void
  setSelectedTimestamp: (selectedTimestamp: NodeExtended | null) => void
  setSources: (sources: Sources[] | null) => void
  setQueuedSources: (sources: Sources[] | null) => void
  setIsFetching: (_: boolean) => void
  setRunningProjectId: (runningProjectId: string) => void
  setRunningProjectMessages: (message: string) => void
  resetRunningProjectMessages: () => void
  setHideNodeDetails: (_: boolean) => void
  addNewNode: (data: FetchDataResponse) => void
  updateNode: (updatedNode: NodeExtended) => void
  removeNode: (id: string) => void
  setSidebarFilterCounts: (filterCounts: SidebarFilterWithCount[]) => void
  setAbortRequests: (abortRequest: boolean) => void
  nextPage: () => void
  setFilters: (filters: Partial<FilterParams>) => void
  setSeedQuestions: (questions: string[]) => void
  abortFetchData: () => void
  resetGraph: () => void
  resetData: () => void
}

const defaultData: Omit<
  DataStore,
  | 'setTrendingTopics'
  | 'setStats'
  | 'setSidebarFilter'
  | 'fetchData'
  | 'setFilters'
  | 'setIsFetching'
  | 'setCategoryFilter'
  | 'setHoveredNode'
  | 'setSelectedTimestamp'
  | 'setSphinxModalOpen'
  | 'setSources'
  | 'setSidebarFilterCounts'
  | 'setQueuedSources'
  | 'setHideNodeDetails'
  | 'addNewNode'
  | 'updateNode'
  | 'removeNode'
  | 'setAbortRequests'
  | 'nextPage'
  | 'setDataNew'
  | 'resetDataNew'
  | 'setSeedQuestions'
> = {
  categoryFilter: null,
  dataInitial: null,
  currentPage: 0,
  itemsPerPage: 300,
  runningProjectMessages: [],
  filters: {
    skip: 0,
    limit: 300,
    depth: '2',
    sort_by: 'date_added_to_graph',
    include_properties: 'true',
    top_node_count: '50',
    includeContent: 'true',
    node_type: [],
  },
  isFetching: false,
  isLoadingNew: false,
  queuedSources: null,
  selectedTimestamp: null,
  sources: null,
  sidebarFilter: 'all',
  sidebarFilters: [],
  trendingTopics: [],
  sidebarFilterCounts: [],
  stats: null,
  splashDataLoading: true,
  abortRequest: false,
  dataNew: null,
  seedQuestions: null,
  runningProjectId: '',
}

let abortController: AbortController | null = null

export const useDataStore = create<DataStore>()(
  devtools((set, get) => ({
    ...defaultData,

    fetchData: async (setBudget, setAbortRequests, AISearchQuery = '') => {
      const { dataInitial: existingData, filters } = get()
      const currentPage = filters.skip
      const itemsPerPage = filters.limit
      const { currentSearch } = useAppStore.getState()
      const { setAiSummaryAnswer, setNewLoading, aiRefId } = useAiSummaryStore.getState()
      let ai = { ai_summary: String(!!AISearchQuery) }

      if (!AISearchQuery) {
        if (!currentPage) {
          set({ isFetching: true })
        } else {
          set({ isLoadingNew: true })
        }
      }

      if (AISearchQuery) {
        ai = { ...ai, ai_summary: String(true) }
        setNewLoading({ question: AISearchQuery, answerLoading: true })
      }

      if (abortController) {
        abortController.abort('abort')
      }

      const controller = new AbortController()
      const { signal } = controller

      abortController = controller

      const { node_type: filterNodeTypes, ...withoutNodeType } = filters

      const word = AISearchQuery || currentSearch

      const isLatest = isEqual(filters, defaultData.filters) && !word

      const updatedParams = {
        ...withoutNodeType,
        ...ai,
        skip: currentPage === 0 ? String(currentPage * itemsPerPage) : String(currentPage * itemsPerPage + 1),
        limit: word ? '25' : String(itemsPerPage),
        ...(filterNodeTypes.length > 0 ? { node_type: JSON.stringify(filterNodeTypes) } : {}),
        ...(word ? { word } : {}),
        ...(aiRefId && AISearchQuery ? { previous_search_ref_id: aiRefId } : {}),
      }

      try {
        const data = await fetchGraphData(setBudget, updatedParams, isLatest, signal, setAbortRequests)

        if (!data?.nodes) {
          return
        }

        if (data?.query_data?.ref_id) {
          useAiSummaryStore.setState({ aiRefId: data?.query_data?.ref_id })

          const { aiSummaryAnswers } = useAiSummaryStore.getState()
          const { answer } = aiSummaryAnswers[data?.query_data?.ref_id] || {}

          setAiSummaryAnswer(data?.query_data?.ref_id, {
            question: AISearchQuery,
            answer: answer || '',
            answerLoading: !answer,
            sourcesLoading: !answer,
            shouldRender: true,
          })

          setNewLoading(null)
        }

        const currentNodes = currentPage === 0 && !aiRefId ? [] : [...(existingData?.nodes || [])]
        const currentLinks = currentPage === 0 && !aiRefId ? [] : [...(existingData?.links || [])]

        const newNodes = (data?.nodes || []).filter((n) => !currentNodes.some((c) => c.ref_id === n.ref_id))

        currentNodes.push(...newNodes)

        const newLinks = (data?.edges || [])
          .filter((n) => !currentLinks.some((c) => c.ref_id === n.ref_id))
          .filter((c) => {
            const { target, source } = c

            return currentNodes.some((n) => n.ref_id === target) && currentNodes.some((n) => n.ref_id === source)
          })

        currentLinks.push(...newLinks)

        const nodeTypes = [...new Set(currentNodes.map((i) => i.node_type))]

        const sidebarFilters = ['all', ...nodeTypes.map((i) => i.toLowerCase())]

        const sidebarFilterCounts = sidebarFilters.map((filter) => ({
          name: filter,
          count: currentNodes.filter((node) => filter === 'all' || node.node_type?.toLowerCase() === filter).length,
        }))

        set({
          dataInitial: { nodes: currentNodes, links: currentLinks },
          dataNew: { nodes: newNodes, links: newLinks },
          isFetching: false,
          isLoadingNew: false,
          splashDataLoading: false,
          nodeTypes,
          sidebarFilters,
          sidebarFilterCounts,
        })
      } catch (error) {
        console.log(error)

        if (error !== 'abort') {
          set({ isLoadingNew: false, isFetching: false })
        }
      }
    },

    abortFetchData: () => {
      if (abortController) {
        abortController.abort('abort')
      }
    },
    resetGraph: () => {
      set({
        filters: defaultData.filters,
        dataNew: null,
      })

      get().fetchData()
    },

    resetData: () => {
      set({
        dataNew: { nodes: [], links: [] },
        dataInitial: { nodes: [], links: [] },
        nodeTypes: [],
      })
    },

    setPage: (page: number) => set({ currentPage: page }),
    nextPage: () => {
      const { filters, fetchData } = get()

      set({ filters: { ...filters, skip: filters.skip + 1 } })
      fetchData()
    },
    resetDataNew: () => null,
    setFilters: (filters: FilterParams) => set((state) => ({ filters: { ...state.filters, ...filters, page: 0 } })),
    setSidebarFilterCounts: (sidebarFilterCounts) => set({ sidebarFilterCounts }),
    setTrendingTopics: (trendingTopics) => set({ trendingTopics }),
    setStats: (stats) => set({ stats }),
    setIsFetching: (isFetching) => set({ isFetching }),

    setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
    setQueuedSources: (queuedSources) => set({ queuedSources }),
    setSidebarFilter: (sidebarFilter: string) => set({ sidebarFilter }),
    setSelectedTimestamp: (selectedTimestamp) => set({ selectedTimestamp }),
    setSources: (sources) => set({ sources }),
    setHideNodeDetails: (hideNodeDetails) => set({ hideNodeDetails }),
    setSeedQuestions: (questions) => set({ seedQuestions: questions }),
    updateNode: (updatedNode) => {
      console.log(updatedNode)
    },
    addNewNode: (data) => {
      const { dataInitial: existingData } = get()

      if (!data?.nodes) {
        return
      }

      const uniqueIncomingNodes = deduplicateByRefId(data.nodes || [])
      const uniqueIncomingEdges = deduplicateByRefId(data.edges || [])

      // Step 2: Existing nodes and links from the current state
      const currentNodes = existingData?.nodes ? [...existingData.nodes] : []
      const currentLinks = existingData?.links ? [...existingData.links] : []

      // Step 3: Use Sets to track unique ref_ids of existing data
      const nodeRefIds = new Set(currentNodes.map((node) => node.ref_id))
      const linkRefIds = new Set(currentLinks.map((link) => link.ref_id))

      // Step 4: Filter new nodes and add only unique ones
      const newNodes = uniqueIncomingNodes.filter((node) => !nodeRefIds.has(node.ref_id))
      const updatedNodes = [...currentNodes, ...newNodes]

      // Update `nodeRefIds` with the new nodes added
      newNodes.forEach((node) => nodeRefIds.add(node.ref_id))

      // Step 5: Filter new links based on unique ref_ids and node presence
      const newLinks = uniqueIncomingEdges
        .filter((link) => !linkRefIds.has(link.ref_id)) // Check for unique `ref_id`
        .filter((link) => {
          const { source, target } = link

          return nodeRefIds.has(source) && nodeRefIds.has(target) // Ensure nodes exist
        })

      const updatedLinks = [...currentLinks, ...newLinks]

      // Step 6: Extract unique node types and create sidebar filters
      const nodeTypes = [...new Set(updatedNodes.map((node) => node.node_type))]
      const sidebarFilters = ['all', ...nodeTypes.map((type) => type.toLowerCase())]

      // Step 7: Calculate sidebar filter counts
      const sidebarFilterCounts = sidebarFilters.map((filter) => ({
        name: filter,
        count: updatedNodes.filter((node) => filter === 'all' || node.node_type?.toLowerCase() === filter).length,
      }))

      // Step 8: Update the state with the new data
      set({
        dataInitial: { nodes: updatedNodes, links: updatedLinks },
        dataNew: { nodes: newNodes, links: newLinks },
        nodeTypes,
        sidebarFilters,
        sidebarFilterCounts,
      })
    },
    removeNode: (id) => {
      console.log(id)
    },

    setRunningProjectId: (runningProjectId) => set({ runningProjectId, runningProjectMessages: [] }),
    setRunningProjectMessages: (message) => {
      const { runningProjectMessages } = get()

      set({ runningProjectMessages: [...runningProjectMessages, message] })
    },
    resetRunningProjectMessages: () => set({ runningProjectMessages: [] }),
    setAbortRequests: (abortRequest) => set({ abortRequest }),
  })),
)

export const useFilteredNodes = () =>
  useDataStore((s) => {
    if (s.sidebarFilter === 'all') {
      return s.dataInitial?.nodes || []
    }

    return (s.dataInitial?.nodes || []).filter((i) => i.node_type?.toLowerCase() === s.sidebarFilter.toLowerCase())
  })

export const useNodeTypes = () => useDataStore((s) => s.nodeTypes)
