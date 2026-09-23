import { categories, menuItems } from '../src/data/menu.js'

function sqlStr(value) {
  if (value === null || value === undefined) return 'null'
  return `'${String(value).replace(/'/g, "''")}'`
}

const lines = []

lines.push('-- Nami Ramen — seed data')
lines.push('-- Generated from src/data/menu.js by scripts/generate-seed.mjs')
lines.push('-- Run after schema.sql. Safe to re-run (upserts by id).')
lines.push('')
lines.push('insert into categories (id, name, blurb) values')
lines.push(
  categories
    .map((c) => `  (${sqlStr(c.id)}, ${sqlStr(c.name)}, ${sqlStr(c.blurb)})`)
    .join(',\n') + ''
)
lines.push('on conflict (id) do update set')
lines.push('  name = excluded.name,')
lines.push('  blurb = excluded.blurb;')
lines.push('')
lines.push('insert into menu_items (id, category_id, image, name, price, description, tag, spice) values')
lines.push(
  menuItems
    .map(
      (m) =>
        `  (${sqlStr(m.id)}, ${sqlStr(m.categoryId)}, ${sqlStr(m.image)}, ${sqlStr(m.name)}, ${m.price}, ${sqlStr(m.description)}, ${sqlStr(m.tag)}, ${m.spice})`
    )
    .join(',\n')
)
lines.push('on conflict (id) do update set')
lines.push('  category_id = excluded.category_id,')
lines.push('  image = excluded.image,')
lines.push('  name = excluded.name,')
lines.push('  price = excluded.price,')
lines.push('  description = excluded.description,')
lines.push('  tag = excluded.tag,')
lines.push('  spice = excluded.spice;')
lines.push('')

console.log(lines.join('\n'))
