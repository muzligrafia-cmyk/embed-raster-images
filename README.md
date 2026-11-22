# Embed Raster Images

What it does:

Scans every PlacedItem (linked file) in the active document.
Filters to raster formats only — JPG, PNG, GIF, BMP, TIFF, PSD, WEBP, etc. Linked vector files (EPS, AI, PDF) are left untouched.
Calls Illustrator's native embed() API on each raster item.
Shows a summary dialog listing which images were embedded and which (if any) failed, along with a hint about the likely cause.

Common failure reasons (shown in the dialog if they occur):

The source file has been moved or deleted — re-link it via the Links panel first.
The file is on read-only media (e.g. a locked network share).
A corrupt link entry in the document.
