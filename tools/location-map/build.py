"""
Builds the dark street map of west Hyderabad used on /location.

  python3 build.py fetch          # download roads, lakes, rail and area names from OpenStreetMap (Overpass)
  python3 build.py                # write public/location/west-hyderabad.svg + src/content/locationMap.ts

Map data (c) OpenStreetMap contributors, ODbL. The page credits it under the map.
Pins are the coordinates of the Google Maps embeds on globusdevelopers.com.
"""
import json, math, sys, urllib.parse, urllib.request
from pathlib import Path

HERE = Path(__file__).parent
ROOT = HERE.parent.parent
RAW = HERE / "osm.json"

# Map window. 1.6 : 1 so it fills a landscape screen; the projects sit left of centre,
# clear of the list panel on the right.
WEST, EAST = 78.16, 78.475
SOUTH, NORTH = 17.35, 17.538
W = 1600
KX = math.cos(math.radians((SOUTH + NORTH) / 2))
H = round(W * (NORTH - SOUTH) / ((EAST - WEST) * KX))

PINS = [  # slug, label, lat, lon
    ("neo", "Neo", 17.408515, 78.3035234),
    ("treasor", "Treasor", 17.38582, 78.3287088),
    ("altus", "Altus", 17.4843816, 78.336028),
    ("floresta", "Floresta", 17.501738, 78.2445359),
]
AREAS = [  # OSM place names shown on the map
    "Kokapet", "Narsingi", "Gandipet", "Financial District", "Gachibowli", "Nanakramguda",
    "Kondapur", "HITEC City", "Madhapur", "Kollur", "Nallagandla", "Lingampally",
    "Manikonda", "Puppalguda", "Miyapur", "Patancheru", "Hafeezpet", "Osman Nagar",
]

ROADS = {  # highway -> (stroke, width)
    "motorway": ("#6b6b6b", 2.6), "motorway_link": ("#4a4a4a", 1.2),
    "trunk": ("#575757", 2.0), "trunk_link": ("#3d3d3d", 1.0),
    "primary": ("#474747", 1.5), "secondary": ("#363636", 1.1), "tertiary": ("#262626", 0.8),
}


def fetch():
    box = f"{SOUTH - 0.01},{WEST - 0.01},{NORTH + 0.01},{EAST + 0.01}"
    query = f"""[out:json][timeout:180];(
      way["highway"~"^(motorway|trunk|primary|secondary|tertiary|motorway_link|trunk_link)$"]({box});
      way["natural"="water"]({box}); relation["natural"="water"]({box});
      way["railway"="rail"]({box});
      node["place"~"^(suburb|neighbourhood|village|town|quarter)$"]({box}););out geom;"""
    req = urllib.request.Request(
        "https://overpass-api.de/api/interpreter",
        data=urllib.parse.urlencode({"data": query}).encode(),
        headers={"User-Agent": "globus-site-map/1.0"},  # Overpass refuses requests without one
    )
    RAW.write_bytes(urllib.request.urlopen(req, timeout=240).read())
    print("saved", RAW)


def xy(lat, lon):
    return (lon - WEST) / (EAST - WEST) * W, (NORTH - lat) / (NORTH - SOUTH) * H


def path(points):
    # Whole pixels, relative moves: a pixel is finer than the map is ever shown, and it keeps the file small.
    out, last = [], None
    for p in points:
        x, y = xy(p["lat"], p["lon"])
        cur = (round(x), round(y))
        if last is None:
            out.append(f"M{cur[0]} {cur[1]}")
        elif cur != last:
            out.append(f"l{cur[0] - last[0]} {cur[1] - last[1]}")
        last = cur
    return "".join(out)


def build():
    data = json.loads(RAW.read_text())["elements"]
    water, rail, roads = [], [], {k: [] for k in ROADS}
    places = {}
    for e in data:
        tags = e.get("tags", {})
        if e["type"] == "node":
            name = tags.get("name:en") or tags.get("name")
            if name in AREAS and name not in places:
                places[name] = (e["lat"], e["lon"])
        elif tags.get("natural") == "water":
            rings = [e["geometry"]] if e["type"] == "way" else [m["geometry"] for m in e.get("members", []) if m.get("role") == "outer" and "geometry" in m]
            water += [path(r) + "Z" for r in rings]
        elif tags.get("railway") == "rail":
            rail.append(path(e["geometry"]))
        elif tags.get("highway") in ROADS:
            roads[tags["highway"]].append(path(e["geometry"]))

    svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" fill="none" stroke-linecap="round" stroke-linejoin="round">']
    svg.append(f'<path fill="#151515" d="{"".join(water)}"/>')
    for kind in ["tertiary", "secondary", "primary", "trunk_link", "motorway_link", "trunk", "motorway"]:
        stroke, width = ROADS[kind]
        svg.append(f'<path stroke="{stroke}" stroke-width="{width}" d="{"".join(roads[kind])}"/>')
    svg.append(f'<path stroke="#3a3a3a" stroke-width="1" stroke-dasharray="6 5" d="{"".join(rail)}"/>')
    svg.append("</svg>")
    out = ROOT / "public/location/west-hyderabad.svg"
    out.write_text("".join(svg))
    print("wrote", out, round(out.stat().st_size / 1024), "KB")

    def pct(lat, lon):
        x, y = xy(lat, lon)
        return {"x": round(x / W * 100, 2), "y": round(y / H * 100, 2)}

    pins = [{"slug": s, "label": l, **pct(la, lo)} for s, l, la, lo in PINS]
    labels = [{"name": n, **pct(*places[n])} for n in AREAS if n in places]
    missing = [n for n in AREAS if n not in places]
    if missing:
        print("not in OSM data:", missing)
    ts = (
        "// Generated by tools/location-map/build.py. Do not edit by hand.\n"
        "// Positions are percentages of the map image (public/location/west-hyderabad.svg).\n"
        f"export const mapAspect = {W} / {H};\n"
        f"export const mapPins = {json.dumps(pins, indent=2)} as const;\n"
        f"export const mapAreaLabels = {json.dumps(labels, indent=2)};\n"
    )
    (ROOT / "src/content/locationMap.ts").write_text(ts)
    print("wrote src/content/locationMap.ts")


if __name__ == "__main__":
    fetch() if sys.argv[1:] == ["fetch"] else build()
