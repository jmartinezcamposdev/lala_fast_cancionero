import json
import sys
from pathlib import Path


def decode_unicode_escapes(file_path: str) -> None:
    """Read a JSON file, decode all \\uXXXX escape sequences to proper UTF-8, and overwrite the file."""
    path = Path(file_path)
    if not path.exists():
        print(f"File not found: {file_path}", file=sys.stderr)
        return

    with open(path, "r", encoding="utf-8") as f:
        raw_content = f.read()

    # json.loads automatically decodes \uXXXX sequences to proper Unicode characters
    try:
        data = json.loads(raw_content)
    except json.JSONDecodeError as e:
        print(f"Failed to parse {file_path}: {e}", file=sys.stderr)
        return

    # Write back with ensure_ascii=False so UTF-8 characters are preserved as-is
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Decoded: {file_path}")


def decode_multiple_files(file_paths: list[str]) -> None:
    """Decode Unicode escapes in multiple JSON files."""
    for path in file_paths:
        decode_unicode_escapes(path)


def decode_directory(directory_path: str) -> None:
    """Decode Unicode escapes in all JSON files within a directory."""
    path = Path(directory_path)
    if not path.is_dir():
        print(f"Directory not found: {directory_path}", file=sys.stderr)
        return

    json_files = sorted(path.glob("*.json"))
    if not json_files:
        print(f"No JSON files found in {directory_path}")
        return

    print(f"Found {len(json_files)} JSON file(s) in {directory_path}")
    for json_file in json_files:
        decode_unicode_escapes(str(json_file))


if __name__ == "__main__":
    # Default: decode all JSON files in ./lala_sources/
    source_dir = "./lala_sources/"

    if len(sys.argv) > 1:
        # If arguments are provided, treat them as file paths or a directory
        targets = sys.argv[1:]
        for target in targets:
            if Path(target).is_dir():
                decode_directory(target)
            else:
                decode_unicode_escapes(target)
    else:
        decode_directory(source_dir)
