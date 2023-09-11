export const schema = gql`
  type VersionedFile {
    id: Int!
    version: Int!
    name: String!
    url: String
    key: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    versionedFiles: [VersionedFile!]! @requireAuth
    versionedFile(id: Int!): VersionedFile @requireAuth
  }

  input CreateVersionedFileInput {
    version: Int!
    name: String!
    key: String!
  }

  input UpdateVersionedFileInput {
    version: Int
    name: String
    key: String
  }

  type Mutation {
    createVersionedFile(input: CreateVersionedFileInput!): VersionedFile!
      @requireAuth
    updateVersionedFile(
      id: Int!
      input: UpdateVersionedFileInput!
    ): VersionedFile! @requireAuth
    deleteVersionedFile(id: Int!): VersionedFile! @requireAuth
  }
`
