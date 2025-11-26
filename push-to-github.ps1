# GitHub Push Helper Script
# This script helps you push to the shared GitHub repository

param(
    [Parameter(Mandatory=$true)]
    [string]$Token
)

Write-Host "Setting up remote with token authentication..." -ForegroundColor Green

# Update remote URL to use token
$remoteUrl = "https://$Token@github.com/mujtabach2/Dental-Clinic-DB-application.git"
git remote set-url origin $remoteUrl

Write-Host "Pushing to GitHub..." -ForegroundColor Green
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSuccessfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "`nNote: For security, consider removing the token from the remote URL after pushing:" -ForegroundColor Yellow
    Write-Host "git remote set-url origin https://github.com/mujtabach2/Dental-Clinic-DB-application.git" -ForegroundColor Yellow
} else {
    Write-Host "`nPush failed. Please check:" -ForegroundColor Red
    Write-Host "1. Your token has 'repo' permissions" -ForegroundColor Yellow
    Write-Host "2. You have write access to the repository" -ForegroundColor Yellow
    Write-Host "3. The token is correct" -ForegroundColor Yellow
}

