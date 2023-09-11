import type {
  EditVersionedFileById,
  UpdateVersionedFileInput,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import VersionedFileForm from 'src/components/VersionedFile/VersionedFileForm'

export const QUERY = gql`
  query EditVersionedFileById($id: Int!) {
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
const UPDATE_VERSIONED_FILE_MUTATION = gql`
  mutation UpdateVersionedFileMutation(
    $id: Int!
    $input: UpdateVersionedFileInput!
  ) {
    updateVersionedFile(id: $id, input: $input) {
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

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  versionedFile,
}: CellSuccessProps<EditVersionedFileById>) => {
  const [updateVersionedFile, { loading, error }] = useMutation(
    UPDATE_VERSIONED_FILE_MUTATION,
    {
      onCompleted: () => {
        toast.success('VersionedFile updated')
        navigate(routes.versionedFiles())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateVersionedFileInput,
    id: EditVersionedFileById['versionedFile']['id']
  ) => {
    updateVersionedFile({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit VersionedFile {versionedFile?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <VersionedFileForm
          versionedFile={versionedFile}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
