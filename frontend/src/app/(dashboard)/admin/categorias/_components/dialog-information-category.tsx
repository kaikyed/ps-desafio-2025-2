'use client'

import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/dialog'
import FormFieldsCategory from './form-fields-category'
// CORREÇÃO: Importando do arquivo correto
import { propertyCategoryType } from '@/types/property-category'
import { api } from '@/services/api'
import { useEffect, useState } from 'react'
import { useToast } from '@/components/use-toast'

interface DialogInformationCategoryProps {
  id: string
  children: React.ReactNode
}

export function DialogInformationCategory({
  id,
  children,
}: DialogInformationCategoryProps) {
  const [category, setCategory] = useState<propertyCategoryType | null>(null)
  const [open, setOpen] = useState<boolean>(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
        const requestData = async () => {
        const { response } = await api<propertyCategoryType>('GET', `/property-categories/${id}`)

        if (response) {
            setCategory(response)
        } else {
            setCategory(null)
            toast({
            title: 'Categoria não encontrada!',
            variant: 'destructive'
            })
            setOpen(false)
        }
        }
        requestData()
    }
    
    return () => setCategory(null)
  }, [id, open, toast])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Informações da categoria</DialogTitle>
          <DialogDescription>
            Visualize as informações detalhadas da categoria abaixo.
          </DialogDescription>
        </DialogHeader>
        {category ? (
          <FormFieldsCategory category={category} readOnly />
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">Carregando informações...</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
