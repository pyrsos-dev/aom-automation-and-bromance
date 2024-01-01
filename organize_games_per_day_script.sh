#!/bin/bash

# Check if the source directory argument is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <source_directory>"
    exit 1
fi

# Set the source directory from the command-line argument
source_directory="$1"

# Loop through each file in the source directory
for file in "$source_directory"/*; do
    if [ -f "$file" ]; then
        # Extract the date part after '@'
        date_part=$(echo "$file" | grep -oP '(?<=@)[^ ]+')
        
        # Create the destination directory with the extracted date
        destination_directory="$source_directory/$date_part"
        mkdir -p "$destination_directory"

        # Move the file to the destination directory
        mv "$file" "$destination_directory/"
        
        echo "Moved $file to $destination_directory/"
    fi
done
