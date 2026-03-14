
import os
import re

path = r'C:\Users\LEGION\Desktop\Portfolio\index.html'
with open(path, 'rb') as f:
    content = f.read()

# Replace the specific byte sequence if found
# ðŸƒ is often C3 B0 C5 B8 C6 ' (or something similar depending on encoding)
# I'll search for the span tag that contains it
pattern = rb'<span style="font-size:3.5rem">.*?</span>'
replacement = b'<i class="fas fa-brain" style="font-size:3.5rem"></i>'

new_content = re.sub(pattern, replacement, content)

with open(path, 'wb') as f:
    f.write(new_content)
print("Regex replacement successful")
