import type { QueryResolvers, MutationResolvers } from 'types/graphql'
import { Prisma } from '@prisma/client'
import { RedwoodError } from '@redwoodjs/api'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

export const files: QueryResolvers['files'] = () => {
  return db.file.findMany()
}

export const file: QueryResolvers['file'] = ({ id }) => {
  return db.file.findUnique({
    where: { id },
  })
}

export const createFile: MutationResolvers['createFile'] = async ({ input }) => {
  try {
    return await db.file.create({
      data: input,
    })
  } catch (error) {
    logger.error(error, 'Error creating file')

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2022: Unique constraint failed
      // Prisma error codes: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
      if (error.code === 'P2002') {
        logger.error('The file already exists', error)
        throw new RedwoodError('The file already exists')
      }
    }

    throw error
  }
}

export const updateFile: MutationResolvers['updateFile'] = async ({ id, input }) => {
  try {
    return await db.file.update({
      data: input,
      where: { id },
    })
  } catch (error) {
    logger.error(error, 'Error updating file')

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2022: Unique constraint failed
      // Prisma error codes: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
      if (error.code === 'P2002') {
        logger.error('The file already exists', error)
        throw new RedwoodError('The file already exists')
      }
    }

    throw error
  }
}

export const deleteFile: MutationResolvers['deleteFile'] = ({ id }) => {
  return db.file.delete({
    where: { id },
  })
}
