import { flushSync } from 'react-dom'

export function navigateWithTransition(navigate, to, transitionName = '') {
  if (!document.startViewTransition) {
    navigate(to)
    return
  }

  if (transitionName) {
    document.documentElement.dataset.transition = transitionName
  }

  const transition = document.startViewTransition(() => {
    flushSync(() => {
      navigate(to)
    })
  }).finished.finally(() => {
    delete document.documentElement.dataset.transition
  })

  return transition
}
