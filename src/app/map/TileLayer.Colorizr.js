/*
 * L.TileLayer.ColorMapper is a regular tilelayer with mapped colors.
 */

L.TileLayer.Colorizr = L.TileLayer.extend({
    options: {
        // quotaRed: 21,
        // quotaGreen: 71,
        // quotaBlue: 8,
        // quotaDividerTune: 0,
        // quotaDivider: function() {
        //     return this.quotaRed + this.quotaGreen + this.quotaBlue + this.quotaDividerTune;
        // }
    },

    initialize: function (url, options) {
        options.crossOrigin = true;
        L.TileLayer.prototype.initialize.call(this, url, options);

        this.on('tileload', function(e) {
            this._mapColor(e.tile);
        });
    },

    _createTile: function () {
        var tile = L.TileLayer.prototype._createTile.call(this);
        tile.crossOrigin = "Anonymous";
        return tile;
    },

    _mapColor: function (img) {
        if (img.getAttribute('data-grayscaled'))
            return;

        img.crossOrigin = '';
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var pix = imgd.data;
        for (var i = 0, n = pix.length; i < n; i += 4) {
            var r = pix[i];
            var g = pix[i+1];
            var b = pix[i+2];
            var a = pix[i+3];

            if((r+g+b) < 100 && a > 0.1) { // assume black
                r = 255;
                g = 255;
                b = 255;
            }
            else {
                pix[i]   = 246;
                pix[i+1] = 36;
                pix[i+2] = 89;
            }
            
        }
        ctx.putImageData(imgd, 0, 0);
        img.setAttribute('data-grayscaled', true);
        img.src = canvas.toDataURL();
    }
    
});

L.tileLayer.colorizr = function (url, options) {
    return new L.TileLayer.Colorizr(url, options);
};