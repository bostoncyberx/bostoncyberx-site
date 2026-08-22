import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
p=ROOT/"assets/css/bcx.tokens.css"
text=p.read_text()
if "Legacy aliases" in text:
 print("already"); raise SystemExit
aliases=json.loads((ROOT/"scripts/aliases.json").read_text())
block=["","  /* Legacy aliases for assets/css/bcx.css */"]+[f"  {a}: var({s});" for a,s in aliases]
idx=text.rstrip().rfind("}")
new=text.rstrip()[:idx]+"\n".join(block)+"\n}\n"
p.write_text(new)
print(len(aliases))
