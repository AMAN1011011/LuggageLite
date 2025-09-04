# TravelLite Development Environment Starter
Write-Host "🚀 Starting TravelLite Development Environment..." -ForegroundColor Green
Write-Host ""

# Function to handle Ctrl+C
function Stop-Servers {
    Write-Host ""
    Write-Host "🛑 Shutting down development environment..." -ForegroundColor Yellow
    Get-Job | Stop-Job
    Get-Job | Remove-Job
    exit
}

# Set up Ctrl+C handler
$null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action { Stop-Servers }

try {
    # Start backend server
    Write-Host "🔧 Starting Backend Server..." -ForegroundColor Cyan
    $backendJob = Start-Job -ScriptBlock {
        Set-Location "D:\PROJECTS\Luggage System\backend"
        node api-server.js
    }

    # Start frontend server
    Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Magenta
    $frontendJob = Start-Job -ScriptBlock {
        Set-Location "D:\PROJECTS\Luggage System\frontend"
        npm run dev
    }

    Write-Host ""
    Write-Host "📊 Development servers starting..." -ForegroundColor Green
    Write-Host "   Backend:  http://localhost:5000" -ForegroundColor White
    Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Press Ctrl+C to stop both servers" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📋 Server Logs:" -ForegroundColor Green
    Write-Host "─" * 50

    # Monitor jobs and show output
    while ($true) {
        # Check backend output
        $backendOutput = Receive-Job $backendJob -Keep
        if ($backendOutput) {
            foreach ($line in $backendOutput) {
                Write-Host "[BACKEND] $line" -ForegroundColor Blue
            }
        }

        # Check frontend output
        $frontendOutput = Receive-Job $frontendJob -Keep
        if ($frontendOutput) {
            foreach ($line in $frontendOutput) {
                Write-Host "[FRONTEND] $line" -ForegroundColor Green
            }
        }

        # Check if jobs are still running
        if ($backendJob.State -eq "Failed" -or $frontendJob.State -eq "Failed") {
            Write-Host ""
            Write-Host "❌ One or more servers failed to start" -ForegroundColor Red
            break
        }

        Start-Sleep -Milliseconds 500
    }
}
catch {
    Write-Host "❌ Error starting servers: $_" -ForegroundColor Red
}
finally {
    Stop-Servers
}
