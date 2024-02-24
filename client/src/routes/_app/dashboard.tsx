import { createFileRoute } from '@tanstack/react-router'
import ClientTable from '@/components/ClientTable'
import CallClient from '@/components/CallClient'
import CreateClient from '@/components/CreateClient'

export const Route = createFileRoute('/_app/dashboard')({
  component: Dashboard
})

function Dashboard() {
  return (
    <div className='flex'>
      <div>
        <CallClient />
        <CreateClient />
      </div>
      {/* <ClientTable /> */}
    </div>
  )
}