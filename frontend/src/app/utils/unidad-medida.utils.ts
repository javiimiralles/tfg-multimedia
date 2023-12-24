
export const getAbrebiaturaUnidadMedida = (unidadMedida: string): string => {
  switch(unidadMedida.toLowerCase()) {
    case 'gramos':
      return 'g';
    case 'kilos':
    case 'kilogramos':
      return 'kg'
    case 'mililitros':
      return 'ml';
    case 'litros':
      return 'l';
    default:
      return unidadMedida;
  }
}
