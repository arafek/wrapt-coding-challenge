import type { Prisma, VersionedFile } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.VersionedFileCreateArgs>({
  versionedFile: {
    one: { data: { name: 'String', url: 'String', key: 'String' } },
    two: { data: { name: 'String', url: 'String', key: 'String' } },
  },
})

export type StandardScenario = ScenarioData<VersionedFile, 'versionedFile'>
