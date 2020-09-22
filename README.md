## wkb reader ISO/IEC 13249-3 and PostGis

#### support
2020 year; [OGC 06-103r4](https://www.ogc.org/standards/sfa), [PostGIS 3.0](https://postgis.net/documentation/)
| Type               |        OGC       |        PG        |
|:-------------------|:----------------:|:----------------:|
| Geometry           |:heavy_check_mark:|:heavy_check_mark:|
| Point              |:heavy_check_mark:|:heavy_check_mark:|
| LineString         |:heavy_check_mark:|:heavy_check_mark:|
| Polygon            |:heavy_check_mark:|:heavy_check_mark:|
| MultiPoint         |:heavy_check_mark:|:heavy_check_mark:|
| MultiLineString    |:heavy_check_mark:|:heavy_check_mark:|
| MultiPolygon       |:heavy_check_mark:|:heavy_check_mark:|
| GeometryCollection |:heavy_check_mark:|:heavy_check_mark:|
| CircularString     |       :x:        |:heavy_check_mark:|
| CompoundCurve      |       :x:        |:heavy_check_mark:|
| CurvePolygon       |       :x:        |:heavy_check_mark:|
| MultiCurve         |       :x:        |:heavy_check_mark:|
| MultiSurface       |       :x:        |:heavy_check_mark:|
| Curve              |       :x:        |:heavy_check_mark:|
| Surface            |       :x:        |:heavy_check_mark:|
| PolyhedralSurface  |:heavy_check_mark:|:heavy_check_mark:|
| TIN                |:heavy_check_mark:|:heavy_check_mark:|
| Triangle           |:heavy_check_mark:|:heavy_check_mark:|
| Circle             |       :x:        |       :x:        |
| GeodesicString     |       :x:        |       :x:        |
| EllipticalCurve    |       :x:        |       :x:        |
| NurbsCurve         |       :x:        |       :x:        |
| Clothoid           |       :x:        |       :x:        |
| SpiralCurve        |       :x:        |       :x:        |
| CompoundSurface    |       :x:        |       :x:        |
| BrepSolid          |       :x:        |       :x:        |
| AffinePlacement    |       :x:        |       :x:        |

**[ISO/IEC 13249-3:2016](https://www.iso.org/standard/60343.html)**

**The ST_Geometry type is the maximal supertype of the geometry type hierarchy. The ST_Geometry type
is not instantiable.** The instantiable subtypes of the ST_Geometry type are 0-dimensional geometry, 1-
dimensional geometry, and 2-dimensional geometry types that exist in two-dimensional coordinate space
(R2), three-dimensional coordinate space (R3) or four-dimensional coordinate space (R4). ST_Geometry
values in R2 have points with x and y coordinate values. ST_Geometry values in R3 have points
exclusively with x y and z coordinate values or exclusively with x, y and m coordinate values.
ST_Geometry values in R4 have points with x, y, z and m coordinate values.

**ST_Geometry, ST_Curve, and ST_Surface are not instantiable types. No constructor functions are
defined for these types.**

The following geometry types are defined: ST_Geometry, ST_Point, ST_Curve, ST_LineString,
ST_CircularString, ST_Circle, ST_GeodesicString, ST_EllipticalCurve, ST_NURBSCurve, ST_Clothoid,
ST_SpiralCurve, ST_CompoundCurve, ST_Surface, ST_CurvePolygon, ST_Polygon, ST_Triangle,
ST_PolyhdrlSurface, ST_TIN,ST_GeomCollection, ST_MultiPoint, ST_MultiCurve, ST_MultiLineString,
ST_MultiSurface, and ST_MultiPolygon.

ST_Point, ST_LineString, ST_CircularString, ST_Circle, ST_GeodesicString, ST_EllipticalCurve,
ST_NURBSCurve, ST_Clothoid, ST_SpiralCurve, ST_CompoundCurve, ST_CurvePolygon, ST_Polygon,
ST_Triangle, ST_PolyhdrlSurface, ST_TIN, ST_GeomCollection, ST_MultiPoint, ST_MultiCurve,
ST_MultiLineString, ST_MultiSurface, and ST_MultiPolygon are instantiable and have constructor
functions.

ST_TINElement is a support type. It is used by the ST_TIN geometry type to specify information about
the TIN surface, other than just its triangles. Each ST_TINElement contains an ST_Geometry.

The z coordinate is a coordinate of a point typically, but not necessarily, considered to represent altitude.
The m coordinate is a coordinate of a point representing arbitrary measurement. ST_Geometry values
that have the m coordinate value are key to supporting linear networking applications such as street
routing, transportation, pipeline, telecommunications network, and utility management.

#### ISO/IEC 13249-3 geometry type and dimension marking
| Type               |  2D  |  Z   |  M   |  ZM  |
|:-------------------|:----:|:----:|:----:|:----:|
| Geometry           | 0000 | 1000 | 2000 | 3000 |
| Point              | 0001 | 1001 | 2001 | 3001 |
| LineString         | 0002 | 1002 | 2002 | 3002 |
| Polygon            | 0003 | 1003 | 2003 | 3003 |
| MultiPoint         | 0004 | 1004 | 2004 | 3004 |
| MultiLineString    | 0005 | 1005 | 2005 | 3005 |
| MultiPolygon       | 0006 | 1006 | 2006 | 3006 |
| GeometryCollection | 0007 | 1007 | 2007 | 3007 |
| CircularString     | 0008 | 1008 | 2008 | 3008 |
| CompoundCurve      | 0009 | 1009 | 2009 | 3009 |
| CurvePolygon       | 0010 | 1010 | 2010 | 3010 |
| MultiCurve         | 0011 | 1011 | 2011 | 3011 |
| MultiSurface       | 0012 | 1012 | 2012 | 3012 |
| Curve              | 0013 | 1013 | 2013 | 3013 |
| Surface            | 0014 | 1014 | 2014 | 3014 |
| PolyhedralSurface  | 0015 | 1015 | 2015 | 3015 |
| TIN                | 0016 | 1016 | 2016 | 3016 |
| Triangle           | 0017 | 1017 | 2017 | 3017 |
| Circle             | 0018 | 1018 | 2018 | 3018 |
| GeodesicString     | 0019 | 1019 | 2019 | 3019 |
| EllipticalCurve    | 0020 | 1020 | 2020 | 3020 |
| NurbsCurve         | 0021 | 1021 | 2021 | 3021 |
| Clothoid           | 0022 | 1022 | 2022 | 3022 |
| SpiralCurve        | 0023 | 1023 | 2023 | 3023 |
| CompoundSurface    | 0024 | 1024 | 2024 | 3024 |
| BrepSolid          |      | 1025 |      |      |
| AffinePlacement    | 102  | 1102 |      |      |

#### postgis geometry dimension marking
| Type               |  2D  |  Z   |  M   |  ZM  |
|:-------------------|:----:|:----:|:----:|:----:|
| OGC 2D             |   0  | 128  |  64  | 192  |

#### postgis srid
| Type               |  2D |  Z  |  M  | ZM  | SRID |
|:-------------------|:---:|:---:|:---:|:---:|:----:|
| OGC 2D             | +32 | +32 | +32 | +32 |Uint32|

## Type structure

**Endianness:** [wiki](https://en.wikipedia.org/wiki/Endianness)

**Type, Dim + PG Dim:**
Data field according to standard Uint32.
For marking type and dimension ISO/IEC 13249-3, Uint16 is sufficient.
The last byte of the field (Uint32) contains the marking dimension PostGIS.



#### Point
|Endianness|Type, Dim + PG Dim|X Y Z M|
|:--------:|:----------------:|:-----:|
| Uint8    | Uint16 + Uint8   |Float64|

#### LineString, CircularString
|Endianness|Type, Dim + PG Dim|Amount Points|X Y Z M|
|:--------:|:----------------:|:-----------:|:-----:|
| Uint8    | Uint16 + Uint8   | Uint32      |Float64|

#### Polygon, Triangle
|Endianness|Type, Dim + PG Dim|Amount LinearRing|Amount Points|X Y Z M|
|:--------:|:----------------:|:---------------:|:-----------:|:-----:|
| Uint8    | Uint16 + Uint8   | Uint32          | Uint32      |Float64|

#### Collection
**MultiPoint, MultiLineString, MultiPolygon, GeometryCollection, CompoundCurve, CurvePolygon, MultiCurve, MultiSurface, PolyhedralSurface, TIN**
|Endianness|Type, Dim + PG Dim|   Amount    |          Geometry             |
|:--------:|:----------------:|:-----------:|:-----------------------------:|
| Uint8    | Uint16 + Uint8   | Uint32      |Including endianness, type, ...|


## twkb reader
[TWKB](https://github.com/TWKB)
