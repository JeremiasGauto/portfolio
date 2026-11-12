"""Valida los datos del portfolio.

Uso:  python scripts/validate.py
Revisa que los JSON sean válidos, que cada proyecto tenga los campos
obligatorios, que los ids no se repitan y que existan los archivos
locales de imágenes y videos.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REQUIRED = ["id", "title", "date", "summary", "tools"]
MEDIA_TYPES = {"image", "video", "youtube"}
errors = []


def load(name):
    path = ROOT / "data" / name
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        errors.append(f"{name}: JSON inválido en línea {e.lineno}, columna {e.colno}: {e.msg}")
        return None


def check_file(src, where):
    if not src or src.startswith(("http://", "https://")):
        return
    if not (ROOT / src).is_file():
        errors.append(f"{where}: no existe el archivo '{src}'")


def check_media(item, where):
    t = item.get("type")
    if t not in MEDIA_TYPES:
        errors.append(f"{where}: type debe ser image, video o youtube (es '{t}')")
        return
    if t == "youtube":
        if not (item.get("id") or item.get("src")):
            errors.append(f"{where}: un video de YouTube necesita 'id' o 'src'")
        return
    check_file(item.get("src"), where)
    if t == "video":
        check_file(item.get("poster"), where + " (poster)")


profile = load("profile.json")
projects = load("projects.json")

if profile is not None:
    for key in ["name", "role", "headline"]:
        if not profile.get(key):
            errors.append(f"profile.json: falta '{key}'")
    check_file(profile.get("cv"), "profile.json (cv)")

if projects is not None:
    if not isinstance(projects, list):
        errors.append("projects.json: tiene que ser una lista [ ... ]")
        projects = []
    seen = set()
    for i, p in enumerate(projects):
        where = f"projects.json [{p.get('id', i)}]"
        for key in REQUIRED:
            if not p.get(key):
                errors.append(f"{where}: falta '{key}'")
        pid = p.get("id", "")
        if pid in seen:
            errors.append(f"{where}: id repetido")
        seen.add(pid)
        if pid and not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", pid):
            errors.append(f"{where}: el id debe ser minúsculas-con-guiones")
        if p.get("date") and not re.fullmatch(r"\d{4}(-\d{2})?", p["date"]):
            errors.append(f"{where}: date debe ser AAAA-MM")
        if p.get("cover"):
            check_media(p["cover"], where + " cover")
        for j, m in enumerate(p.get("media", [])):
            check_media(m, f"{where} media[{j}]")
        for link in p.get("links", []):
            if not link.get("label") or not link.get("url"):
                errors.append(f"{where}: cada link necesita 'label' y 'url'")

if errors:
    print("Se encontraron problemas:\n")
    for e in errors:
        print(" -", e)
    sys.exit(1)

print(f"OK: {len(projects or [])} proyectos válidos.")
