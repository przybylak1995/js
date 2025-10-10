import os

# The target size in megabytes
target_size_mb = 450

chunk = "Q" * 35 
chunk_bytes = chunk.encode("utf-8")
chunk_size = len(chunk_bytes)
target_size_bytes = target_size_mb * 1024 * 1024
repeats = target_size_bytes // chunk_size
content = chunk * repeats
output_path = f"generated_{target_size_mb}MB.txt"
with open(output_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"File saved as: {output_path}")
