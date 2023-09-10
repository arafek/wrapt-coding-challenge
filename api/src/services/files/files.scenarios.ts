import type { Prisma, File } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.FileCreateArgs>({
  file: {
    one: { data: { name: 'String', url: 'String', checksum: 'String' } },
    two: { data: { name: 'String', url: 'String', checksum: 'String' } },
  },
})

export type StandardScenario = ScenarioData<File, 'file'>
