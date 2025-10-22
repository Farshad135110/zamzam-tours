$vehicles = @("bus", "kdh", "tour-van", "wagonr", "shuttle", "every-buddy", "aqua", "prius")
$destinations = @("sigiriya", "kandy", "galle", "ella", "yala", "nuwara-eliya")

# Create vehicle placeholders
foreach ($vehicle in $vehicles) {
    $content = @"
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#0a5c5e"/>
  <text x="200" y="140" font-family="Arial" font-size="32" fill="white" text-anchor="middle" font-weight="bold">$($vehicle.ToUpper())</text>
  <text x="200" y="180" font-family="Arial" font-size="18" fill="#f8b500" text-anchor="middle">ZamZam Tours Vehicle</text>
</svg>
"@
    Set-Content -Path "public\vehicles\$vehicle.svg" -Value $content
}

# Create destination placeholders
foreach ($dest in $destinations) {
    $content = @"
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad$dest" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#053b3c;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0a5c5e;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#grad$dest)"/>
  <text x="200" y="140" font-family="Arial" font-size="28" fill="white" text-anchor="middle" font-weight="bold">$($dest.ToUpper() -replace '-',' ')</text>
  <text x="200" y="180" font-family="Arial" font-size="16" fill="#f8b500" text-anchor="middle">Sri Lanka Destination</text>
</svg>
"@
    Set-Content -Path "public\destinations\$dest.svg" -Value $content
}

Write-Host "Created placeholders for $($vehicles.Count) vehicles and $($destinations.Count) destinations"
