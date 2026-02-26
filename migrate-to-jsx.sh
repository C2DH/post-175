#!/bin/bash

find ./src -type f -name "*.js" | while read file; do
    # Check for JSX patterns: HTML tags or React component renders
    if grep -qE "(<[A-Z][a-zA-Z]*|<(div|span|p|section|article|header|footer|nav|main|form|input|button|a|img|ul|ol|li|h[1-6]|br|hr))" "$file"; then
        newfile="${file%.js}.jsx"
        mv "$file" "$newfile"
        echo "Renamed: $file → $newfile"
    fi
done