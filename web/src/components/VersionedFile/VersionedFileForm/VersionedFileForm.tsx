import { useState } from 'react'
import { useQuery } from '@redwoodjs/web'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  FileField,
  Submit,
} from '@redwoodjs/forms'
import axios from 'axios'

import type {
  EditVersionedFileById,
  UpdateVersionedFileInput,
} from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'

export const SETUP_FILE_UPLOAD_QUERY = gql`
  query SetupFileUploadQuery(
    $key: String
  ) {
    setupFileUpload(key: $key) {
      key
      url
    }
  }
`

type FormVersionedFile = NonNullable<EditVersionedFileById['versionedFile']>

interface VersionedFileFormProps {
  versionedFile?: EditVersionedFileById['versionedFile']
  onSave: (data: UpdateVersionedFileInput, id?: FormVersionedFile['id']) => void
  error: RWGqlError
  loading: boolean
}

const VersionedFileForm = (props: VersionedFileFormProps) => {
  const [name, setName] = useState(props.versionedFile?.name ?? '')
  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }
  const [file, setFile] = useState<File>()
  const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files[0])
    setName(event.target.files[0].name)
  }
  const { loading: fileUploadLoading, data: fileUploadData } = useQuery(SETUP_FILE_UPLOAD_QUERY, { variables: { key: props?.versionedFile?.key }});

  const onSubmit = async (data: FormVersionedFile) => {
    const { url, key } = fileUploadData.setupFileUpload;
    const response = await axios.put(url, file);
    const dataToSave = { name, key, version: (props.versionedFile?.version ?? 0) + 1 }
    props.onSave(dataToSave, props?.versionedFile?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormVersionedFile> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="name"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Name
        </Label>

        <TextField
          name="name"
          value={name}
          onChange={onChangeName}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="name" className="rw-field-error" />

        <Label
          name="file"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          File
        </Label>

        <FileField
          name="file"
          onChange={onChangeFile}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="file" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default VersionedFileForm
