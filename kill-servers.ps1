# Kill existing Node.js processes
taskkill /F /IM node.exe 2>$null

# Kill PowerShell processes running our servers
$processes = Get-WmiObject Win32_Process -Filter "Name = 'powershell.exe'"
foreach ($process in $processes) {
    if ($process.CommandLine -like '*npm run dev*') {
        Stop-Process -Id $process.ProcessId -Force
    }
}

Write-Host "All server processes have been terminated." 