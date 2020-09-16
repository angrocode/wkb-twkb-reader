
export function wkb_reader(data) {

    data = String(data);

    if (data.startsWith('00') && data.startsWith('01') && data.startsWith('0x') || data.length < 18 || data.length % 2 !== 0) {
        throw new Error('WkbReader: no valid data');
    }

    if (data.startsWith('0x')) data = data.substr(2);

    const buffer = new ArrayBuffer(data.length * 2);
    const view = new DataView(buffer);

    new Uint8Array(buffer).set(data.match(/[\da-fA-F]{2}/gi).map(function (h) {
        return parseInt(h, 16)
    }), 0);

    Object.freeze(buffer);

    const gtype_name = {
        1:  'POINT', 2:  'LINESTRING', 3:  'POLYGON', 4:  'MULTIPOINT', 5:  'MULTILINESTRING',
        6:  'MULTIPOLYGON', 7:  'GEOMETRYCOLLECTION', 8:  'CIRCULARSTRING', 9:  'COMPOUNDCURVE',
        10: 'CURVEPOLYGON', 11: 'MULTICURVE', 12: 'MULTISURFACE', 15: 'POLYHEDRALSURFACE',
        16: 'TIN', 17: 'TRIANGLE'
    }

    const ptype_name = {
        0: '2D', 1: 'Z', 2: 'M', 3: 'ZM', 128: 'Z', 64: 'M', 192: 'ZM', 160: 'Z', 96: 'M', 224: 'ZM'
    }

    let offset = 0;
    let amount = 1;
    const retgeometry = {};
    const coords_name = ['X', 'Y', 'Z', 'M'];

    for (let g = 0; g < amount; g++) {

        let geometry = {};

        const lendian = !!view.getUint8(offset);
        offset += Uint8Array.BYTES_PER_ELEMENT;

        const geom = view.getUint16(lendian ? offset : offset + 2, lendian);
        const gtype = geom % 1000;
        const ptype = !!(geom / 1000 | 0) ? (geom / 1000 | 0) : view.getUint8(lendian ? offset + 3 : offset);
        offset += Uint32Array.BYTES_PER_ELEMENT;

        if (gtype_name[gtype] === undefined) throw new Error('WkbReader: no support geometry type');
        if (ptype_name[ptype] === undefined) throw new Error('WkbReader: no support point type');

        geometry.type = gtype;
        geometry.name = ptype !== 0 && ptype !== 32 ? gtype_name[gtype] + ' ' + ptype_name[ptype] : gtype_name[gtype];

        if ([32, 160, 96, 224].includes(ptype)) { // srid
            geometry.srid = view.getUint32(offset, lendian);
            offset += Uint32Array.BYTES_PER_ELEMENT;
        }

        if (![1, 3, 2, 8, 17].includes(gtype)) { // collection
            amount += view.getUint32(offset, lendian);
            offset += Uint32Array.BYTES_PER_ELEMENT;
            retgeometry['g' + g] = geometry;
            continue;
        }

        let c1 = 1
        let c2 = 1;
        let c3 = 2;
        if (![0].includes(ptype)) c3 = 3;
        if ([3, 192, 224].includes(ptype)) c3 = 4;
        if ([3, 17].includes(gtype)) { // polygon, triangle
            c1 = view.getUint32(offset, lendian);
            offset += Uint32Array.BYTES_PER_ELEMENT;
        }
        geometry.coords = {}

        for (let l = 0; l < c1; l++) { // linear ring

            let po = {};

            if (![1].includes(gtype)) { // - point
                c2 = view.getUint32(offset, lendian);
                offset += Uint32Array.BYTES_PER_ELEMENT;
            }

            for (let p = 0; p < c2; p++) { // point

                po['p' + p] = {};

                for (let c = 0; c < c3; c++) { // coordinates

                    if (c === 2 && [2, 64, 96].includes(ptype)) c = 3;
                    po['p' + p][coords_name[c]] = view.getFloat64(offset, lendian);
                    offset += Float64Array.BYTES_PER_ELEMENT;

                }

            }

            if ([3, 17].includes(gtype)) {
                geometry.coords['p' + l] = po;
            } else {
                geometry.coords = po;
            }

        }

        retgeometry['g' + g] = geometry;

    }

    return retgeometry;

}

