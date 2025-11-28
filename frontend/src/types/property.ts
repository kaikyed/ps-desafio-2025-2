// Importamos APENAS para dizer ao TS o formato do campo 'property_category' abaixo
import { propertyCategoryType } from './property-category'

export type PropertyType = {
    id: string
    name: string
    description: string
    type: string
    image: string
    price: number
    acquired: string | boolean | number
    
    // Aqui está a ligação: O imóvel tem um ID de categoria...
    property_category_id: string
    
    // ... e carrega o OBJETO da categoria com ele.
    property_category: propertyCategoryType
    
    // CORREÇÃO: Usar string, pois a API retorna texto (ex: "2024-11-27T10:00:00")
    created_at?: Date
    updated_at?: Date
}