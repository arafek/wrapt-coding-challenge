import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/VersionedFile/VersionedFilesCell'
import { timeTag, truncate } from 'src/lib/formatters'

import type {
  DeleteVersionedFileMutationVariables,
  FindVersionedFiles,
} from 'types/graphql'

const DELETE_VERSIONED_FILE_MUTATION = gql`
  mutation DeleteVersionedFileMutation($id: Int!) {
    deleteVersionedFile(id: $id) {
      id
    }
  }
`

const VersionedFilesList = ({ versionedFiles }: FindVersionedFiles) => {
  const [deleteVersionedFile] = useMutation(DELETE_VERSIONED_FILE_MUTATION, {
    onCompleted: () => {
      toast.success('VersionedFile deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteVersionedFileMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete versionedFile ' + id + '?')) {
      deleteVersionedFile({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Version</th>
            <th>Name</th>
            <th>Url</th>
            <th>Key</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {versionedFiles.map((versionedFile) => (
            <tr key={versionedFile.id}>
              <td>{truncate(versionedFile.id)}</td>
              <td>{truncate(versionedFile.version)}</td>
              <td>{truncate(versionedFile.name)}</td>
              <td>{truncate(versionedFile.url)}</td>
              <td>{truncate(versionedFile.key)}</td>
              <td>{timeTag(versionedFile.createdAt)}</td>
              <td>{timeTag(versionedFile.updatedAt)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.versionedFile({ id: versionedFile.id })}
                    title={'Show versionedFile ' + versionedFile.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editVersionedFile({ id: versionedFile.id })}
                    title={'Edit versionedFile ' + versionedFile.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete versionedFile ' + versionedFile.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(versionedFile.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default VersionedFilesList
