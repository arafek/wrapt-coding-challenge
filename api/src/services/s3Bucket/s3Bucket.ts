import {
  ListBucketsCommand,
  CreateBucketCommand,
  GetBucketVersioningCommand,
  PutBucketVersioningCommand,
  GetBucketCorsCommand,
  PutBucketCorsCommand,
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { randomUUID } from 'crypto'
import type { QueryResolvers } from 'types/graphql'

import { logger } from "src/lib/logger"

const bucketName = process.env.S3_BUCKET_NAME

const client = new S3Client({})

export const checkBucketExistence = async (): Promise<boolean> => {
  const command = new ListBucketsCommand({})

  try {
    const { Buckets } = await client.send(command)
    return Buckets.some(bucket => bucket.Name === bucketName)
  } catch (error) {
    logger.error(error)
  }
}

export const createBucket = async (): Promise<string> => {
  const command = new CreateBucketCommand({
    Bucket: bucketName,
  })

  try {
    const { Location } = await client.send(command)
    return Location
  } catch (error) {
    logger.error(error)
  }
}

export const checkBucketVersioning = async (): Promise<boolean> => {
  const command = new GetBucketVersioningCommand({
    Bucket: bucketName,
  })

  try {
    const { Status } = await client.send(command)
    return Status === 'Enabled'
  } catch (error) {
    logger.error(error)
  }
}

export const setBucketVersioning = async (): Promise<boolean> => {
  const command = new PutBucketVersioningCommand({
    Bucket: bucketName,
    VersioningConfiguration: { Status: 'Enabled' },
  })

  try {
    await client.send(command)
    return true
  } catch (error) {
    logger.error(error)
  }
}

export const checkBucketCors = async (): Promise<boolean> => {
  const command = new GetBucketCorsCommand({
    Bucket: bucketName,
  })

  try {
    const { CORSRules } = await client.send(command)
    return (
      CORSRules.length === 1 &&
      CORSRules[0]?.AllowedHeaders.includes("*") &&
      CORSRules[0]?.AllowedMethods.includes("GET") &&
      CORSRules[0]?.AllowedMethods.includes("PUT") &&
      CORSRules[0]?.AllowedOrigins.includes("*")
    )
  } catch (error) {
    logger.error(error)
  }
}

export const setBucketCors = async (): Promise<boolean> => {
  const command = new PutBucketCorsCommand({
    Bucket: bucketName,
    CORSConfiguration: {
      CORSRules: [{
        AllowedHeaders: ["*"],
        AllowedMethods: ["GET", "PUT"],
        AllowedOrigins: ["*"],
        ExposeHeaders: []
      }]
    }
  })

  try {
    await client.send(command)
    return true
  } catch (error) {
    logger.error(error)
  }
}

export const setupBucket = async (): Promise<void> => {
  logger.info(`Setting up S3 Bucket ${bucketName}`)

  if (!(await checkBucketExistence())) {
    logger.info(`Bucket does not exist`)
    const location = await createBucket();
    logger.info(`Bucket created at ${location}`)
  }

  if (!(await checkBucketVersioning())) {
    logger.info(`Bucket is not versioned`)
    await setBucketVersioning()
    logger.info(`Bucket versioning has been enabled`)
  }

  if (!(await checkBucketCors())) {
    logger.info(`Bucket CORS is not configurated`)
    await setBucketCors()
    logger.info(`Bucket CORS has been configurated`)
  }

  logger.info(`S3 Bucket ${bucketName} is all set up`)
}

// TODO: find a better place to invoke this
setupBucket()

export const createPresignedUploadUrl = async (key: string): Promise<string> => {
  const command = new PutObjectCommand({ Bucket: bucketName, Key: key })
  return getSignedUrl(client, command, { expiresIn: 3600 })
}

export const setupFileUpload: QueryResolvers['setupFileUpload'] = async ({ key }) => {
  const fileKey = key ?? randomUUID()
  const url = await createPresignedUploadUrl(fileKey)
  return { key: fileKey, url }
}

export const createPresignedDownloadUrl = async (key: string): Promise<string> => {
  const command = new GetObjectCommand({ Bucket: bucketName, Key: key })
  console.log('creating presigned url for download of object with key ', key)
  return getSignedUrl(client, command, { expiresIn: 3600 })
}
