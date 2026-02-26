import { JobRuns } from "@/components/job-runs/job-runs"

export default function JobRunsPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-auto p-6">
        <JobRuns />
      </main>
    </div>
  )
}
