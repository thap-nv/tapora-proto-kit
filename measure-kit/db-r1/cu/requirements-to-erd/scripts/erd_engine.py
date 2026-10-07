# -*- coding: utf-8 -*-
"""
ERD Engine - CLI Pipeline for requirements-to-erd skill.
Reads DBML, builds customizable 2D grid layout, routes orthogonal connectors,
and outputs interactive editorial HTML.
"""
import io, sys, os, json, argparse
if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
import dbml_parser, layout_builder, router, html_assembler

def generate_erd(dbml_path, output_path, layout_path=None, cols=None, run_check=True):
    print(f"Reading DBML: {dbml_path}")
    dbml_text = io.open(dbml_path, encoding='utf-8').read()
    parsed = dbml_parser.parse_dbml(dbml_text)
    print(f"  Parsed: {len(parsed['tables'])} tables, {len(parsed['enums'])} enums, {len(parsed['refs'])} refs.")

    layout_spec = None
    if layout_path and os.path.exists(layout_path):
        print(f"Loading custom layout: {layout_path}")
        layout_spec = json.load(io.open(layout_path, encoding='utf-8'))
    elif cols:
        layout_spec = {'cols': int(cols)}

    # Build layout
    print("Building 2D Grid Layout...")
    layout_data = layout_builder.build_layout(parsed, layout_spec=layout_spec, cols=cols)

    # Route connectors
    print("Routing orthogonal connectors...")
    route_overrides = layout_spec.get('routes') if layout_spec else None
    connectors_svg = router.build_connectors_svg(layout_data['tables'], parsed['refs'], route_overrides=route_overrides)

    # Assemble HTML
    print(f"Assembling interactive HTML: {output_path}")
    html_content = html_assembler.assemble_html(layout_data, connectors_svg, parsed)

    out_dir = os.path.dirname(os.path.abspath(output_path))
    if out_dir and not os.path.exists(out_dir):
        os.makedirs(out_dir, exist_ok=True)

    io.open(output_path, 'w', encoding='utf-8').write(html_content)
    print(f"HTML successfully generated! ({len(html_content):,} bytes)")

    # Run selfcheck if requested
    if run_check:
        selfcheck_script = os.path.join(os.path.dirname(__file__), 'selfcheck.py')
        if os.path.exists(selfcheck_script):
            print("\nRunning Self-Check Verification...")
            import subprocess
            res = subprocess.run([sys.executable, selfcheck_script, output_path], capture_output=True, text=True, encoding='utf-8')
            print(res.stdout)
            if res.stderr:
                print(res.stderr)
            if res.returncode != 0:
                print("Selfcheck returned warnings or failures.")
            else:
                print("Selfcheck PASSED completely!")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Generate interactive editorial ERD HTML from DBML.")
    parser.add_argument('dbml', help="Path to schema.dbml")
    parser.add_argument('output', help="Path to output schema.html")
    parser.add_argument('--layout', help="Path to custom layout.json (optional)", default=None)
    parser.add_argument('--cols', help="Number of matrix grid columns (e.g. 2, 3, 4)", type=int, default=None)
    parser.add_argument('--no-check', help="Skip selfcheck validation", action='store_true')

    args = parser.parse_args()
    generate_erd(args.dbml, args.output, layout_path=args.layout, cols=args.cols, run_check=not args.no_check)
