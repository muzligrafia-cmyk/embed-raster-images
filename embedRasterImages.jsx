/**
 * embedRasterImages.jsx
 * 
 * Automatically embeds all linked raster images in the active
 * Adobe Illustrator document.
 *
 * Usage:
 *   File > Scripts > Other Script... and select this file, OR
 *   place it in Adobe Illustrator's Scripts folder to have it
 *   appear in the File > Scripts menu.
 *
 * Compatible with: Adobe Illustrator CS6 and later (ExtendScript)
 */

(function () {

    // ── Sanity checks ────────────────────────────────────────────────────────

    if (app.documents.length === 0) {
        alert("No document is open.\nPlease open an Illustrator file first.");
        return;
    }

    var doc = app.activeDocument;

    // Collect all PlacedItem objects (linked/embedded raster or vector files).
    // We then filter to raster-only items before embedding.
    var placed = doc.placedItems;

    if (placed.length === 0) {
        alert("No placed (linked) items found in this document.");
        return;
    }

    // ── Identify raster images ───────────────────────────────────────────────

    // Raster extensions we treat as "raster images".
    // EPS / AI / PDF are vector-based and are intentionally excluded.
    var RASTER_EXTS = {
        jpg:  true, jpeg: true,
        png:  true,
        gif:  true,
        bmp:  true,
        tif:  true, tiff: true,
        psd:  true,
        psb:  true,
        webp: true,
        svg:  false  // vector – excluded
    };

    /**
     * Returns true when the file extension signals a raster format.
     * @param {PlacedItem} item
     */
    function isRaster(item) {
        try {
            var name = item.file.name.toLowerCase();
            var dot  = name.lastIndexOf(".");
            if (dot === -1) return false;
            var ext  = name.slice(dot + 1);
            return RASTER_EXTS[ext] === true;
        } catch (e) {
            // item.file may throw if the link is broken – treat as raster
            // so the user sees a warning rather than silently skipping it.
            return true;
        }
    }

    // Build a plain Array snapshot – the live collection shrinks as we embed.
    var toEmbed = [];
    for (var i = 0; i < placed.length; i++) {
        if (isRaster(placed[i])) {
            toEmbed.push(placed[i]);
        }
    }

    if (toEmbed.length === 0) {
        alert("No linked raster images found.\n" +
              "(Linked vector files such as EPS/AI/PDF are not affected.)");
        return;
    }

    // ── Embed loop ───────────────────────────────────────────────────────────

    var embedded = [];
    var failed   = [];

    for (var j = 0; j < toEmbed.length; j++) {
        var item = toEmbed[j];

        // Grab the filename before embedding (for reporting).
        var fileName = "(unknown)";
        try { fileName = item.file.name; } catch (e) {}

        try {
            item.embed();          // This is the core Illustrator API call.
            embedded.push(fileName);
        } catch (err) {
            failed.push(fileName + " — " + err.message);
        }
    }

    // ── Report ───────────────────────────────────────────────────────────────

    var msg = "";

    if (embedded.length > 0) {
        msg += "✔ Successfully embedded " + embedded.length + " image(s):\n";
        for (var k = 0; k < embedded.length; k++) {
            msg += "   • " + embedded[k] + "\n";
        }
    }

    if (failed.length > 0) {
        msg += "\n✖ Failed to embed " + failed.length + " image(s):\n";
        for (var m = 0; m < failed.length; m++) {
            msg += "   • " + failed[m] + "\n";
        }
        msg += "\nCommon causes: missing/moved source file, read-only media, " +
               "or a corrupt link. Re-link the file via the Links panel and " +
               "run the script again.";
    }

    alert(msg || "Nothing was changed.");

}());
