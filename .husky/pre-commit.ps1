Write-Host "Node version: $(node -v)"
Write-Host "NPM version: $(npm -v)"
Write-Host "Running lint-staged..."
npx lint-staged
Write-Host "Running ng lint..."
npm run lint
Write-Host "Running Angular build type check..."
if (!(npm run tsc)) {
  Write-Host "Angular build/type check failed. Commit aborted."
  exit 1
}
Write-Host "Running tests..."
npx ng test --browsers=ChromeHeadless --watch=false
Write-Host "Running prettier check..."
npx prettier --check . 