const fs = require('fs')
const path = require('path')
const { snakeCase } = require('snake-case')

const src = path.join(__dirname, './src')
function validateFilename(filename) {
  const rule = /^([A-Za-z0-9\_]*)\.manifest\.json$/
  if (!rule.test(filename)) return false
  return true
}
function validateManifest(manifest) {
  const rule = /^[a-z0-9\_]*$/
  if (!manifest || typeof manifest != 'object') return false
  if (!manifest.appId || !rule.test(manifest.appId)) return false
  if (!manifest.url || !manifest.name || !manifest.description) return false
  if (snakeCase(manifest.name) !== manifest.appId) return false
  if (!manifest.author || !manifest.author.name || !manifest.author.email)
    return false
  return true
}

const register = {}
fs.readdirSync(src).forEach(function (file) {
  const manifest = require(`./src/${file}`)
  const name = manifest.name
  if (!validateFilename(file)) throw new Error(`${name}: Invalid filename.`)
  if (!validateManifest(manifest)) throw new Error(`${name}: Invalid manifest.`)
  if (file != `${manifest.appId}.manifest.json`)
    throw new Error(
      `${name}: Invalid name. The file name must be identical to the app id.`,
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
