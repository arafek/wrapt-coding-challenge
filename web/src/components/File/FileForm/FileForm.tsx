import { useState } from 'react'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'
import { PickerInline } from 'filestack-react'

import type { EditFileById, UpdateFileInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'

type FormFile = NonNullable<EditFileById['file']>

interface FileFormProps {
  file?: EditFileById['file']
  onSave: (data: UpdateFileInput, id?: FormFile['id']) => void
  error: RWGqlError
  loading: boolean
}

const FileForm = (props: FileFormProps) => {
  const [name, setName] = useState(props?.file?.name ?? '')
  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }

  const [url, setUrl] = useState(props?.file?.url)

  const getFileChecksum = async (fileUrl: string): Promise<string> => {
    const response = await fetch(`${fileUrl}/metadata?md5=true`)
    const json = await response.json()
    return json.md5;
  }

  const onSubmit = async (data: FormFile) => {
    const checksum = await getFileChecksum(url);
    const dataWithUrl = Object.assign(data, { url, name, checksum })
    props.onSave(dataWithUrl, props?.file?.id)
  }

  const onFileUpload = (result: any) => {
    setUrl(result.filesUploaded[0].url)
    setName(result.filesUploaded[0].filename)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormFile> onSubmit={onSubmit} error={props.error}>
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

        <PickerInline
          apikey={process.env.REDWOOD_ENV_FILESTACK_API_KEY}
          onUploadDone={onFileUpload}
          pickerOptions={{
            maxFiles: 1,
            startUploadingWhenMaxFilesReached: true
          }}
        />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default FileForm
