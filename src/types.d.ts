export interface PropsListado<T> {
  datos: T[]
  children?: React.ReactNode | React.ReactNode[]
}

export interface Pronostico {
  nombre: string
  fecha: string
  hora: string
  temperature: number
  poP: number
  url: string
}

export interface RawData {
  text: string
}
