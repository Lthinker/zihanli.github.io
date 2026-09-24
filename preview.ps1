param([int]$Port = 8000)
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$bundledPython = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
Write-Host "Preview: http://localhost:$Port (Ctrl+C to stop)"
if (Test-Path -LiteralPath $bundledPython) {
    & $bundledPython -m http.server $Port --bind 127.0.0.1
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
    py -3 -m http.server $Port --bind 127.0.0.1
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
    python -m http.server $Port --bind 127.0.0.1
} else {
    throw 'Python 3 is required for local preview. Install Python, or use GitHub Pages to preview online.'
}
