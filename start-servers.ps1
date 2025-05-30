# Kill existing Node.js processes
taskkill /F /IM node.exe 2>$null

# Kill PowerShell processes running our servers
$processes = Get-WmiObject Win32_Process -Filter "Name = 'powershell.exe'"
foreach ($process in $processes) {
    if ($process.CommandLine -like '*npm run dev*') {
        Stop-Process -Id $process.ProcessId -Force
    }
}

# Start the API server in a new window
$apiWindow = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd api; npm run dev" -PassThru

# Wait a bit for the API server to start
Start-Sleep -Seconds 2

# Start the frontend server
npm run dev 