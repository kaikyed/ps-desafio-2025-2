'use client'

import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/dialog'
import FormFieldsProperty from './form-fields-property'
import { PropertyType } from '@/types/property'
import { api } from '@/services/api'
import { useEffect, useState } from 'react'
import { useToast } from '@/components/use-toast'

interface DialogInformationPropertyProps {
  id: string
  children: React.ReactNode
  isInformation?: boolean
}

export function DialogInformationProperty({
  id,
  children,
}: DialogInformationPropertyProps) {
  const [property, setProperty] = useState<PropertyType | null>(null)
  const [open, setOpen] = useState<boolean>(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
        const requestData = async () => {
        const { response } = await api<PropertyType>('GET', `/properties/${id}`)

        if (response) {
            setProperty(response)
        } else {
            setProperty(null)
            toast({
            title: 'Imóvel não encontrado!',
            variant: 'destructive'
            })
            setOpen(false)
        }
        }
        requestData()
    }
    return () => setProperty(null)
  }, [id, open, toast])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Informações do imóvel</DialogTitle>
          <DialogDescription>
            Visualize as informações detalhadas do imóvel abaixo.
          </DialogDescription>
        </DialogHeader>
        {property ? (
            <FormFieldsProperty property={property} readOnly />
        ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">Carregando informações...</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
