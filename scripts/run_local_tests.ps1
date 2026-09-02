param(
    [ValidateSet("full", "fr03", "fr09", "fr17", "smoke", "data")]
    [string]$Suite = "full"
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$reportDir = Join-Path $repoRoot "reports\newman"
New-Item -ItemType Directory -Force -Path $reportDir | Out-Null

$stdoutLog = Join-Path $reportDir "server.log"
$stderrLog = Join-Path $reportDir "server-error.log"
$server = Start-Process -FilePath "node" `
    -ArgumentList "backend/server.js" `
    -WorkingDirectory $repoRoot `
    -RedirectStandardOutput $stdoutLog `
    -RedirectStandardError $stderrLog `
    -WindowStyle Hidden `
    -PassThru

try {
    $ready = $false
    for ($attempt = 1; $attempt -le 30; $attempt++) {
        try {
            Invoke-WebRequest -Uri "http://127.0.0.1:3000/api/products" -UseBasicParsing | Out-Null
            $ready = $true
            break
        } catch {
            Start-Sleep -Milliseconds 500
        }
    }

    if (-not $ready) {
        throw "Backend did not become ready on http://127.0.0.1:3000"
    }

    & npm.cmd run "test:$Suite"
    exit $LASTEXITCODE
} finally {
    if ($server -and -not $server.HasExited) {
        Stop-Process -Id $server.Id -Force
    }
}
