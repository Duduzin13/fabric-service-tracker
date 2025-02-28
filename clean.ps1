Get-ChildItem -Path "src" -Recurse -File | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace '<<<<<<< HEAD', ''
    $content = $content -replace '=======', ''
    $content = $content -replace '>>>>>>> \w+', ''
    Set-Content $_.FullName $content
} 