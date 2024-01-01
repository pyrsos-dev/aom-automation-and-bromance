#!/bin/bash

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <file1> <file2>"
    exit 1
fi

file1="$1"
file2="$2"

# Get modification times in seconds since epoch
mtime1=$(stat -c %Y "$file1")
mtime2=$(stat -c %Y "$file2")

# Calculate the time difference in seconds
time_diff=$((mtime2 - mtime1))
abs_time_diff=${time_diff#-}
echo "Time difference: $abs_time_diff seconds"

# Check if the time difference is exactly 1 hour (3600 seconds)
if [ "$abs_time_diff" -eq 3600 ]; then
    echo "The modification times are exactly 1 hour apart."
else
    echo "The modification times are not exactly 1 hour apart."
fi
