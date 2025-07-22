Write-Host "Node version: $(node -v)"
Write-Host "NPM version: $(npm -v)"
Write-Host "Running lint-staged..."
npx lint-staged
Write-Host "Running npm run lint..."
npm run lint
Write-Host "Running tests..."
npm test
Write-Host "Running prettier check..."
npx prettier --check . 