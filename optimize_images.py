"""Create smaller lossless WebP copies; requires Pillow (pip install Pillow)."""
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent


def main():
    replacements = {}
    before = after = 0
    for source in sorted((ROOT / "img").iterdir()):
        if source.suffix.lower() not in {".png", ".jpg", ".jpeg"}:
            continue
        with Image.open(source) as image:
            # Keep color profiles, exact dimensions and even hidden RGB values.
            original = image.convert("RGBA")
            output = BytesIO()
            options = {"icc_profile": image.info["icc_profile"]} if image.info.get("icc_profile") else {}
            image.save(output, format="WEBP", lossless=True, exact=True, method=6, **options)
        data = output.getvalue()
        if len(data) >= source.stat().st_size:
            continue
        with Image.open(BytesIO(data)) as decoded:
            assert decoded.size == original.size
            assert decoded.convert("RGBA").tobytes() == original.tobytes(), source.name
        target = source.with_name(source.name + ".webp")
        target.write_bytes(data)
        replacements[f"img/{source.name}"] = f"img/{target.name}"
        before += source.stat().st_size
        after += len(data)
        print(f"{source.name}: {source.stat().st_size:,} -> {len(data):,} bytes; pixels identical")
    for filename in ("index.html", "app.js", "style.css", "gifting.js"):
        path = ROOT / filename
        content = path.read_bytes()
        updated = content
        for source, target in replacements.items():
            updated = updated.replace(source.encode(), target.encode())
        if filename == "index.html" and "img/logo.png" in replacements:
            updated = updated.replace(b'type="image/png"', b'type="image/webp"')
        if updated != content:
            path.write_bytes(updated)
    if before:
        print(f"Total converted: {before:,} -> {after:,} bytes ({100 * (1 - after / before):.1f}% smaller)")


if __name__ == "__main__":
    main()
