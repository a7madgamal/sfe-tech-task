Write-Host "Node version: $(node -v)"
Write-Host "NPM version: $(npm -v)"

Write-Host "Running lint-staged..."
if (!(npx lint-staged)) {
  Write-Host "lint-staged failed. Commit aborted."
  exit 1
}

Write-Host "Running ng lint..."
if (!(npm run lint)) {
  Write-Host "ng lint failed. Commit aborted."
  exit 1
}

Write-Host "Running Angular build type check..."
if (!(npm run tsc)) {
  Write-Host "Angular build/type check failed. Commit aborted."
  exit 1
}

Write-Host "Running tests..."
if (!(npx ng test --browsers=ChromeHeadless --watch=false)) {
  Write-Host "Tests failed. Commit aborted."
  exit 1
}

Write-Host "Running prettier check..."
if (!(npx prettier --check .)) {
  Write-Host "Prettier check failed. Commit aborted."
  exit 1
} 