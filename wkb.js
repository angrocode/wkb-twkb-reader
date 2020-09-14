
export class WkbReader {

    static geom_type = {
        1: {type: 1, name: 'POINT'},
        2: {type: 2, name: 'LINESTRING'},
        3: {type: 3, name: 'POLYGON'},
        4: {type: 4, name: 'MULTIPOINT'},
        5: {type: 5, name: 'MULTILINESTRING'},
        6: {type: 6, name: 'MULTIPOLYGON'},
        7: {type: 7, name: 'GEOMETRYCOLLECTION'},
        8: {type: 8, name: 'CIRCULARSTRING'},
        9: {type: 9, name: 'COMPOUNDCURVE'},
        10: {type: 10, name: 'CURVEPOLYGON'},
        11: {type: 11, name: 'MULTICURVE'},
        12: {type: 12, name: 'MULTISURFACE'},
        15: {type: 15, name: 'POLYHEDRALSURFACE'},
        16: {type: 16, name: 'TIN'},
        17: {type: 17, name: 'TRIANGLE'}
    }

    static geom_size_pg = {
        0: {type: 1, name: '2D', size: 2, srid: false},
        128: {type: 2, name: 'Z', size: 3, srid: false},
        64: {type: 3, name: 'M', size: 3, srid: false},
        192: {type: 4, name: 'ZM', size: 4, srid: false},
        32: {type: 1, name: '2D', size: 2, srid: true},
        160: {type: 2, name: 'Z', size: 3, srid: true},
        96: {type: 3, name: 'M', size: 3, srid: true},
        224: {type: 4, name: 'ZM', size: 4, srid: true}
    }

    static geom_size_iso = {
        0: {type: 1, name: '2D', size: 2, srid: false},
        1: {type: 2, name: 'Z', size: 3, srid: false},
        2: {type: 3, name: 'M', size: 3, srid: false},
        3: {type: 4, name: 'ZM', size: 4, srid: false}
    }

    set set(data) {

        data = String(data);

        if (data.startsWith('00') && data.startsWith('01') && data.startsWith('0x') || data.length < 18 || data.length % 2 !== 0) {
            throw new Error('WkbReader: no valid data');
        }

        if (data.startsWith('0x')) data = data.substr(2);

        const buffer = new ArrayBuffer(data.length * 2);
        this.view = new DataView(buffer);

        new Uint8Array(buffer).set(data.match(/[\da-fA-F]{2}/gi).map(function (h) {
            return parseInt(h, 16)
        }), 0);

        Object.freeze(buffer);

    }

    get get() {

        const geometry = this._byteMatrix();
        this._coordinates(geometry);
        return geometry;

    }

    _byteMatrix() {

    // return {type: 1, name: "POINT M", srid: false, byteStart: 9, byteData: 14, byteEnd: 38, dimension: {}}

        const view = this.view;
        const matrix = {};
        let offset = 0;
        let amount = 1;

        for (let g = 0; g < amount; g++) {

            matrix['g' + g] = {};

            let start = offset;
            let linearRing = 0;
            let points = 0;

            const lendian = !!view.getUint8(offset);
            offset += Uint8Array.BYTES_PER_ELEMENT;

            const geom = view.getUint16(lendian ? offset : offset + 2, lendian);
            const type = WkbReader.geom_type[geom % 1000];
            const dimPG = view.getUint8(lendian ? offset + 3 : offset);
            const dimISO = geom / 1000 | 0;
            const dimension = dimPG > dimISO ? WkbReader.geom_size_pg[dimPG] : WkbReader.geom_size_iso[dimISO];
            offset += Uint32Array.BYTES_PER_ELEMENT;

            if (type === undefined) throw new Error('WkbReader: no valid geometry type');
            if (dimension === undefined) throw new Error('WkbReader: no valid dimension');

            matrix['g' + g].type = type.type;
            matrix['g' + g].name = dimension.type > 1 ? type.name + ' ' + dimension.name : type.name;

            if (dimension.srid) {
                matrix['g' + g].srid = +view.getUint32(offset, lendian);
                offset += Uint32Array.BYTES_PER_ELEMENT;
            } else {
                matrix['g' + g].srid = false;
            }

            matrix['g' + g].byteStart = start;

            switch (type.type) {

                case 1: // 'POINT'
                    matrix['g' + g].byteData = offset;

                    offset += (Float64Array.BYTES_PER_ELEMENT * dimension.size);

                    matrix['g' + g].byteEnd = offset;
                    break;
                case 2: // 'LINESTRING'
                case 8: // 'CIRCULARSTRING'
                    matrix['g' + g].byteData = offset;

                    points = +view.getUint32(offset, lendian);
                    offset += Uint32Array.BYTES_PER_ELEMENT;
                    offset += (Float64Array.BYTES_PER_ELEMENT * (points * dimension.size));

                    matrix['g' + g].byteEnd = offset;
                    break;
                case 3: // 'POLYGON'
                case 17: // 'TRIANGLE'
                    matrix['g' + g].byteData = offset;

                    linearRing = +view.getUint32(offset, lendian);
                    offset += Uint32Array.BYTES_PER_ELEMENT;

                    for (let i = 0; i < linearRing; i++) {
                        points = +view.getUint32(offset, lendian);
                        offset += Uint32Array.BYTES_PER_ELEMENT;
                        offset += (Float64Array.BYTES_PER_ELEMENT * (points * dimension.size));
                    }

                    matrix['g' + g].byteEnd = offset;
                    break;
                case 4: // 'MULTIPOINT'
                case 5: // 'MULTILINESTRING'
                case 6: // 'MULTIPOLYGON'
                case 7: // 'GEOMETRYCOLLECTION'
                case 9: // 'COMPOUNDCURVE'
                case 10: // 'CURVEPOLYGON'
                case 11: // 'MULTICURVE'
                case 12: // 'MULTISURFACE'
                case 15: // 'POLYHEDRALSURFACE'
                case 16: // 'TIN'
                    amount += +view.getUint32(offset, lendian);
                    offset += Uint32Array.BYTES_PER_ELEMENT;

                    matrix['g' + g].byteEnd = offset;
                    break;
            }

            matrix['g' + g].dimension = dimension;

        }

        return matrix;

    }

