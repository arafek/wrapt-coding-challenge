import type { FindVersionedFileById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import VersionedFile from 'src/components/VersionedFile/VersionedFile'

export const QUERY = gql`
  query FindVersionedFileById($id: Int!) {
    versionedFile: versionedFile(id: $id) {
      id
      version
      name
      url
      key
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>VersionedFile not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  versionedFile,
}: CellSuccessProps<FindVersionedFileById>) => {
  return <VersionedFile versionedFile={versionedFile} />
}
