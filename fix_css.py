import sys

with open('src/index.css', 'r') as f:
    lines = f.readlines()

# find where "/* RESPONSIVE: Single Column on Mobile for GSAP Gallery */" starts
try:
    idx = next(i for i, line in enumerate(lines) if "RESPONSIVE: Single Column on Mobile for GSAP Gallery" in line)
    with open('src/index.css', 'w') as f:
        f.writelines(lines[:idx])
except StopIteration:
    pass

