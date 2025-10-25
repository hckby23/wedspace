// Minimal shim to avoid the sonner dependency while keeping API compatibility
// Consumers can still import { Toaster, toast } from this module.

type ToasterProps = Record<string, unknown>

const Toaster = (_props: ToasterProps) => {
  // No-op visual toaster; notifications are normalized to window.alert.
  return null
}

const toast = (message: string | { description?: string; title?: string }) => {
  try {
    if (typeof window !== 'undefined') {
      if (typeof message === 'string') {
        window.alert(message)
      } else {
        const text = [message.title, message.description]
          .filter(Boolean)
          .join(' — ')
        window.alert(text)
      }
    }
  } catch {}
}

export { Toaster, toast }
