#!/usr/bin/env python3
"""Flatten DTCG bcx.tokens.json into Style-Dictionary-friendly string values."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
src = json.loads((ROOT / "bcx.tokens.json").read_text())

def is_token(node):
    return isinstance(node, dict) and ("$value" in node)

def to_css(value, typ=None):
    if isinstance(value, dict) and "value" in value and "unit" in value:
        return f"{value['value']}{value['unit']}"
    if isinstance(value, list) and value and all(isinstance(x, (int, float)) for x in value) and len(value) == 4:
        return "cubic-bezier(" + ", ".join(str(x) for x in value) + ")"
    if isinstance(value, list) and value and all(isinstance(x, str) for x in value):
        bare = {"system-ui", "sans-serif", "monospace", "ui-monospace", "-apple-system"}
        return ", ".join(x if x in bare else f'"{x}"' for x in value)
    return value

TYPE_MAP = {
    "cubicBezier": "other",
    "fontFamily": "other",
    "fontWeight": "fontWeights",
    "shadow": "other",
    "duration": "other",
    "dimension": "other",
    "color": "color",
    "number": "other",
}

def walk(node, out):
    if not isinstance(node, dict):
        return
    if is_token(node):
        typ = node.get("$type")
        out["$value"] = to_css(node["$value"], typ)
        if typ:
            out["$type"] = TYPE_MAP.get(typ, typ)
        if "$description" in node:
            out["$description"] = node["$description"]
        return
    for k, v in node.items():
        if k.startswith("$"):
            continue
        out[k] = {}
        walk(v, out[k])

out = {}
walk(src, out)
(ROOT / "tokens-css.json").write_text(json.dumps(out, indent=2) + "\n")
print("wrote tokens-css.json")
