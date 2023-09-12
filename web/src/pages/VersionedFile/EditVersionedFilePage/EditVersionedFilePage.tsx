import EditVersionedFileCell from 'src/components/VersionedFile/EditVersionedFileCell'

type VersionedFilePageProps = {
  id: number
}

const EditVersionedFilePage = ({ id }: VersionedFilePageProps) => {
  return <EditVersionedFileCell id={id} />
}

export default EditVersionedFilePage