    _coordinates(geometry) {

    // return {type: 1, name: "POINT M", srid: false, byteStart: 9, byteData: 14, byteEnd: 38, dimension: {}, points: {{}}}

        const view = this.view;
        const byteMatrix = geometry;
        const coords_name = ['X', 'Y', 'Z', 'M'];
        let offset = 0;

        const lendian = !!view.getUint8(offset);

        for (let g = 0; g < Object.keys(byteMatrix).length; g++) {

            byteMatrix['g' + g].points = {};

            let linearRing = 0;
            let amount = 0;
            offset = byteMatrix['g' + g].byteData;

            switch (byteMatrix['g' + g].type) {

                case 1: // 'POINT'
                    byteMatrix['g' + g]['points']['p' + 0] = {}
                    for (let c = 0; c < byteMatrix['g' + g].dimension.size; c++) {
                        if (c === 2 && byteMatrix['g' + g].dimension.type === 3) c = 3;
                        byteMatrix['g' + g]['points']['p' + 0][coords_name[c]] = +view.getFloat64(offset, lendian);
                        offset += Float64Array.BYTES_PER_ELEMENT;
                    }
                    break;
                case 2: // 'LINESTRING'
                case 8: // 'CIRCULARSTRING'
                    amount = +view.getUint32(offset, lendian);
                    offset += Uint32Array.BYTES_PER_ELEMENT;

                    for (let a = 0; a < amount; a++) {
                        byteMatrix['g' + g]['points']['p' + a] = {}
                        for (let c = 0; c < byteMatrix['g' + g].dimension.size; c++) {
                            if (c === 2 && byteMatrix['g' + g].dimension.type === 3) c = 3;
                            byteMatrix['g' + g]['points']['p' + a][coords_name[c]] = +view.getFloat64(offset, lendian);
                            offset += Float64Array.BYTES_PER_ELEMENT;
                        }
                    }
                    break;
                case 3: // 'POLYGON'
                case 17: // 'TRIANGLE'
                    linearRing = +view.getUint32(offset, lendian);
                    offset += Uint32Array.BYTES_PER_ELEMENT;

                    for (let p = 0; p < linearRing; p++) {

                        byteMatrix['g' + g]['points']['p' + p] = {}

                        amount = +view.getUint32(offset, lendian);
                        offset += Uint32Array.BYTES_PER_ELEMENT;

                        for (let a = 0; a < amount; a++) {
                            byteMatrix['g' + g]['points']['p' + p]['p' + a] = {}
                            for (let c = 0; c < byteMatrix['g' + g].dimension.size; c++) {
                                if (c === 2 && byteMatrix['g' + g].dimension.type === 3) c = 3;
                                byteMatrix['g' + g]['points']['p' + p]['p' + a][coords_name[c]] = +view.getFloat64(offset, lendian);
                                offset += Float64Array.BYTES_PER_ELEMENT;
                            }
                        }
                    }
                    break;
                case 4: // 'MULTIPOINT'
                case 5: // 'MULTILINESTRING'
                case 6: // 'MULTIPOLYGON'
                case 7: // 'GEOMETRYCOLLECTION'
                case 9: // 'COMPOUNDCURVE'
                case 10: // 'CURVEPOLYGON'
                case 11: // 'MULTICURVE'
                case 12: // 'MULTISURFACE'
                case 15: // 'POLYHEDRALSURFACE'
                case 16: // 'TIN'

            }

        }

    }

}
