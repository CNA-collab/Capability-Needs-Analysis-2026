Get-ChildItem components\*.tsx | ForEach-Object { (Get-Content $_.FullName) -replace 'process\.env\.API_KEY', 'process.env.GEMINI_API_KEY' | Set-Content $_.FullName }
