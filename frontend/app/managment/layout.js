'use client'

import { ManagmentGuard } from './ManagmentGuard'

export default function ManagmentLayout({ children }) {
  return <ManagmentGuard>{children}</ManagmentGuard>
}
