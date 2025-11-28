'use client'

import { Button } from '@/components/button'
import {
  FormFieldsGroup,
  FormField,
  handleImageChange,
} from '@/components/dashboard/form'
import { DialogFooter } from '@/components/dialog'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { cn } from '@/lib/utils'
import { ResponseErrorType, api } from '@/services/api'
import { PropertyType } from '@/types/property'
import { propertyCategoryType } from '@/types/property-category'
import { useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { LuImage } from 'react-icons/lu'

interface FormFieldsPropertyProps {
  property?: PropertyType | null
  readOnly?: boolean
  error?: ResponseErrorType | null
}

export default function FormFieldsProperty({
  property,
  readOnly,
  error,
}: FormFieldsPropertyProps) {
  const { pending } = useFormStatus()
  
  const [updateImage, setUpdateImage] = useState<string | undefined>(property?.image)
  const [categories, setCategories] = useState<propertyCategoryType[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      const { response } = await api<propertyCategoryType[]>('GET', '/property-categories')
      if (response) {
        setCategories(response)
      }
    }
    fetchCategories()
  }, [])

  return (
    <>
      <FormFieldsGroup>
        {property && (
          <Input defaultValue={property.id} type="text" name="id" hidden />
        )}

        {/* --- Upload de Imagem --- */}
        <div className="flex flex-col items-center justify-center mb-6 gap-4">
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground bg-muted overflow-hidden">
                {updateImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={updateImage}
                        alt="Preview do imóvel"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <LuImage className="h-10 w-10 text-muted-foreground" />
                )}
            </div>
            
            {!readOnly && (
                <div className="w-full max-w-xs">
                    <Label htmlFor="image" className="sr-only">Imagem do Imóvel</Label>
                    <Input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        className="cursor-pointer"
                        onChange={(e) => handleImageChange(e, setUpdateImage)}
                    />
                     {error?.errors?.image && (
                        <span className="text-xs text-destructive mt-1 block text-center">{error.errors.image}</span>
                    )}
                </div>
            )}
        </div>

        {/* --- Nome do Imóvel --- */}
        <FormField>
          <Label htmlFor="name" required={!readOnly}>Nome do Imóvel</Label>
          <Input
            id="name"
            name="name"
            placeholder="Ex: Apartamento Centro"
            defaultValue={property?.name}
            readOnly={readOnly}
          />
          {error?.errors?.name && (
            <span className="text-xs text-destructive mt-1">{error.errors.name}</span>
          )}
        </FormField>

        {/* --- Grid: Preço e Tipo --- */}
        <div className="grid grid-cols-2 gap-4">
          <FormField>
            <Label htmlFor="price" required={!readOnly}>Preço</Label>
            <Input
              id="price"
              name="price"
              type="text" 
              placeholder="0.00"
              defaultValue={property?.price}
              readOnly={readOnly}
            />
            {error?.errors?.price && (
              <span className="text-xs text-destructive mt-1">{error.errors.price}</span>
            )}
          </FormField>

          <FormField>
            <Label htmlFor="type" required={!readOnly}>Tipo</Label>
            <Input
              id="type"
              name="type"
              placeholder="Ex: Casa, Apto"
              defaultValue={property?.type}
              readOnly={readOnly}
            />
            {error?.errors?.type && (
              <span className="text-xs text-destructive mt-1">{error.errors.type}</span>
            )}
          </FormField>
        </div>

        {/* --- Categoria (Select) --- */}
        <FormField>
          <Label htmlFor="property_category_id" required={!readOnly}>Categoria</Label>
          <select
            id="property_category_id"
            name="property_category_id"
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            defaultValue={property?.property_category_id || ''}
            disabled={readOnly}
          >
            <option value="" disabled>Selecione uma categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {error?.errors?.property_category_id && (
            <span className="text-xs text-destructive mt-1">{error.errors.property_category_id}</span>
          )}
        </FormField>

        {/* --- CORREÇÃO AQUI: Trocado Data por Select Sim/Não --- */}
        <FormField>
          <Label htmlFor="acquired" required={!readOnly}>Já foi adquirido?</Label>
          <div className="relative">
            <select
              id="acquired"
              name="acquired"
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              // Se tiver valor true/1 vira "1", senão "0"
              defaultValue={property?.acquired ? '1' : '0'}
              disabled={readOnly}
            >
              <option value="0">Não (Disponível)</option>
              <option value="1">Sim (Vendido/Adquirido)</option>
            </select>
          </div>
          {error?.errors?.acquired && (
            <span className="text-xs text-destructive mt-1">{error.errors.acquired}</span>
          )}
        </FormField>

        {/* --- Descrição --- */}
        <FormField>
          <Label htmlFor="description">Descrição</Label>
          <textarea
            id="description"
            name="description"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Detalhes sobre o imóvel..."
            defaultValue={property?.description}
            readOnly={readOnly}
          />
          {error?.errors?.description && (
            <span className="text-xs text-destructive mt-1">{error.errors.description}</span>
          )}
        </FormField>

      </FormFieldsGroup>

      <DialogFooter className={cn({ hidden: readOnly })}>
        <Button type="submit" pending={pending}>
          Salvar
        </Button>
      </DialogFooter>
    </>
  )
}
