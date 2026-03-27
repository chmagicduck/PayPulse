const fs = require('fs')
const path = require('path')

const ROOT = process.cwd()
const FEATURES_DIR = path.join(ROOT, 'miniprogram', 'features')

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...walk(fullPath))
      continue
    }
    if (entry.isFile() && fullPath.endsWith('.less')) {
      files.push(fullPath)
    }
  }

  return files
}

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split(/\r?\n/)
  const errors = []

  lines.forEach((line, index) => {
    const lineNumber = index + 1

    for (const match of line.matchAll(/font-size\s*:\s*([^;]+);/g)) {
      const value = match[1].trim()
      if (!value.startsWith('@fs-')) {
        errors.push({
          line: lineNumber,
          rule: 'font-size',
          value,
        })
      }
    }

    for (const match of line.matchAll(/(?<![\w-])color\s*:\s*([^;]+);/g)) {
      const value = match[1].trim()
      if (!value.startsWith('@text-') && value !== 'currentColor' && value !== 'inherit') {
        errors.push({
          line: lineNumber,
          rule: 'color',
          value,
        })
      }
    }
  })

  return errors
}

function main() {
  const files = walk(FEATURES_DIR)
  const errors = []

  for (const file of files) {
    const fileErrors = validateFile(file)
    for (const error of fileErrors) {
      errors.push({
        file: path.relative(ROOT, file),
        ...error,
      })
    }
  }

  if (errors.length === 0) {
    console.log('Style token check passed.')
    return
  }

  console.error('Style token check failed:')
  for (const error of errors) {
    console.error(`- ${error.file}:${error.line} ${error.rule} must use token, found "${error.value}"`)
  }
  process.exitCode = 1
}

main()
