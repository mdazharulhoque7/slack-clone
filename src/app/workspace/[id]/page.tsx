
interface WorkspaceDetailPageProps {
    params: {
        id: string
     }
 }


const WorkspaceDetailPage = ({ params }: WorkspaceDetailPageProps) => {
  return (
      <div>WorkspaceDetail: { params.id }</div>
  )
}

export default WorkspaceDetailPage