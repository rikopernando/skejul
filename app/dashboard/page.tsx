import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import data from "@/app/dashboard/data.json"
import { ScheduleCalendar } from "@/components/schedule/schedule-calendar"
import { AnnouncementsList } from "@/components/schedule/announcements-list"

export default function Page() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ScheduleCalendar />
        </div>
        <div className="px-4 lg:px-6">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Latest Announcements</h2>
          <AnnouncementsList />
        </div>
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        <DataTable data={data} />
      </div>
    </div>
  )
}