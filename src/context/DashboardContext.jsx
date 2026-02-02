import { createContext, useContext, useReducer } from 'react'

const DashboardContext = createContext(null)

const initialState = {
  typeFilter: new Set(),
  searchQuery: '',
  hoveredNode: null,
  selectedNode: null,
  mousePosition: { x: 0, y: 0 },
  viewMode: '2d',
}

function dashboardReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_TYPE': {
      const next = new Set(state.typeFilter)
      if (next.has(action.payload)) {
        next.delete(action.payload)
      } else {
        next.add(action.payload)
      }
      return { ...state, typeFilter: next }
    }
    case 'SET_ALL_TYPES':
      return { ...state, typeFilter: new Set() }
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload }
    case 'SET_HOVERED':
      return { ...state, hoveredNode: action.payload }
    case 'SET_SELECTED':
      return { ...state, selectedNode: action.payload }
    case 'SET_MOUSE':
      return { ...state, mousePosition: action.payload }
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload }
    default:
      return state
  }
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState)

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}
