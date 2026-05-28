import React, { useEffect, useState } from 'react';
import { ImageOverlay } from 'react-leaflet';

const LeafletHeatmap = ({ data, variable = 'temperature' }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    if (!data || !data.x || !data.y || !data.z) return;

    const width = data.x.length;
    const height = data.y.length;

    if (width === 0 || height === 0) return;
    
    let maxVal = -Infinity;
    let minVal = Infinity;
    
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const val = data.z[i][j];
            if (val !== null && val !== undefined) {
                if (val > maxVal) maxVal = val;
                if (val < minVal) minVal = val;
            }
        }
    }

    // The backend sends longitudes from 0 to 360 instead of -180 to 180.
    // If we detect this, we need to shift the canvas image data so it aligns with standard -180 to 180 maps.
    let shiftPixels = 0;
    if (Math.max(...data.x) > 180) {
        // Assume 0 to 360 data. 180 is halfway.
        shiftPixels = Math.floor(width / 2);
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);

    const isLatsDescending = data.y[0] > data.y[data.y.length - 1];

    for (let i = 0; i < height; i++) {
      const canvasY = isLatsDescending ? i : (height - 1 - i);
      for (let j = 0; j < width; j++) {
        const val = data.z[i][j];
        
        // Output coordinate shift
        let shiftedJ = j - shiftPixels;
        if (shiftedJ < 0) {
            shiftedJ += width;
        }

        const index = (canvasY * width + shiftedJ) * 4;

        if (val === null || val === undefined) {
            imgData.data[index + 3] = 0; // Transparent
            continue;
        }

        const t = maxVal === minVal ? 0.5 : (val - minVal) / (maxVal - minVal);
        let r, g, b, a;

        if (variable === 'precipitation') {
            r = 255 - 255 * t;
            g = 255 - 128 * t;
            b = 255;
            a = t === 0 ? 0 : 150 + 105 * t; // Alpha mapping (150 to 255)
        } else {
            // Temperature: Blue -> Cyan -> Lime -> Yellow -> Red
            if (t <= 0.25) {
                r = 0; g = 255 * (t / 0.25); b = 255;
            } else if (t <= 0.5) {
                r = 0; g = 255; b = 255 * (1 - (t - 0.25) / 0.25);
            } else if (t <= 0.75) {
                r = 255 * ((t - 0.5) / 0.25); g = 255; b = 0;
            } else {
                r = 255; g = 255 * (1 - (t - 0.75) / 0.25); b = 0;
            }
            a = 255;
        }

        imgData.data[index] = r;
        imgData.data[index + 1] = g;
        imgData.data[index + 2] = b;
        imgData.data[index + 3] = a;
      }
    }
    
    ctx.putImageData(imgData, 0, 0);
    setImageUrl(canvas.toDataURL());

    let minLat = Math.min(...data.y);
    let maxLat = Math.max(...data.y);
    let minLon = Math.min(...data.x);
    let maxLon = Math.max(...data.x);

    const dx = 360 / (width > 1 ? width - 1 : 1);
    const dy = 180 / (height > 1 ? height - 1 : 1);

    const renderMinLat = minLat <= -80 ? -90 : Math.max(-90, minLat - dy / 2);
    const renderMaxLat = maxLat >= 80 ? 90 : Math.min(90, maxLat + dy / 2);
    const renderMinLon = (minLon <= -170 || Math.max(...data.x) > 180) ? -180 : Math.max(-180, minLon - dx / 2);
    const renderMaxLon = (maxLon >= 170 || Math.max(...data.x) > 180) ? 180 : Math.min(180, maxLon + dx / 2);

    setBounds([[renderMinLat, renderMinLon], [renderMaxLat, renderMaxLon]]);

  }, [data, variable]);

  if (!imageUrl || !bounds) return null;

  return (
    <ImageOverlay 
      url={imageUrl} 
      bounds={bounds} 
      opacity={0.65} 
    />
  );
};

export default LeafletHeatmap;
