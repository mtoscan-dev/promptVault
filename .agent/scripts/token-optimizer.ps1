# AntiGravity Token Optimizer (Windows)
# Identifies large files that might be consuming unnecessary tokens if included in context.

Write-Host "--- AntiGravity Token Usage Optimization Report ---"
Write-Host "Looking for files > 50KB in the current directory (excluding common ignored folders)..."
Write-Host ""

$ExcludeFolders = @("node_modules", ".git", "dist", "build", ".next")
$ExcludeExtensions = @(".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".pdf", ".zip", ".gz", ".lock")

Get-ChildItem -Path . -Recurse -File | Where-Object {
    $path = $_.FullName
    $size = $_.Length
    $ext = $_.Extension
    
    $isIgnoredFolder = ($ExcludeFolders | Where-Object { $path -like "*\$_\*" }).Count -gt 0
    $isIgnoredExt = $ExcludeExtensions -contains $ext
    $isPackageLock = $_.Name -eq "package-lock.json"
    
    $size -gt 51200 -and -not $isIgnoredFolder -and -not $isIgnoredExt -and -not $isPackageLock
} | Select-Object Name, @{Name="Size(KB)";Expression={[math]::Round($_.Length / 1KB, 2)}}, FullName | Format-Table

Write-Host ""
Write-Host "Recommendations:"
Write-Host "1. Avoid adding these large files to your AI's chat context unless necessary."
Write-Host "2. If a file is a log, consider truncating it: 'Get-Content logfile -Tail 100 | Out-File small_log'."
Write-Host "3. Use .cursorignore or .gitignore to prevent the AI from indexing these files."
Write-Host "4. For large source files, use the 'Project Outline' script instead of providing the whole file."
