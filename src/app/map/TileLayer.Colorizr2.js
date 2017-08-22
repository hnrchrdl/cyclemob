/*
 * L.TileLayer.Colorizr is a regular tilelayer with mapped colors.

 */

L.TileLayer.Colorizr = L.TileLayer.extend({

    initialize: function (url, options) {
        options = L.extend({}, L.TileLayer.prototype.options, {
            colorMappings: [],
            defaultColor: null,
            processTransparentPixels: false,
            crossOrigin: true
        }, options);
        L.TileLayer.prototype.initialize.call(this, url, options);
        L.setOptions(this, options);

        // go ahead and save our settings
        this.setDefaultColor(this.options.defaultColor);
        this.setColorMaps(this.options.colorMappings);

        this.on('tileload', function(e) {
            this._mapColor(e.tile);
        });
    },

    setDefaultColor: function(rgba) {

        if(rgba !== null && !this._isRGBA(rgba)) {
            throw "L.TileLayer.Colorizr expected defaultColor to be valid rgba object or else null";
        }

        this.options.defaultColor = rgba;
        this.redraw(true);
    },

    setColorMaps: function(mappings) {
        if(!mappings || mappings.constructor !== Array) {
            throw "L.TileLayer.Colorizr expected colorMappings to be an array";
        }
        for(var i = 0, n = mappings.length; i < n; i += 1) {
            if(!this._isRGBA(mappings[i].from) || !this._isRGBA(mappings[i].to)) {
                throw "L.TileLayer.Colorizr expected colorMappings to contain valid rgba objects";
            }
            if(mappings[i].tolerance === null || typeof mappings[i].tolerance === 'undefined') {
                // sets tolerance to 0 by default
                mappings[i].tolerance = 0;
            }

        }

        this.options.colorMappings = mappings;
        this.redraw(true);
    },

    _isRGBA: function(rgba) {
        return (
            !!rgba && typeof rgba === 'object' && 
            (this._channelIsEmpty(rgba, 'r') || (rgba.hasOwnProperty('r') && typeof rgba.r === 'number')) &&
            (this._channelIsEmpty(rgba, 'g') || (rgba.hasOwnProperty('g') && typeof rgba.g === 'number')) && 
            (this._channelIsEmpty(rgba, 'b') || (rgba.hasOwnProperty('b') && typeof rgba.b === 'number')) &&
            (this._channelIsEmpty(rgba, 'a') || (rgba.hasOwnProperty('a') && typeof rgba.a === 'number'))
        );
    },

    _channelIsEmpty: function(rgba, name) {
        return rgba[name] === null || typeof rgba[name] === 'undefined';
    },

    _pixelIsMatched: function(pixel, color, tolerance) {
        return (
            (this._channelIsEmpty(color, 'r') || (pixel.r >= (color.r - tolerance) && pixel.r <= (color.r + tolerance))) &&
            (this._channelIsEmpty(color, 'g') || (pixel.g >= (color.g - tolerance) && pixel.g <= (color.g + tolerance))) &&
            (this._channelIsEmpty(color, 'b') || (pixel.b >= (color.b - tolerance) && pixel.b <= (color.b + tolerance))) &&
            (this._channelIsEmpty(color, 'a') || (pixel.a >= (color.a - tolerance) && pixel.a <= (color.a + tolerance)))
        );
    },

    _createTile: function () {
        var tile = L.TileLayer.prototype._createTile.call(this);
        tile.crossOrigin = "Anonymous";
        return tile;
    },

    _mapColor: function (img) {
        if (img.getAttribute('data-colorized'))
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

            // iterate through the pixels

            var pixelIsMapped = false;

            var pixel = {
                r: pix[i],
                g: pix[i+1],
                b: pix[i+2],
                a: pix[i+3]
            };

            if(pixel.a > 0 || this.options.processTransparentPixels === true) { // ignore transparent pixels
                
                var newColor = this.options.defaultColor;
                var mappings = this.options.colorMappings;
                
                mapping:
                for(var ii = 0, nn = mappings.length; ii < nn; ii += 1) {

                    // iterate through the color mappings

                    if(this._pixelIsMatched(pixel, mappings[ii].from, mappings[ii].tolerance)) {
                        // color matches
                        // set color to mapped color

                        newColor = {
                            r: mappings[ii].to.r,
                            g: mappings[ii].to.g,
                            b: mappings[ii].to.b,
                            a: mappings[ii].to.a,
                        };

                        break mapping; // set color and break out;

                    }
                }

                var rgba = newColor;
                
                if(!this._channelIsEmpty(rgba, 'r')) {
                    pix[i] = +rgba.r;
                }
                if(!this._channelIsEmpty(rgba, 'g')) {
                    pix[i+1] = +rgba.g;
                }
                if(!this._channelIsEmpty(rgba, 'b')) {
                    pix[i+2] = +rgba.b;
                }
                if(!this._channelIsEmpty(rgba, 'a')) {
                    pix[i+3] = +rgba.a;
                }
            }
        }

        ctx.putImageData(imgd, 0, 0);
        img.setAttribute('data-colorized', true);
        img.src = canvas.toDataURL();
    }
    
});

L.tileLayer.colorizr = function (url, options) {
    return new L.TileLayer.Colorizr(url, options);
};
