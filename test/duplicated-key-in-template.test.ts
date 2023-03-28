import HR from '../src/index'

it('I can reuse FIELD name in template', () => {
  const hr = new HR({ templates: { E: 'FIELD: OLDVALUE -> FIELD: NEWVALUE' } }).diff

  expect(hr(1, 2)).toEqual(['FIELD: 1 -> FIELD: 2'])
})
