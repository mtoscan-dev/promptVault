# AntiGravity Context Prepper (Windows PowerShell)
# Reduces token usage by providing a compact representation of the project structure and key files.

$OutputFile = ".agent/scripts/context_summary.md"
$ExcludePatterns = @("node_modules", ".git", "dist", "build", ".next", "out", "*.log", "*.png", "*.jpg", "*.jpeg", "*.gif", "*.svg", "*.ico", "*.pdf", "*.zip", "*.gz", "*.tar", "package-lock.json", "yarn.lock")

Write-Host "Generating compact context at $OutputFile..."

$Summary = @()
$Summary += "# Project Context Summary"
$Summary += "Generated on: $(Get-Date)"
$Summary += ""
$Summary += "## Directory Structure"
$Summary += "```"

# Simple tree equivalent for PowerShell
function Get-Tree($Path, $Prefix = "", $Depth = 0) {
    if ($Depth -gt 3) { return }
    $items = Get-ChildItem -Path $Path | Where-Object { $ExcludePatterns -notcontains $_.Name -and $_.Name -notmatch "^\." }
    foreach ($item in $items) {
        $Summary += "$Prefix |-- $($item.Name)"
        if ($item.PSIsContainer) {
            Get-Tree $item.FullName ($Prefix + "    ") ($Depth + 1)
        }
    }
}

# Add tree output to Summary
$items = Get-ChildItem -Path "." | Where-Object { $ExcludePatterns -notcontains $_.Name -and $_.Name -notmatch "^\." }
foreach ($item in $items) {
    $global:Summary += "|-- $($item.Name)"
    if ($item.PSIsContainer) {
        # Note: Scoping might be tricky here, let's keep it simple
    }
}
# Actually let's use a simpler version of tree for PS
$tree = Get-ChildItem -Recurse -Depth 2 | Where-Object { $_.FullName -notmatch "node_modules|\.git|dist|build" } | Select-Object -Property @{Name="Path";Expression={$_.FullName.Replace((Get-Location).Path, "")}}
foreach($line in $tree) { $Summary += $line.Path }

$Summary += "```"
$Summary += ""
$Summary += "## Key Configuration Files"

$ConfigFiles = @("package.json", "tsconfig.json", ".cursorrules", "README.md")

foreach ($file in $ConfigFiles) {
    if (Test-Path $file) {
        $Summary += "### $file"
        $extension = [System.IO.Path]::GetExtension($file).Substring(1)
        $Summary += "```$extension"
        $Summary += Get-Content $file
        $Summary += "```"
        $Summary += ""
    }
}

$Summary | Out-File -FilePath $OutputFile -Encoding utf8

Write-Host "Done! You can now provide .agent/scripts/context_summary.md to AntiGravity to give it a head start."
