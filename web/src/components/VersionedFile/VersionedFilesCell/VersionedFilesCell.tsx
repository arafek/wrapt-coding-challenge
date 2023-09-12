import type { FindVersionedFiles } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import VersionedFiles from 'src/components/VersionedFile/VersionedFiles'

export const QUERY = gql`
  query FindVersionedFiles {
    versionedFiles {
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

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No versionedFiles yet. '}
      <Link to={routes.newVersionedFile()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  versionedFiles,
}: CellSuccessProps<FindVersionedFiles>) => {
  return <VersionedFiles versionedFiles={versionedFiles} />
}
