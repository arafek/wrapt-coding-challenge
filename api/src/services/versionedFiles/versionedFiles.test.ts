import type { VersionedFile } from '@prisma/client'

import {
  versionedFiles,
  versionedFile,
  createVersionedFile,
  updateVersionedFile,
  deleteVersionedFile,
} from './versionedFiles'
import type { StandardScenario } from './versionedFiles.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('versionedFiles', () => {
  scenario('returns all versionedFiles', async (scenario: StandardScenario) => {
    const result = await versionedFiles()

    expect(result.length).toEqual(Object.keys(scenario.versionedFile).length)
  })

  scenario(
    'returns a single versionedFile',
    async (scenario: StandardScenario) => {
      const result = await versionedFile({ id: scenario.versionedFile.one.id })

      expect(result).toEqual(scenario.versionedFile.one)
    }
  )

  scenario('creates a versionedFile', async () => {
    const result = await createVersionedFile({
      input: { name: 'String', url: 'String', key: 'String' },
    })

    expect(result.name).toEqual('String')
    expect(result.url).toEqual('String')
    expect(result.key).toEqual('String')
  })

  scenario('updates a versionedFile', async (scenario: StandardScenario) => {
    const original = (await versionedFile({
      id: scenario.versionedFile.one.id,
    })) as VersionedFile
    const result = await updateVersionedFile({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a versionedFile', async (scenario: StandardScenario) => {
    const original = (await deleteVersionedFile({
      id: scenario.versionedFile.one.id,
    })) as VersionedFile
    const result = await versionedFile({ id: original.id })

    expect(result).toEqual(null)
  })
})
