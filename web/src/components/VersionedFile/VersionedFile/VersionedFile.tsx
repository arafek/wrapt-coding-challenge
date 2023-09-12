import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

import type {
  DeleteVersionedFileMutationVariables,
  FindVersionedFileById,
} from 'types/graphql'

const DELETE_VERSIONED_FILE_MUTATION = gql`
  mutation DeleteVersionedFileMutation($id: Int!) {
    deleteVersionedFile(id: $id) {
      id
    }
  }
`

interface Props {
  versionedFile: NonNullable<FindVersionedFileById['versionedFile']>
}

const VersionedFile = ({ versionedFile }: Props) => {
  const [deleteVersionedFile] = useMutation(DELETE_VERSIONED_FILE_MUTATION, {
    onCompleted: () => {
      toast.success('VersionedFile deleted')
      navigate(routes.versionedFiles())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteVersionedFileMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete versionedFile ' + id + '?')) {
      deleteVersionedFile({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            VersionedFile {versionedFile.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{versionedFile.id}</td>
            </tr>
            <tr>
              <th>Version</th>
              <td>{versionedFile.version}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{versionedFile.name}</td>
            </tr>
            <tr>
              <th>Url</th>
              <td>{versionedFile.url}</td>
            </tr>
            <tr>
              <th>Key</th>
              <td>{versionedFile.key}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(versionedFile.createdAt)}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(versionedFile.updatedAt)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editVersionedFile({ id: versionedFile.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(versionedFile.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default VersionedFile
