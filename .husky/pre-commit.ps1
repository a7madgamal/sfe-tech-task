Write-Host "Node version: $(node -v)"
Write-Host "NPM version: $(npm -v)"
Write-Host "Running lint-staged..."
npx lint-staged
Write-Host "Running npm run lint..."
npm run lint
Write-Host "Running TypeScript type check..."
if (!(npm run tsc)) {
  Write-Host "TypeScript type check failed. Commit aborted."
  exit 1
}
Write-Host "Running tests..."
npm test
Write-Host "Running prettier check..."
npx prettier --check . 