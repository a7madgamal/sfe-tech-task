Write-Host "Node version: $(node -v)"
Write-Host "NPM version: $(npm -v)"

Write-Host "Running lint-staged..."
npx lint-staged
if ($LASTEXITCODE -ne 0) {
  Write-Host "lint-staged failed. Commit aborted."
  exit 1
}

Write-Host "Running ng lint..."
npm run lint
if ($LASTEXITCODE -ne 0) {
  Write-Host "ng lint failed. Commit aborted."
  exit 1
}

Write-Host "Running Angular build type check..."
npm run tsc
if ($LASTEXITCODE -ne 0) {
  Write-Host "Angular build/type check failed. Commit aborted."
  exit 1
}

Write-Host "Running tests..."
npx ng test --browsers=ChromeHeadless --watch=false
if ($LASTEXITCODE -ne 0) {
  Write-Host "Tests failed. Commit aborted."
  exit 1
}

Write-Host "Running prettier check..."
npx prettier --check .
if ($LASTEXITCODE -ne 0) {
  Write-Host "Prettier check failed. Commit aborted."
  exit 1
}
