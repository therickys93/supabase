import { PropsWithChildren } from 'react'

import { withAuth } from 'hooks/misc/withAuth'
import ProjectLayout from '../ProjectLayout/ProjectLayout'
import ReportsMenu from './ReportsMenu'

interface ReportsLayoutProps {
  title?: string
}

const ReportsLayout = ({ title, children }: PropsWithChildren<ReportsLayoutProps>) => {
  return (
    <ProjectLayout title={title} product="Reports" productMenu={<ReportsMenu />} isBlocking={false}>
      {children}
    </ProjectLayout>
  )
}

export default withAuth(ReportsLayout)
