import HR from '../src/index'

it('I can reuse FIELD name in template', () => {
  const hr = new HR({ templates: { E: 'FIELD: OLDVALUE -> FIELD: NEWVALUE' } }).diff

  expect(hr(1, 2)).toEqual([': 1 -> : 2'])
  expect(hr({ val: 1 }, { val: 2 })).toEqual(['Val: 1 -> Val: 2'])
})
