'use client'

import { destroyProperty } from '@/actions/property'
import { Button } from '@/components/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from '@/components/dialog'
import { useToast } from '@/components/use-toast'
import { useState } from 'react'

interface DialogDeletePropertyProps {
  id: string
  children: React.ReactNode
}

export function DialogPropertyDelete({ id, children }: DialogDeletePropertyProps) {
  const [open, setOpen] = useState<boolean>(false)
  const { toast } = useToast()

  const submit = async () => {
    const res = await destroyProperty(id)
    const { error } = res as any 

    if (error) {
      toast({
        title: 'Não foi possível excluir o imóvel!',
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Imóvel deletado com sucesso!',
      })
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar exclusão do imóvel</DialogTitle>
          <DialogDescription>
            Tem certeza de que deseja excluir este imóvel? Esta ação é
            irreversível e removerá permanentemente o imóvel do sistema.
          </DialogDescription>
        </DialogHeader>
        <form action={submit}>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" type="submit">
              Excluir
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
