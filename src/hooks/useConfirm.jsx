import { useState, useCallback } from 'react'
import ConfirmModal from '../components/ConfirmModal'

export function useConfirm() {
  const [state, setState] = useState({ show: false, resolve: null, options: {} })

  const confirm = useCallback((options = {}) => {
    return new Promise(resolve => {
      setState({ show: true, resolve, options })
    })
  }, [])

  const handleConfirm = () => {
    state.resolve(true)
    setState(s => ({ ...s, show: false }))
  }

  const handleCancel = () => {
    state.resolve(false)
    setState(s => ({ ...s, show: false }))
  }

  const modal = (
    <ConfirmModal
      show={state.show}
      title={state.options.title}
      message={state.options.message}
      confirmLabel={state.options.confirmLabel}
      confirmVariant={state.options.confirmVariant}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  )

  return { confirm, modal }
}
