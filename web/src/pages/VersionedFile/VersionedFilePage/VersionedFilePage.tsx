import VersionedFileCell from 'src/components/VersionedFile/VersionedFileCell'

type VersionedFilePageProps = {
  id: number
}

const VersionedFilePage = ({ id }: VersionedFilePageProps) => {
  return <VersionedFileCell id={id} />
}

export default VersionedFilePage
