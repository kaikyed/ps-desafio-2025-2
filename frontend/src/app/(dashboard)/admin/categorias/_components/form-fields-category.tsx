'use client'

import { Button } from '@/components/button'
import {
  FormFieldsGroup,
  FormField,
} from '@/components/dashboard/form'
import { DialogFooter } from '@/components/dialog'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { cn } from '@/lib/utils'
import { ResponseErrorType } from '@/services/api'
import { propertyCategoryType } from '@/types/property-category'
import { useFormStatus } from 'react-dom'

interface FormFieldsCategoryProps {
  category?: propertyCategoryType | null
  readOnly?: boolean
  error?: ResponseErrorType | null
}

export default function FormFieldsCategory({
  category,
  readOnly,
  error,
}: FormFieldsCategoryProps) {
  const { pending } = useFormStatus()

  return (
    <>
      <FormFieldsGroup>
        {category && (
          <Input defaultValue={category.id} type="text" name="id" hidden />
        )}
        
        <FormField>
          <Label htmlFor="name" required={!readOnly}>Nome</Label>
          <Input
            id="name"
            name="name"
            placeholder="Ex: Apartamento, Casa, Terreno"
            defaultValue={category?.name}
            readOnly={readOnly}
          />
          {/* Correção: Exibindo o erro fora do Input */}
          {error?.errors?.name && (
            <span className="text-xs text-destructive mt-1">
              {error.errors.name}
            </span>
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
