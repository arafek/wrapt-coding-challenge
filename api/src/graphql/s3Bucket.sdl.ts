export const schema = gql`
  type FileUploadData {
    key: String!
    url: String!
  }

  type Query {
    setupFileUpload(key: String): FileUploadData! @requireAuth
  }
`
