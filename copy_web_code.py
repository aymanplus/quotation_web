import os
import datetime

def copy_web_code(search_dir, output_file):
    """
    Copies the content of all .html, .css, and .js files in a directory
    and its subdirectories to a single text file, including file name and path.

    Args:
        search_dir: The directory to search for the files.
        output_file: The path to the output text file.
    """

    # Tuple of file extensions to look for
    target_extensions = (".html", ".css", ".js")

    try:
        with open(output_file, "w", encoding="utf-8") as outfile:
            # Header with timestamp
            outfile.write(f"Web Code Extraction (HTML, CSS, JS) - {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            outfile.write("=" * 40 + "\n\n")

            for root, _, files in os.walk(search_dir):
                for file in files:
                    # Check if the file ends with any of the target extensions
                    if file.endswith(target_extensions):
                        file_path = os.path.join(root, file)

                        try:  # Handle potential file reading errors
                            with open(file_path, "r", encoding="utf-8") as infile:
                                file_content = infile.read()

                            # Write file information and content to output file
                            outfile.write(f"File Name: {file}\n")
                            outfile.write(f"File Path: {file_path}\n")
                            outfile.write("File Content:\n")
                            outfile.write("-" * 20 + "\n")  # Separator
                            outfile.write(file_content)
                            outfile.write("\n" + "-" * 20 + "\n\n") # Separator between files

                        except FileNotFoundError:
                            outfile.write(f"ERROR: File not found: {file_path}\n\n")
                        except PermissionError:
                            outfile.write(f"ERROR: Permission denied to read: {file_path}\n\n")
                        except OSError as e:
                             outfile.write(f"ERROR: An OS error occurred when reading {file_path}: {e}\n\n")
                        except UnicodeDecodeError:
                            # Handle files that are not UTF-8, common with some assets
                            outfile.write(f"ERROR: Could not decode file (not UTF-8?): {file_path}\n\n")

            outfile.write("=" * 40 + "\n")  # Footer
            outfile.write("End of Extraction\n")

        print(f"Web code copied to '{output_file}'") # Success message

    except Exception as e: # Handle other exceptions during the main process
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))  # Get script directory
    output_filename = "web_code_output.txt"  # Output file name
    output_path = os.path.join(script_dir, output_filename)   # Full output path

    # Use the script's directory as the starting point for the search
    copy_web_code(script_dir, output_path)