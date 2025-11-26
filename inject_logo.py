import os

# Paths
logo_file = 'logo_base64.txt'
script_file = 'script.js'

# Read base64 string
with open(logo_file, 'r') as f:
    base64_str = f.read().strip()

# Read script.js
with open(script_file, 'r') as f:
    script_content = f.read()

# Replace placeholder
new_content = script_content.replace('"LOGO_BASE64_PLACEHOLDER"', f'"data:image/png;base64,{base64_str}"')

# Write back to script.js
with open(script_file, 'w') as f:
    f.write(new_content)

print("Logo injected successfully.")
