"""
Globus fin sculpture, rendered in Blender (Cycles) for a soft, photo-real look.

Run headless:
  still:  blender -b -P blender_fins.py -- --still 0.15 --out ./still.png
  loop:   blender -b -P blender_fins.py -- --frames 384 --out ./frames/

The loop: every fin turns half a turn in place over the frames. A fin looks the same after
half a turn, so the last frame flows straight back into the first (seamless).
Frames are rendered with a transparent background; put them on white (or invert them for black)
when encoding.
"""

import argparse
import math
import os
import sys

import bpy

# ---------------------------------------------------------------- settings
FIN_COUNT = 64           # fins from bottom to top
HEIGHT = 7.0             # metres, bottom to top
TURN = math.pi * 1.4     # how far the top fin is turned compared to the bottom one
FIN_LENGTH = 3.0
FIN_THICKNESS = 0.075
FIN_DEPTH = 0.9
SIZE = 1080              # output is SIZE x SIZE pixels
SAMPLES = 96
LEAN = math.radians(-38)  # the whole column leans, so it sweeps diagonally across the frame

# Colours of the "G" in the Globus logo, in Blender's linear colour space.
PLUM = (0.0356, 0.0075, 0.0296, 1)    # #351530
ORANGE = (0.871, 0.0762, 0.0382, 1)   # #F04E37
ORANGE_FROM = 13 / 22  # the logo ring has 13 plum dashes then 9 orange ones
USE_LOGO_COLOURS = True  # chosen look (option G): plum rising into orange, like the logo G. False = all white
WHITE = (0.88, 0.88, 0.88, 1)


def spine(t):
    """Centre of fin number t (0 = bottom, 1 = top): a soft S-curve."""
    x = math.sin(t * math.pi * 1.2 - 0.4) * 0.95
    y = math.cos(t * math.pi) * 0.5
    z = (t - 0.5) * HEIGHT
    return x, y, z


def fin_scale(t):
    """Fins are longer in the middle and shorter at the ends."""
    return 0.62 + math.sin(t * math.pi) * 0.38


# ---------------------------------------------------------------- scene
def build_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene

    # Render settings
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = SAMPLES
    scene.cycles.use_adaptive_sampling = True
    scene.cycles.use_denoising = True
    scene.cycles.max_bounces = 6
    scene.render.resolution_x = SIZE
    scene.render.resolution_y = SIZE
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.use_persistent_data = True
    scene.view_settings.view_transform = "Standard"
    scene.view_settings.exposure = 0.0

    # World: soft white fill from every direction
    world = bpy.data.worlds.new("World")
    scene.world = world
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs[0].default_value = (1, 1, 1, 1)
    world.node_tree.nodes["Background"].inputs[1].default_value = 0.7

    # Material: matte white, a touch of sheen on the edges
    material = bpy.data.materials.new("Fin white")
    material.use_nodes = True
    bsdf = material.node_tree.nodes["Principled BSDF"]
    # Each fin's own colour (set per object below) drives the base colour.
    object_info = material.node_tree.nodes.new("ShaderNodeObjectInfo")
    material.node_tree.links.new(object_info.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = 0.42
    bsdf.inputs["Specular IOR Level"].default_value = 0.35

    # One fin mesh with rounded edges, shared by every fin
    bpy.ops.mesh.primitive_cube_add(size=1)
    template = bpy.context.active_object
    template.scale = (FIN_LENGTH, FIN_DEPTH, FIN_THICKNESS)
    bpy.ops.object.transform_apply(scale=True)
    bevel = template.modifiers.new("Rounded edges", "BEVEL")
    bevel.width = 0.03
    bevel.segments = 3
    bpy.ops.object.modifier_apply(modifier=bevel.name)
    bpy.ops.object.shade_smooth()
    template.data.materials.append(material)
    mesh = template.data
    bpy.data.objects.remove(template)

    # Every fin hangs off one pivot, so the whole column can lean as a unit.
    pivot = bpy.data.objects.new("Sculpture", None)
    pivot.rotation_euler = (0, LEAN, 0)
    scene.collection.objects.link(pivot)

    fins = []
    for index in range(FIN_COUNT):
        fin = bpy.data.objects.new(f"fin_{index:03d}", mesh)
        if USE_LOGO_COLOURS:
            fin.color = ORANGE if index / (FIN_COUNT - 1) >= ORANGE_FROM else PLUM
        else:
            fin.color = WHITE
        fin.parent = pivot
        scene.collection.objects.link(fin)
        fins.append(fin)

    # Big soft light from high up front-left: bright fin tops, soft shade between fins
    key_data = bpy.data.lights.new("Key", "AREA")
    key_data.shape = "DISK"
    key_data.size = 12
    key_data.energy = 3400
    key = bpy.data.objects.new("Key", key_data)
    key.location = (-6.5, -3.5, 8.0)
    key.rotation_euler = (math.radians(40), 0, math.radians(-62))
    scene.collection.objects.link(key)

    # Camera: close and a little below, so the leaning column is huge and runs off the frame edges
    camera_data = bpy.data.cameras.new("Camera")
    camera_data.lens = 50
    camera = bpy.data.objects.new("Camera", camera_data)
    camera.location = (-0.3, -5.3, -0.6)
    scene.collection.objects.link(camera)
    scene.camera = camera
    target = bpy.data.objects.new("Target", None)
    target.location = (0.1, 0, 0.2)
    scene.collection.objects.link(target)
    look = camera.constraints.new("TRACK_TO")
    look.target = target
    look.track_axis = "TRACK_NEGATIVE_Z"
    look.up_axis = "UP_Y"

    return scene, fins


def place_fins(fins, phase):
    """phase 0..1 → every fin turned an extra half turn in place."""
    for index, fin in enumerate(fins):
        t = index / (len(fins) - 1)
        fin.location = spine(t)
        fin.rotation_euler = (0, 0, t * TURN + phase * math.pi)
        s = fin_scale(t)
        fin.scale = (s, 1, 1)


# ---------------------------------------------------------------- main
def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument("--still", type=float, default=None)
    parser.add_argument("--frames", type=int, default=None)
    parser.add_argument("--start", type=int, default=0)
    parser.add_argument("--out", required=True)
    parser.add_argument("--samples", type=int, default=SAMPLES)
    args = parser.parse_args(argv)

    scene, fins = build_scene()
    scene.cycles.samples = args.samples

    if args.still is not None:
        place_fins(fins, args.still)
        scene.render.filepath = os.path.abspath(args.out)
        bpy.ops.render.render(write_still=True)
        return

    os.makedirs(args.out, exist_ok=True)
    for frame in range(args.start, args.frames):
        path = os.path.join(os.path.abspath(args.out), f"f{frame:04d}.png")
        if os.path.exists(path):
            continue  # lets a long render resume where it stopped
        place_fins(fins, frame / args.frames)
        scene.render.filepath = path
        bpy.ops.render.render(write_still=True)


main()
