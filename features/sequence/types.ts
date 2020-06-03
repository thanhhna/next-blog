export interface Coordinate {
  x: number,
  y: number
}

export interface Position {
  x: number,
  y: number,
  value: number
}

export interface BoxData {
  coordinate: Coordinate,
  id: number,
  position?: Position,
  style: {
    left: number,
    top: number
  }
}