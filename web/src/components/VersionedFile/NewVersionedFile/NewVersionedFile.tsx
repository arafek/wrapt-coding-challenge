import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import VersionedFileForm from 'src/components/VersionedFile/VersionedFileForm'

import type { CreateVersionedFileInput } from 'types/graphql'

const CREATE_VERSIONED_FILE_MUTATION = gql`
  mutation CreateVersionedFileMutation($input: CreateVersionedFileInput!) {
    createVersionedFile(input: $input) {
      id
    }
  }
`

const NewVersionedFile = () => {
  const [createVersionedFile, { loading, error }] = useMutation(
    CREATE_VERSIONED_FILE_MUTATION,
    {
      onCompleted: () => {
        toast.success('VersionedFile created')
        navigate(routes.versionedFiles())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateVersionedFileInput) => {
    createVersionedFile({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New VersionedFile</h2>
      </header>
      <div className="rw-segment-main">
        <VersionedFileForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewVersionedFile
