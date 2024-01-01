#!/bin/bash

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <directory1> <directory2>"
    exit 1
fi

dir1="$1"
dir2="$2"

# Find all files in both directories and store them in arrays
mapfile -t files_dir1 < <(find "$dir1" -type f)
mapfile -t files_dir2 < <(find "$dir2" -type f)

# Iterate through each file in the first directory
for file1 in "${files_dir1[@]}"; do
    echo $file1

    # Iterate through each file in the second directory
    for file2 in "${files_dir2[@]}"; do
        # echo "Comparing times between \"$file1\" and \"$file2\""
        
        # Get modification times in seconds since epoch
        mtime1=$(stat -c %Y "$file1")
        mtime2=$(stat -c %Y "$file2")

        # Calculate the time difference in seconds
        time_diff=$((mtime2 - mtime1))
        abs_time_diff=${time_diff#-}
        # echo "Time difference: $abs_time_diff seconds"

        # Check if the time difference is exactly 1 hour (3600 seconds)
        if [ "$abs_time_diff" -eq 3600 ]; then
            echo $file1
            echo $file2
            echo "The modification times are exactly 1 hour apart."
        fi
        # else
        #     echo "The modification times are not exactly 1 hour apart."
        # fi

    done
done
