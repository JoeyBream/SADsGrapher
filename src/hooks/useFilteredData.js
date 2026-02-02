import { useMemo } from 'react'
import { filterDataByTypes, filterDataBySearch } from '../lib/dataTransform'

export function useFilteredData(rawData, typeFilter, searchQuery) {
  return useMemo(() => {
    let data = rawData
    if (typeFilter && typeFilter.size > 0) {
      data = filterDataByTypes(data, typeFilter)
    }
    if (searchQuery && searchQuery.trim() !== '') {
      data = filterDataBySearch(data, searchQuery)
    }
    return data
  }, [rawData, typeFilter, searchQuery])
}
