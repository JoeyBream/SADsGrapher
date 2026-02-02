import { useState, useEffect } from 'react'
import { useDashboard } from '../../context/DashboardContext'
import styles from './SearchFilter.module.css'

export default function SearchFilter() {
  const { state, dispatch } = useDashboard()
  const [local, setLocal] = useState(state.searchQuery)

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'SET_SEARCH', payload: local })
    }, 250)
    return () => clearTimeout(timer)
  }, [local, dispatch])

  return (
    <div className={styles.search}>
      <h3 className={styles.heading}>Search</h3>
      <div className={styles.inputWrapper}>
        <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
        <input
          type="text"
          className={styles.input}
          placeholder="Find an animal or condition..."
          value={local}
          onChange={(e) => setLocal(e.target.value)}
        />
        {local && (
          <button
            className={styles.clear}
            onClick={() => setLocal('')}
            aria-label="Clear search"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  )
}
