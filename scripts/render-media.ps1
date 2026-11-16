param([string]$BrowserExecutable)
$ErrorActionPreference = 'Stop'
$workspace = Split-Path $PSScriptRoot -Parent
Push-Location (Join-Path $workspace 'packages/video')
try {
  $browserArgs = @()
  if ($BrowserExecutable) { $browserArgs = @("--browser-executable=$BrowserExecutable") }
  foreach ($composition in @('SmsEntrega','DominioEmFoco','FamiliarNumeroNovo','CentralBancaria','PrimeiraConversaIA','NoticiaEFontes')) {
    Write-Output "Renderizando $composition"
    & npx remotion render src/index.ts $composition "../../apps/web/public/media/$composition.mp4" --image-format=png --gl=swangle --concurrency=2 --log=error @browserArgs
    if ($LASTEXITCODE -ne 0) { throw "Falha no vídeo $composition" }
    & npx remotion still src/index.ts $composition "../../apps/web/public/media/$composition.png" --frame=24 --image-format=png --gl=swangle --log=error @browserArgs
    if ($LASTEXITCODE -ne 0) { throw "Falha na capa $composition" }
    Write-Output "Exportado $composition"
  }
} finally { Pop-Location }
