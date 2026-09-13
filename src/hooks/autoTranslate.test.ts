import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/translate', () => ({
  translationEnabled: () => true,
  translateArToEn: vi.fn(async (input: Record<string, string>) =>
    Object.fromEntries(Object.entries(input).map(([k, v]) => [k, `EN(${v})`])),
  ),
}))

import { fillEnglish, TRANSLATE_SPECS } from './autoTranslate'
import type { Payload } from 'payload'

function fakePayload(enDoc: Record<string, unknown>) {
  const update = vi.fn(async () => ({}))
  const payload = {
    findByID: vi.fn(async () => enDoc),
    update,
    logger: { info: vi.fn(), warn: vi.fn() },
  } as unknown as Payload
  return { payload, update }
}

describe('fillEnglish', () => {
  it('translates only the fields that are empty in English', async () => {
    const { payload, update } = fakePayload({ title: 'Already English', shortDescription: null })
    const done = await fillEnglish(
      payload,
      'products',
      { id: 1, title: 'عنوان', shortDescription: 'وصف', specs: [] },
      TRANSLATE_SPECS.products,
    )
    expect(done).toEqual(['shortDescription'])
    const data = (update.mock.calls[0] as unknown as [{ data: Record<string, unknown> }])[0].data
    expect(data.shortDescription).toBe('EN(وصف)')
    expect(data.title).toBeUndefined()
  })

  it('fills array rows, keeping human English where present', async () => {
    const { payload, update } = fakePayload({
      specs: [{ key: 'Capacity', value: null }, { key: null, value: null }],
    })
    const done = await fillEnglish(
      payload,
      'products',
      {
        id: 1,
        specs: [
          { id: 'a', key: 'السعة', value: '6 كجم' },
          { id: 'b', key: 'الضغط', value: '15 بار' },
        ],
      },
      TRANSLATE_SPECS.products,
    )
    expect(done.sort()).toEqual(['specs.0.value', 'specs.1.key', 'specs.1.value'])
    const data = (update.mock.calls[0] as unknown as [{ data: Record<string, unknown> }])[0].data
    expect(data.specs).toEqual([
      { id: 'a', key: 'Capacity', value: 'EN(6 كجم)' },
      { id: 'b', key: 'EN(الضغط)', value: 'EN(15 بار)' },
    ])
  })

  it('does nothing when English is complete', async () => {
    const { payload, update } = fakePayload({ title: 'Done', description: 'Done' })
    const done = await fillEnglish(
      payload,
      'categories',
      { id: 1, title: 'x', description: 'y' },
      TRANSLATE_SPECS.categories,
    )
    expect(done).toEqual([])
    expect(update).not.toHaveBeenCalled()
  })
})
