import { useEffect, useRef, useState, useCallback } from 'react'
import {
  ALL_FRONT_MUSCLE_IDS,
  ALL_BACK_MUSCLE_IDS,
  VIEW_MUSCLE_IDS,
  getCategoryMuscleIds,
} from '../muscleData'

const ALL_CATEGORIES = new Set(['Full Body', 'Calisthenics'])

function BodyDiagram({ activeCategories, muscleIds: explicitMuscleIds, size = 200, view: initialView = 'front' }) {
  const containerRef = useRef(null)
  const svgRootRef = useRef(null)
  const highlightRef = useRef(null)
  const [view, setView] = useState(initialView)
  const [loadKey, setLoadKey] = useState(0)

  const svgPath = view === 'back' ? '/muscle_layer_back.svg' : '/muscle_layer_front.svg'
  const allIdsForView = view === 'back' ? ALL_BACK_MUSCLE_IDS : ALL_FRONT_MUSCLE_IDS

  const doHighlight = useCallback(() => {
    const svg = svgRootRef.current
    if (!svg) return

    let targetIds
    if (explicitMuscleIds && explicitMuscleIds.length > 0) {
      targetIds = new Set()
      for (const id of explicitMuscleIds) {
        if (VIEW_MUSCLE_IDS[view].has(id)) targetIds.add(id)
      }
    } else if (activeCategories) {
      targetIds = new Set()
      const cats = Array.isArray(activeCategories) ? activeCategories : [activeCategories]
      for (const cat of cats) {
        if (ALL_CATEGORIES.has(cat)) {
          for (const id of allIdsForView) targetIds.add(id)
        } else {
          const ids = getCategoryMuscleIds(cat, view)
          if (ids) for (const id of ids) {
            if (VIEW_MUSCLE_IDS[view].has(id)) targetIds.add(id)
          }
        }
      }
    } else {
      targetIds = new Set()
    }

    highlightRef.current = new Map()
    for (const id of allIdsForView) {
      const el = svg.getElementById(id)
      if (el) {
        highlightRef.current.set(id, el)
        if (targetIds.has(id)) {
          el.style.setProperty('fill', 'var(--color-muscle-highlight)', 'important')
          el.classList.add('body-region-active')
        } else {
          el.style.removeProperty('fill')
          el.classList.remove('body-region-active')
        }
      }
    }
  }, [activeCategories, explicitMuscleIds, view, allIdsForView])

  useEffect(() => {
    fetch(svgPath)
      .then(r => r.text())
      .then(html => {
        containerRef.current.innerHTML = html
        svgRootRef.current = containerRef.current.querySelector('svg')
        if (svgRootRef.current) {
          svgRootRef.current.style.width = '100%'
          svgRootRef.current.style.height = '100%'
          svgRootRef.current.removeAttribute('width')
          svgRootRef.current.removeAttribute('height')
        }
        doHighlight()
        setLoadKey(k => k + 1)
      })
  }, [svgPath, doHighlight])

  const svgW = 587
  const svgH = 1137

  return (
    <div className="body-diagram-wrap" style={{ width: size }}>
      <div
        ref={containerRef}
        style={{ width: '100%', height: size * svgH / svgW }}
        className="body-diagram"
      />
      <button
        type="button"
        className="btn btn-sm btn-outline view-toggle"
        onClick={() => setView(v => v === 'front' ? 'back' : 'front')}
      >
        {view === 'front' ? 'Tampilkan Belakang' : 'Tampilkan Depan'}
      </button>
    </div>
  )
}

export default BodyDiagram
