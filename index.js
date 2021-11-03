const fs = require('fs')
const path = require('path')

const src = path.join(__dirname, './src')
function validate(manifest) {
  const rule = /^[A-Za-z0-9]*$/
  if (!manifest || typeof manifest != 'object') return false
  if (!manifest.appId || !rule.test(manifest.appId)) return false
  if (!manifest.url || !manifest.name || !manifest.description) return false
  if (!manifest.author || !manifest.author.name || !manifest.author.email)
    return false
  return true
}

const register = {}
fs.readdirSync(src).forEach(function (file) {
  const manifest = require(`./src/${file}`)
  if (!validate(manifest)) throw new Error('Invalid manifest.')
  if (file != `${manifest.appId}.json`)
    throw new Error(
      'Invalid name. The file name must be identical to the app id.',
    )
  register[manifest.appId] = manifest
})
if (!fs.existsSync('./build')) fs.mkdirSync('./build')
fs.writeFileSync('./build/register.json', JSON.stringify(register, null, 2))

console.log('********************************')
console.log(
  `There are ${Object.keys(register).length} applications have been built!`,
)
console.log('********************************')
