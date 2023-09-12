import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'
import { createPresignedDownloadUrl } from '../s3Bucket/s3Bucket'

export const versionedFiles: QueryResolvers['versionedFiles'] = async () => {
  const results = await db.versionedFile.findMany()
  for (const result of results) {
    result.url = await createPresignedDownloadUrl(result.key)
  }
  return results
}

export const versionedFile: QueryResolvers['versionedFile'] = async ({ id }) => {
  const result = await db.versionedFile.findUnique({
    where: { id },
  })
  result.url = await createPresignedDownloadUrl(result.key)
  return result
}

export const createVersionedFile: MutationResolvers['createVersionedFile'] = ({
  input,
}) => {
  return db.versionedFile.create({
    data: input,
  })
}

export const updateVersionedFile: MutationResolvers['updateVersionedFile'] = ({
  id,
  input,
}) => {
  return db.versionedFile.update({
    data: input,
    where: { id },
  })
}

export const deleteVersionedFile: MutationResolvers['deleteVersionedFile'] = ({
  id,
}) => {
  return db.versionedFile.delete({
    where: { id },
  })
}
