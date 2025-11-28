import { DashboardContainer } from '@/components/dashboard/dashboard-items'
import {
  TabbleCellImage,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/dashboard/table'
import { api } from '@/services/api'
import { PropertyType } from '@/types/property'
import { Button } from '@/components/button'
import { LuInfo, LuPen, LuPlusCircle, LuTrash } from 'react-icons/lu'
import { DialogUpdateProperty } from './dialog-update-property'
import { DialogPropertyDelete } from './dialog-delete-property'
import { DialogInformationProperty } from './dialog-information-property'
import { DialogCreateProperty } from './dialog-create-property'

export default async function ListProperties() {
  const { response } = await api<PropertyType[]>('GET', '/properties')

  if (!response) {
    return (
      <DashboardContainer className="text-destructive">
        Não foi possível obter os imóveis.
      </DashboardContainer>
    )
  }

  // --- AQUI ESTÁ A CORREÇÃO ---
  // Higieniza os dados para garantir que são apenas objetos simples (Plain Objects)
  // Isso remove classes e transforma datas em string, resolvendo o erro do Next.js.
  const properties: PropertyType[] = JSON.parse(JSON.stringify(response))

  return (
    <>
      <DashboardContainer className="flex h-min justify-between space-x-0 gap-y-2.5 max-sm:flex-col">
        <DialogCreateProperty>
          <Button size="sm">
            <LuPlusCircle className="mr-2" />
            Novo imóvel
          </Button>
        </DialogCreateProperty>
      </DashboardContainer>
      <DashboardContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties?.map((property: PropertyType) => (
              <TableRow key={property.id}>
                <TableCell>
                  <TabbleCellImage src={property.image} />
                </TableCell>
                
                <TableCell>{property.name}</TableCell>
                <TableCell>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price)}
                </TableCell>
                {/* Garante que property_category existe antes de acessar o name */}
                <TableCell>{property.property_category?.name}</TableCell>
                
                <TableCell className="flex justify-end gap-2">
                  <DialogInformationProperty id={property.id}>
                    <Button variant="default-inverse" size="icon">
                      <LuInfo />
                    </Button>
                  </DialogInformationProperty>
                  <DialogUpdateProperty id={property.id}>
                    <Button variant="secondary-inverse" size="icon">
                      <LuPen />
                    </Button>
                  </DialogUpdateProperty>
                  <DialogPropertyDelete id={property.id}>
                    <Button variant="destructive-inverse" size="icon">
                      <LuTrash />
                    </Button>
                  </DialogPropertyDelete>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {!properties.length && (
            <TableCaption>Nenhum imóvel encontrado.</TableCaption>
          )}
        </Table>
      </DashboardContainer>
    </>
  )
}