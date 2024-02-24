import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/display')({
  component: Display
})

function Display() {
  const desksQuery = useQuery({
    queryKey: []
  })
}